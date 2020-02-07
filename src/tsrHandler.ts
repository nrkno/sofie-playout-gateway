import {
	Conductor,
	DeviceType,
	ConductorOptions,
	Device,
	TimelineTriggerTimeResult,
	DeviceOptionsAny,
	Mappings,
	DeviceContainer,
	Timeline as TimelineTypes,
	TSRTimelineObj,
	TSRTimeline,
	TSRTimelineObjBase,
	CommandReport,
	DeviceOptionsAtem,
	AtemMediaPoolType
} from 'timeline-state-resolver'
import { CoreHandler, CoreTSRDeviceHandler } from './coreHandler'
let clone = require('fast-clone')
import * as crypto from 'crypto'

import * as _ from 'underscore'
import { CoreConnection, PeripheralDeviceAPI as P, CollectionObj } from 'tv-automation-server-core-integration'
import { TimelineObjectCoreExt } from 'tv-automation-sofie-blueprints-integration'
import { LoggerInstance } from './index'
import { disableAtemUpload } from './config'

export interface TSRConfig {
}
export interface TSRSettings { // Runtime settings from Core
	devices: {
		[deviceId: string]: DeviceOptionsAny
	}
	initializeAsClear: boolean
	mappings: Mappings
	errorReporting?: boolean
	multiThreading?: boolean
	multiThreadedResolver?: boolean
}
export interface TSRDevice {
	coreConnection: CoreConnection
	device: Device
}

// ----------------------------------------------------------------------------
// interface copied from Core lib/collections/Timeline.ts
export interface TimelineObjGeneric extends TimelineObjectCoreExt {
	/** Unique _id (generally obj.studioId + '_' + obj.id) */
	_id: string
	/** Unique within a timeline (ie within a studio) */
	id: string

	/** Studio installation Id */
	studioId: string

	objectType: TimelineObjType

	enable: TimelineTypes.TimelineEnable & {
		setFromNow?: boolean
	}

	inGroup?: string

	metadata?: {
		[key: string]: any
	}

	/** Only set to true when an object is inserted by lookahead */
	isLookahead?: boolean
	/** Set when an object is on a virtual layer for lookahead, so that it can be routed correctly */
	originalLLayer?: string | number
}
export enum TimelineObjType {
	/** Objects played in a rundown */
	RUNDOWN = 'rundown',
	/** Objects controlling recording */
	RECORDING = 'record',
	/** Objects controlling manual playback */
	MANUAL = 'manual',
	/** "Magic object", used to calculate a hash of the timeline */
	STAT = 'stat'
}
// ----------------------------------------------------------------------------

export interface TimelineContentObjectTmp extends TSRTimelineObjBase {
	inGroup?: string
}
/** Max time for initializing devices */
const INIT_TIMEOUT = 10000
/**
 * Represents a connection between Gateway and TSR
 */
export class TSRHandler {
	logger: LoggerInstance
	tsr: Conductor
	private _config: TSRConfig
	private _coreHandler: CoreHandler
	private _triggerupdateTimelineTimeout: any = null
	private _triggerupdateMappingTimeout: any = null
	private _triggerupdateDevicesTimeout: any = null
	private _coreTsrHandlers: {[deviceId: string]: CoreTSRDeviceHandler} = {}
	private _observers: Array<any> = []
	private _cachedStudioId: string = ''

	private _initialized: boolean = false
	private _multiThreaded: boolean | null = null
	private _reportAllCommands: boolean | null = null
	private _errorReporting: boolean | null = null

	private _updateDevicesIsRunning: boolean = false

	constructor (logger: LoggerInstance) {
		this.logger = logger
	}

	public init (config: TSRConfig, coreHandler: CoreHandler): Promise<any> {

		this._config = config
		this._coreHandler = coreHandler

		this._coreHandler.setTSR(this)

		this._config = this._config // ts-lint: not used fix
		this.logger.info('TSRHandler init')

		return coreHandler.core.getPeripheralDevice()
		.then((peripheralDevice) => {
			let settings: TSRSettings = peripheralDevice.settings || {}

			this.logger.info('Devices', settings.devices)
			let c: ConductorOptions = {
				getCurrentTime: (): number => {
					return this._coreHandler.core.getCurrentTime()
				},
				initializeAsClear: (settings.initializeAsClear !== false),
				multiThreadedResolver : settings.multiThreadedResolver === true,
				proActiveResolve: true
			}
			this.tsr = new Conductor(c)
			this._triggerupdateMapping()
			this._triggerupdateTimeline()

			coreHandler.onConnected(() => {
				this.setupObservers()
			})
			this.setupObservers()

			this.tsr.on('error', (e, ...args) => {
				// CasparCG play and load 404 errors should be warnings:
				let msg: string = e + ''
				// let cmdInfo: string = args[0] + ''
				let cmdReply = args[0]

				if (
					msg.match(/casparcg/i) &&
					(
						msg.match(/PlayCommand/i) ||
						msg.match(/LoadbgCommand/i)
					) &&
					cmdReply &&
					_.isObject(cmdReply) &&
					cmdReply.response &&
					cmdReply.response.code === 404
				) {
					this.logger.warn('TSR', e, ...args)
				} else {
					this.logger.error('TSR', e, ...args)
				}
			})
			this.tsr.on('info', (msg, ...args) => {
				this.logger.info('TSR', msg, ...args)
			})
			this.tsr.on('warning', (msg, ...args) => {
				this.logger.warn('TSR', msg, ...args)
			})
			this.tsr.on('debug', (...args: any[]) => {
				if (this._coreHandler.logDebug) {
					let msg: any = {
						message: 'TSR debug message (' + args.length + ')',
						data: []
					}
					if (args.length) {
						_.each(args, (arg) => {
							if (_.isObject(arg)) {
								msg.data.push(JSON.stringify(arg))
							} else {
								msg.data.push(arg)
							}
						})
					} else {
						msg.data.push('>empty message<')
					}

					this.logger.debug(msg)
				}
			})

			this.tsr.on('command', (id: string, cmd: any) => { // This is an deprecated event emitter, to be removed soon
				if (this._coreHandler.logDebug) {
					this.logger.info('TSR: Command', { device: id, cmdName: cmd.constructor ? cmd.constructor.name : undefined, cmd: JSON.parse(JSON.stringify(cmd)) })
				}
			})

			this.tsr.on('setTimelineTriggerTime', (r: TimelineTriggerTimeResult) => {
				this.logger.debug('setTimelineTriggerTime')
				this._coreHandler.core.callMethod(P.methods.timelineTriggerTime, [r])
				.catch((e) => {
					this.logger.error('Error in setTimelineTriggerTime', e)
				})
			})
			this.tsr.on('timelineCallback', (time, objId, callbackName, data) => {
				const method = P.methods[callbackName]
				if (method) {
					this._coreHandler.core.callMethod(method, [Object.assign({}, data, {
						objId: objId,
						time: time
					})])
					.catch((e) => {
						this.logger.error('Error in timelineCallback', e)
					})
				} else {
					this.logger.error(`Unknown callback method "${callbackName}"`)
				}

			})

			this.logger.debug('tsr init')
			return this.tsr.init()
		})
		.then(() => {
			this._initialized = true
			this._triggerupdateMapping()
			this._triggerupdateTimeline()
			this.onSettingsChanged()
			this._triggerUpdateDevices()
			this.logger.debug('tsr init done')

		})

	}
	setupObservers () {
		if (this._observers.length) {
			this.logger.debug('Clearing observers..')
			this._observers.forEach((obs) => {
				obs.stop()
			})
			this._observers = []
		}
		this.logger.debug('Renewing observers')

		let timelineObserver = this._coreHandler.core.observe('timeline')
		timelineObserver.added = () => { this._triggerupdateTimeline() }
		timelineObserver.changed = () => { this._triggerupdateTimeline() }
		timelineObserver.removed = () => { this._triggerupdateTimeline() }
		this._observers.push(timelineObserver)

		let mappingsObserver = this._coreHandler.core.observe('studio')
		mappingsObserver.added = () => { this._triggerupdateMapping() }
		mappingsObserver.changed = () => { this._triggerupdateMapping() }
		mappingsObserver.removed = () => { this._triggerupdateMapping() }
		this._observers.push(mappingsObserver)

		let deviceObserver = this._coreHandler.core.observe('peripheralDevices')
		deviceObserver.added = () => { this._triggerUpdateDevices() }
		deviceObserver.changed = () => { this._triggerUpdateDevices() }
		deviceObserver.removed = () => { this._triggerUpdateDevices() }
		this._observers.push(deviceObserver)

	}
	destroy (): Promise<void> {
		return this.tsr.destroy()
	}
	getTimeline (excludeStatObj?: boolean): Array<CollectionObj> | null {
		let studioId = this._getStudioId()
		if (!studioId) {
			this.logger.warn('no studioId')
			return null
		}

		let objs = this._coreHandler.core.getCollection('timeline').find((o: TimelineObjGeneric) => {
			if (excludeStatObj) {
				if (o.objectType === TimelineObjType.STAT) return false
			}
			return o.studioId === studioId
		})

		return objs
	}
	getMapping () {
		let studio = this._getStudio()
		if (studio) {
			return studio.mappings
		}
		return null
	}
	onSettingsChanged (): void {
		if (!this._initialized) return

		if (this.tsr.logDebug !== this._coreHandler.logDebug) {
			this.logger.info(`Log settings: ${this._coreHandler.logDebug}`)
			this.tsr.logDebug = this._coreHandler.logDebug
		}

		if (this._errorReporting !== this._coreHandler.errorReporting) {
			this._errorReporting = this._coreHandler.errorReporting

			this.logger.info('ErrorReporting: ' + this._multiThreaded)
		}
		if (this._multiThreaded !== this._coreHandler.multithreading) {
			this._multiThreaded = this._coreHandler.multithreading

			this.logger.info('Multithreading: ' + this._multiThreaded)

			this._triggerUpdateDevices()
		}
		if (this._reportAllCommands !== this._coreHandler.reportAllCommands) {
			this._reportAllCommands = this._coreHandler.reportAllCommands

			this.logger.info('ReportAllCommands: ' + this._reportAllCommands)

			this._triggerUpdateDevices()
		}

	}
	private _triggerupdateTimeline () {
		if (!this._initialized) return

		if (this._triggerupdateTimelineTimeout) {
			clearTimeout(this._triggerupdateTimelineTimeout)
		}

		let experimentalMessageWaiting = true
		if (experimentalMessageWaiting) {
			/**
			 * In this mode, we're trying a more aggressive strategy to figure out if messages
			 * are still arriving from Core (because we don't want to resolve a partial timeline).
			 * Instead of just waiting a "safe" time, we hijack into the websocket parser to determine
			 * if data is currently arriving.
			 */

			try {

				// @ts-ignore
				let socket: any = this._coreHandler.core._ddp.ddpClient.socket

				if (!socket.setupFakeDriver) {
					socket.setupFakeDriver = true
					socket.receivingMessage = false
					try {

						// @ts-ignore
						let driver = socket._driver

						let orgParse = driver.parse
						driver.parse = function (...args) {

							// This is called when data starts arriving (?)
							socket.receivingMessage = true
							orgParse.call(driver, ...args)
						}

						socket.on('message', () => {

							// The message has been recieved and emitted
							socket.receivingMessage = false
						})
					} catch (e) {
						this.logger.warn('Error in _triggerupdateTimeline (message parsing)', e)
					}
				}

				let time = 0
				let checkIfNotSending = () => {
					if (!socket.receivingMessage) {
						if (time > 2) {
							this._updateTimeline()
							return
						}
					}
					// check again later
					time++
					this._triggerupdateTimelineTimeout = setTimeout(checkIfNotSending, 1)
				}
				this._triggerupdateTimelineTimeout = setTimeout(checkIfNotSending, 1)
				time++
			} catch (e) {
				this.logger.warn(e)

				// Fallback to old way:
				this._triggerupdateTimelineTimeout = setTimeout(() => {
					this._updateTimeline()
				}, 20)
			}
		} else {

			this._triggerupdateTimelineTimeout = setTimeout(() => {
				this._updateTimeline()
			}, 20)
		}
	}
	private _updateTimeline () {
		if (this._determineIfTimelineShouldUpdate()) {
			let transformedTimeline = this._transformTimeline(
				this.getTimeline(true) as Array<TimelineObjGeneric>
			)
			if (transformedTimeline) {
				// @ts-ignore
				this.tsr.timeline = transformedTimeline
			} else {
				this.logger.warn('Did NOT update Timeline due to an error')
			}
		} else {
			this.logger.debug('_updateTimeline deferring update')
		}
	}
	private _triggerupdateMapping () {
		if (!this._initialized) return
		if (this._triggerupdateMappingTimeout) {
			clearTimeout(this._triggerupdateMappingTimeout)
		}
		this._triggerupdateMappingTimeout = setTimeout(() => {
			this._updateMapping()
			.catch(e => this.logger.error('Error in _updateMapping', e))
		}, 20)
	}
	private async _updateMapping () {
		let mapping = this.getMapping()
		if (mapping) {
			await this.tsr.setMapping(mapping)
		}
	}
	private _getPeripheralDevice () {
		let peripheralDevices = this._coreHandler.core.getCollection('peripheralDevices')
		return peripheralDevices.findOne(this._coreHandler.core.deviceId)
	}
	private _getStudio (): any | null {
		let peripheralDevice = this._getPeripheralDevice()
		if (peripheralDevice) {
			let studios = this._coreHandler.core.getCollection('studios')
			return studios.findOne(peripheralDevice.studioId)
		}
		return null
	}
	private _getStudioId (): string | null {
		if (this._cachedStudioId) return this._cachedStudioId

		let studio = this._getStudio()
		if (studio) {
			this._cachedStudioId = studio._id
			return studio._id
		}
		return null
	}
	private _triggerUpdateDevices () {
		if (!this._initialized) return

		if (!this._updateDevicesIsRunning) {
			this._updateDevicesIsRunning = true

			// Defer:
			setTimeout(() => {
				this._updateDevices()
				.then(() => {
					this._updateDevicesIsRunning = false
				}, () => {
					this._updateDevicesIsRunning = false
				})
			}, 10)
		} else {
			// oh, it's already running, check again later then:
			if (this._triggerupdateDevicesTimeout) {
				clearTimeout(this._triggerupdateDevicesTimeout)
			}
			this._triggerupdateDevicesTimeout = setTimeout(() => {
				this._triggerUpdateDevices()
			}, 100)
		}
	}
	private async _updateDevices (): Promise<void> {
		this.logger.info('updateDevices start')

		let peripheralDevices = this._coreHandler.core.getCollection('peripheralDevices')
		let peripheralDevice = peripheralDevices.findOne(this._coreHandler.core.deviceId)

		const ps: Promise<any>[] = []
		const promiseOperations: {[id: string]: true} = {}
		const keepTrack = <T>(p: Promise<T>, name: string) => {
			promiseOperations[name] = true
			return p.then((result) => {
				delete promiseOperations[name]
				return result
			})
		}

		if (peripheralDevice) {
			let settings: TSRSettings = peripheralDevice.settings || {}

			const devices: {
				[deviceId: string]: DeviceOptionsAny;
			} = {}

			_.each(settings.devices, (device, deviceId) => {
				// @ts-ignore
				if (!device.disable) {
					devices[deviceId] = device
				}
			})

			_.each(devices, (deviceOptions: DeviceOptionsAny, deviceId: string) => {

				let oldDevice: DeviceContainer = this.tsr.getDevice(deviceId)

				deviceOptions = _.extend({ // Defaults:
					limitSlowSentCommand: 40,
					limitSlowFulfilledCommand: 100
				}, deviceOptions)

				if (this._multiThreaded !== null && deviceOptions.isMultiThreaded === undefined) {
					deviceOptions.isMultiThreaded = this._multiThreaded
				}
				if (this._reportAllCommands !== null && deviceOptions.reportAllCommands === undefined) {
					deviceOptions.reportAllCommands = this._reportAllCommands
				}

				if (!oldDevice) {
					if (deviceOptions.options) {
						this.logger.info('Initializing device: ' + deviceId)
						this.logger.info('new', deviceOptions)
						ps.push(
							keepTrack(this._addDevice(deviceId, deviceOptions), 'add_' + deviceId)
						)
					}
				} else {
					if (deviceOptions.options) {
						let anyChanged = false

						// let oldOptions = (oldDevice.deviceOptions).options || {}

						if (!_.isEqual(oldDevice.deviceOptions, deviceOptions)) {
							anyChanged = true
						}

						if (anyChanged) {
							this.logger.info('Re-initializing device: ' + deviceId)
							this.logger.info('old', oldDevice.deviceOptions)
							this.logger.info('new', deviceOptions)
							ps.push(
								keepTrack(this._removeDevice(deviceId), 'remove_' + deviceId)
								.then(() => {
									return keepTrack(this._addDevice(deviceId, deviceOptions), 're-add_' + deviceId)
								})
							)
						}
					}
				}
			})

			_.each(this.tsr.getDevices(), async (oldDevice: DeviceContainer) => {
				let deviceId = oldDevice.deviceId
				if (!devices[deviceId]) {
					this.logger.info('Un-initializing device: ' + deviceId)
					ps.push(
						keepTrack(this._removeDevice(deviceId), 'remove_' + deviceId)
					)
				}
			})
		}

		await Promise.race([
			Promise.all(ps),
			new Promise(resolve => setTimeout(() => {
				this.logger.warn(`Timeout in _updateDevices: ${_.keys(promiseOperations).join(',')}`)
				resolve()
			}, INIT_TIMEOUT)) // Timeout if not all are resolved within INIT_TIMEOUT
		])
		this.logger.info('updateDevices end')
	}
	private async _addDevice (deviceId: string, options: DeviceOptionsAny): Promise<any> {
		this.logger.debug('Adding device ' + deviceId)

		try {

			if (this._coreTsrHandlers[deviceId]) {
				throw new Error(`There is already a _coreTsrHandlers for deviceId "${deviceId}"!`)
			}

			const devicePr: Promise<DeviceContainer> = this.tsr.addDevice(deviceId, options)

			let coreTsrHandler = new CoreTSRDeviceHandler(this._coreHandler, devicePr, deviceId, this)

			this._coreTsrHandlers[deviceId] = coreTsrHandler

			const device = await devicePr

			// Set up device status
			const deviceType = device.deviceType

			const onConnectionChanged = (connectedOrStatus: boolean | P.StatusObject) => {
				let deviceStatus: P.StatusObject
				if (_.isBoolean(connectedOrStatus)) { // for backwards compability, to be removed later
					if (connectedOrStatus) {
						deviceStatus = {
							statusCode: P.StatusCode.GOOD
						}
					} else {
						deviceStatus = {
							statusCode: P.StatusCode.BAD,
							messages: ['Disconnected']
						}
					}
				} else {
					deviceStatus = connectedOrStatus
				}
				coreTsrHandler.onConnectionChanged(deviceStatus)
				// hack to make sure atem has media after restart
				if (deviceStatus.statusCode === P.StatusCode.GOOD && deviceType === DeviceType.ATEM && !disableAtemUpload) {
					// const ssrcBgs = studio.config.filter((o) => o._id.substr(0, 18) === 'atemSSrcBackground')
					const assets = (options as DeviceOptionsAtem).options.mediaPoolAssets
					if (assets && assets.length > 0) {
						try {
							// TODO: support uploading clips and audio
							this._coreHandler.uploadFileToAtem(_.compact(assets.map((asset, index) => {
								return asset.type === AtemMediaPoolType.Still ? {
									_key: (asset.position === undefined ? index : asset.position).toString(),
									value: asset.path
								} : undefined
							})))
						} catch (e) {
							// don't worry about it.
						}
					}
				}
			}
			const onSlowCommand = (commandInfo: string) => {
				this.logger.warn(commandInfo)
			}
			/*const onCommandError = (error: Error, context: CommandWithContext) => {
				if (this._errorReporting) {
					this.logger.warn('CommandError', device.deviceId, error.toString())
					this.logger.info('Command context', context.timelineObjId, context.context)

					// find the corresponding timeline object:
					const obj = _.find(this.tsr.timeline, (obj) => {
						return obj.id === context.timelineObjId
					})

					const errorString: string = device.deviceName +
					(
						error instanceof Error ?
							error.toString() :
						_.isObject(error) ?
							JSON.stringify(error) :
						error + ''
					)
					coreTsrHandler.onCommandError(errorString, {
						timelineObjId:	context.timelineObjId,
						context: 		context.context,
						partId:		obj ? obj['partId']		: undefined,
						pieceId:	obj ? obj['pieceId']	: undefined
					})
				} else {
					this.logger.warn('CommandError', device.deviceId, error.toString(), error.stack)
				}
			}*/
			const onCommandReport = (commandReport: CommandReport) => {
				if (this._reportAllCommands) {
					// Todo: send these to Core
					this.logger.info('commandReport', {
						commandReport: commandReport
					})
				}
			}
			const onCommandError = (error, context) => {
				// todo: handle this better
				this.logger.error(error)
				this.logger.debug(context)
			}
			let deviceName = device.deviceName
			let deviceInstanceId = device.instanceId
			const fixError = (e) => {

				let name = `Device "${deviceName || deviceId}" (${deviceInstanceId})`
				if (e.reason) e.reason = name + ': ' + e.reason
				if (e.message) e.message = name + ': ' + e.message
				if (e.stack) {
					e.stack += '\nAt device' + name
				}
				if (_.isString(e)) e = name + ': ' + e

				return e
			}
			await coreTsrHandler.init()

			deviceName = device.deviceName

			device.onChildClose = () => {
				// Called if a child is closed / crashed
				this.logger.warn(`Child of device ${deviceId} closed/crashed`)

				onConnectionChanged({
					statusCode: P.StatusCode.BAD,
					messages: ['Child process closed']
				})

				this._removeDevice(deviceId)
				.then(() => {
					this._triggerUpdateDevices()
				}, () => {
					this._triggerUpdateDevices()
				})
			}
			await device.device.on('connectionChanged', onConnectionChanged)
			await device.device.on('slowCommand', onSlowCommand)
			await device.device.on('commandError', onCommandError)
			await device.device.on('commandReport', onCommandReport)

			await device.device.on('info',	(e, ...args) => this.logger.info(fixError(e), ...args))
			await device.device.on('warning',	(e, ...args) => this.logger.warn(fixError(e), ...args))
			await device.device.on('error',	(e, ...args) => this.logger.error(fixError(e), ...args))
			await device.device.on('debug',	(e, ...args) => this.logger.debug(fixError(e), ...args))

			// also ask for the status now, and update:
			onConnectionChanged(await device.device.getStatus())

		} catch (e) {

			// Initialization failed, clean up any artifacts and see if we can try again later:
			this.logger.error(`Error when adding device "${deviceId}"`, e)
			try {

				await this._removeDevice(deviceId)
			} catch (e) {
				this.logger.error(`Error when cleaning up after adding device "${deviceId}" error...`, e)
			}

			setTimeout(() => {
				// try again later:
				this._triggerUpdateDevices()
			}, 10 * 1000)
		}
	}
	private async _removeDevice (deviceId: string): Promise<any> {
		if (this._coreTsrHandlers[deviceId]) {
			try {
				await this._coreTsrHandlers[deviceId].dispose()
			} catch (e) {
				this.logger.error(`Error when removing device "${deviceId}"`, e)
			}
		}
		delete this._coreTsrHandlers[deviceId]
	}
	/**
	 * Go through and transform timeline and generalize the Core-specific things
	 * @param timeline
	 */
	private _transformTimeline (timeline: Array<TimelineObjGeneric>): TSRTimeline | null {
		// _transformTimeline (timeline: Array<TimelineObj>): Array<TimelineContentObject> | null {

		let transformObject = (obj: TimelineObjGeneric): TimelineContentObjectTmp => {
			let transformedObj = clone(_.omit(obj, ['_id', 'studioId']))
			transformedObj.id = obj.id || obj._id

			if (!transformedObj.content) transformedObj.content = {}
			if (transformedObj.isGroup) {
				if (!transformedObj.content.objects) transformedObj.content.objects = []
			}

			return transformedObj
		}

		// First, transform and convert timeline to a key-value store, for fast referencing:
		let objects: {[id: string]: TimelineContentObjectTmp} = {}
		_.each(timeline, (obj: TimelineObjGeneric) => {
			let transformedObj = transformObject(obj)
			objects[transformedObj.id] = transformedObj
		})

		// Go through all objects:
		let transformedTimeline: Array<TSRTimelineObj> = []
		_.each(objects, (obj: TimelineContentObjectTmp) => {
			if (obj.inGroup) {
				let groupObj = objects[obj.inGroup]
				if (groupObj) {
					// Add object into group:
					if (!groupObj.children) groupObj.children = []
					if (groupObj.children) {
						delete obj.inGroup
						groupObj.children.push(obj)
					}
				} else {
					// referenced group not found
					this.logger.warn('Referenced group "' + obj.inGroup + '" not found! Referenced by "' + obj.id + '"')
				}
			} else {
				// Add object to timeline
				delete obj.inGroup
				transformedTimeline.push(obj as TSRTimelineObj)
			}
		})
		return transformedTimeline
	}
	private _determineIfTimelineShouldUpdate (): boolean {

		let requireStatObject: boolean = true // set to false for backwards compability
		let disableStatObject: boolean = false // set to true to disable the statobject check completely

		let pd = this._getPeripheralDevice()
		if (pd && (pd.settings || {}).enableBackwardsCompability) {
			requireStatObject = false
		}
		if (pd && (pd.settings || {}).disableStatObj) {
			disableStatObject = true
		}

		if (disableStatObject) return true

		let studioId = this._getStudioId()
		if (!studioId) {
			this.logger.warn('no studioId')
			return false
		}

		let statObjId = studioId + '_statObj'

		let statObject = this._coreHandler.core.getCollection('timeline').find(statObjId)[0]

		if (!statObject) {
			if (requireStatObject) {
				this.logger.info('no statObject')
				return false
			} else {
				return true
			}
		}

		this.logger.info('statObject found')

		let statObjCount 	= (statObject.content || {}).objCount || 0
		let statObjHash 	= (statObject.content || {}).objHash || ''

		// collect statistics
		let objs = this.getTimeline(true)
		if (!objs) return false

		// Number of objects
		let objCount = objs.length
		// Hash of all objects
		objs = objs.sort((a, b) => {
			if (a._id < b._id) return 1
			if (a._id > b._id) return -1
			return 0
		})
		let objHash = getHash(stringifyObjects(objs))

		if (objCount !== statObjCount) {
			this.logger.info('Delaying timeline update, objcount differ (' + objCount + ',' + statObjCount + ') ')
			return false
		}
		if (objHash !== statObjHash) {
			this.logger.info('Delaying timeline update, hash differ (' + objHash + ',' + statObjHash + ') ')
			return false
		}
		return true
	}
}
function stringifyObjects (objs) {
	if (_.isArray(objs)) {
		return _.map(objs, (obj) => {
			if (obj !== undefined) {
				return stringifyObjects(obj)
			}
		}).join(',')
	} else if (_.isFunction(objs)) {
		return ''
	} else if (_.isObject(objs)) {
		let keys = _.sortBy(_.keys(objs), (k) => k)

		return _.compact(_.map(keys, (key) => {
			if (objs[key] !== undefined) {
				return key + '=' + stringifyObjects(objs[key])
			} else {
				return null
			}
		})).join(',')
	} else {
		return objs + ''
	}
}

export function getHash (str: string): string {
	const hash = crypto.createHash('sha1')
	return hash.update(str).digest('base64').replace(/[\+\/\=]/g, '_') // remove +/= from strings, because they cause troubles
}
