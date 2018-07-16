import {
	Conductor,
	DeviceType,
	ConductorOptions,
	Device,
	TimelineContentObject,
	TriggerType,
	TimelineTriggerTimeResult,
	DeviceOptions
} from 'timeline-state-resolver'
import { CoreHandler } from './coreHandler'
let clone = require('fast-clone')
import * as Winston from 'winston'

import * as _ from 'underscore'
import { CoreConnection, PeripheralDeviceAPI as P } from 'tv-automation-server-core-integration'

export interface TSRConfig {
}
export interface Mappings {
	[layerName: string]: Mapping
}
export interface Mapping {
	device: DeviceType
	deviceId: string
	channel?: number
	layer?: number
	// [key: string]: any
}
export interface TSRSettings { // Runtime settings from Core
	devices: {
		[deviceId: string]: {
			type: DeviceType
			options?: {}
		}
	}
	initializeAsClear: boolean
	mappings: Mappings,
}
export interface TSRDevice {
	coreConnection: CoreConnection
	device: Device
}
export interface TimelineObj { // interface from Core
	_id: string
	siId?: string
	sliId?: string
	roId: string
	deviceId: string

	trigger: {
		type: TriggerType
		value: number | string
	}
	duration: number
	LLayer: string | number
	content: {
		type: string // TimelineContentType
		[key: string]: any // *other attributes*
	}
	classes?: Array<string>
	disabled?: boolean
	isGroup?: boolean
	inGroup?: string
	repeating?: boolean
	priority?: number
	externalFunction?: string
}
export interface TimelineContentObjectTmp extends TimelineContentObject {
	inGroup?: string
}
/**
 * Represents a connection between Gateway and TSR
 */
export class TSRHandler {
	logger: Winston.LoggerInstance
	tsr: Conductor
	private _config: TSRConfig
	private _coreHandler: CoreHandler
	private _triggerupdateTimelineTimeout: any = null
	private _triggerupdateMappingTimeout: any = null
	private _triggerupdateDevicesTimeout: any = null
	private _tsrDevices: {[deviceId: string]: TSRDevice} = {}
	private _observers: Array<any> = []

	constructor (logger: Winston.LoggerInstance) {
		this.logger = logger
	}

	public init (config: TSRConfig, coreHandler: CoreHandler): Promise<any> {

		this._config = config
		this._coreHandler = coreHandler

		this._coreHandler.setTSR(this)

		this._config = this._config // ts-lint: not used fix
		console.log('========')

		return coreHandler.core.getPeripheralDevice()
		.then((peripheralDevice) => {
			let settings: TSRSettings = peripheralDevice.settings || {}

			console.log('Devices', settings.devices)
			let c: ConductorOptions = {
				getCurrentTime: (): number => {
					// console.log('getCurrentTime', new Date(this._coreHandler.core.getCurrentTime()).toISOString() )
					return this._coreHandler.core.getCurrentTime()
					// return Date.now() // todo: tmp!
				},
				initializeAsClear: (settings.initializeAsClear !== false)
			}
			this.tsr = new Conductor(c)
			this._triggerupdateMapping()
			this._triggerupdateTimeline()

			coreHandler.onConnected(() => {
				this.setupObservers()
			})
			this.setupObservers()

			this.tsr.on('error', (e, ...args) => {
				this.logger.error('TSR', e, ...args)
			})
			this.tsr.on('info', (msg, ...args) => {
				this.logger.info('TSR',msg, ...args)
			})

			this.tsr.on('setTimelineTriggerTime', (r: TimelineTriggerTimeResult) => {
				console.log('setTimelineTriggerTime')
				this._coreHandler.core.callMethod(P.methods.timelineTriggerTime, [r])
				.catch((e) => {
					this.logger.error('Error in setTimelineTriggerTime', e)
				})
			})
			this.tsr.on('timelineCallback', (time, objId, callbackName, data) => {
				// console.log('timelineCallback ' + callbackName, objId, new Date(time).toISOString() )
				this._coreHandler.core.callMethod(P.methods[callbackName], [Object.assign({}, data, {
					objId: objId,
					time: time
				})])
				.catch((e) => {
					this.logger.error('Error in timelineCallback', e)
				})

			})

			console.log('tsr init')
			return this.tsr.init()
		})
		.then(() => {
			this._triggerupdateMapping()
			this._triggerupdateTimeline()
			this._triggerupdateDevices()
			console.log('tsr init done')
		})

	}
	setupObservers () {
		if (this._observers.length) {
			console.log('Clearing observers..')
			this._observers.forEach((obs) => {
				obs.stop()
			})
			this._observers = []
		}
		console.log('Renewing observers')

		let timelineObserver = this._coreHandler.core.observe('timeline')
		timelineObserver.added = () => { this._triggerupdateTimeline() }
		timelineObserver.changed = () => { this._triggerupdateTimeline() }
		timelineObserver.removed = () => { this._triggerupdateTimeline() }
		this._observers.push(timelineObserver)

		let mappingsObserver = this._coreHandler.core.observe('studioInstallation')
		mappingsObserver.added = () => { this._triggerupdateMapping() }
		mappingsObserver.changed = () => { this._triggerupdateMapping() }
		mappingsObserver.removed = () => { this._triggerupdateMapping() }
		this._observers.push(mappingsObserver)

		let deviceObserver = this._coreHandler.core.observe('peripheralDevices')
		deviceObserver.added = () => { this._triggerupdateDevices() }
		deviceObserver.changed = () => { this._triggerupdateDevices() }
		deviceObserver.removed = () => { this._triggerupdateDevices() }
		this._observers.push(deviceObserver)

	}
	destroy (): Promise<void> {
		return this.tsr.destroy()
	}
	private _triggerupdateTimeline () {
		// console.log('got data')
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
							// console.log('---------------Parse')

							// This is called when data starts arriving (?)
							socket.receivingMessage = true
							orgParse.call(driver, ...args)
						}

						socket.on('message', () => {
							// console.log('---------------Message')

							// The message has been recieved and emitted
							socket.receivingMessage = false
						})
						// console.log('driver', driver)
						// console.log('driver.parse', driver.parse)
					} catch (e) {
						this.logger.warn(e)
					}
				}

				let time = 0
				let checkIfNotSending = () => {
					if (!socket.receivingMessage) {
						if (time > 2) {
							// console.log('updating timeline after ' + time)
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
		console.log('_updateTimeline')
		let transformedTimeline = this._transformTimeline(this._coreHandler.core.getCollection('timeline').find((o) => {
			return (
				_.isArray(o.deviceId) ?
				o.deviceId.indexOf(this._coreHandler.core.deviceId) !== -1 :
				o.deviceId === this._coreHandler.core.deviceId
			)
		}) as Array<TimelineObj>)
		if (transformedTimeline) {
			this.tsr.timeline = transformedTimeline
		} else {
			this.logger.warn('Did NOT update Timeline due to an error')
		}
	}
	private _triggerupdateMapping () {
		if (this._triggerupdateMappingTimeout) {
			clearTimeout(this._triggerupdateMappingTimeout)
		}
		this._triggerupdateMappingTimeout = setTimeout(() => {
			this._updateMapping()
		}, 20)
	}
	private _updateMapping () {
		let peripheralDevices = this._coreHandler.core.getCollection('peripheralDevices')
		let peripheralDevice = peripheralDevices.findOne(this._coreHandler.core.deviceId)
		if (peripheralDevice) {
			let studioInstallations = this._coreHandler.core.getCollection('studioInstallation')
			let studioInstallation = studioInstallations.findOne(peripheralDevice.studioInstallationId)
			if (studioInstallation) {
				this.tsr.mapping = studioInstallation.mappings
			}
		}
	}
	private _triggerupdateDevices () {
		if (this._triggerupdateDevicesTimeout) {
			clearTimeout(this._triggerupdateDevicesTimeout)
		}
		this._triggerupdateDevicesTimeout = setTimeout(() => {
			this._updateDevices()
		}, 20)
	}
	private _updateDevices () {
		// TODO: rewrite so _addDevice & _removeDevice uses promises
		let peripheralDevices = this._coreHandler.core.getCollection('peripheralDevices')
		let peripheralDevice = peripheralDevices.findOne(this._coreHandler.core.deviceId)

		if (peripheralDevice) {
			let settings: TSRSettings = peripheralDevice.settings || {}

			let devices = settings.devices

			_.each(devices, (device, deviceId: string) => {

				let oldDevice = this.tsr.getDevice(deviceId)

				if (!oldDevice) {
					if (device.options) {
						console.log('Initializing device: ' + deviceId)
						this._addDevice(deviceId, device)
					}
				} else {
					if (device.options) {
						let anyChanged = false
						let oldOptions = oldDevice.deviceOptions.options || {}
						_.each(device.options, (val, attr) => {
							if (!_.isEqual(oldOptions[attr], val)) {
								anyChanged = true
							}
						})
						if (anyChanged) {
							console.log('Re-initializing device: ' + deviceId)
							// console.log('old options', oldDevice.deviceOptions)
							// console.log('new options', device.options)
							this._removeDevice(deviceId)
							this._addDevice(deviceId, device)
						}
					}
				}
			})

			_.each(this.tsr.getDevices(), (oldDevice: Device) => {
				let deviceId = oldDevice.deviceId
				if (!devices[deviceId]) {
					console.log('Un-initializing device: ' + deviceId)
					// this.tsr.removeDevice(deviceId)
					this._removeDevice(deviceId)
				}
			})
		}
	}
	private _addDevice (deviceId: string, options: DeviceOptions): void {
		console.log('Adding device ' + deviceId)

		this.tsr.addDevice(deviceId, options)
		.then((device: Device) => {
			// set up device status

			if (!this._tsrDevices[device.deviceId]) {
				let coreConn = new CoreConnection(this._coreHandler.getCoreConnectionOptions('Playout: ' + device.deviceName, 'Playout' + device.deviceId, false))

				this._tsrDevices[device.deviceId] = {
					device: device,
					coreConnection: coreConn
				}

				coreConn.init(this._coreHandler.core)
				.then(() => {
					coreConn.setStatus({
						statusCode: (device.connected ? P.StatusCode.GOOD : P.StatusCode.BAD)
					})
					device.on('connectionChanged', (connected) => {
						coreConn.setStatus({
							statusCode: (connected ? P.StatusCode.GOOD : P.StatusCode.BAD)
						})
					})
				})
			}
		})
		.catch((e) => {
			console.log('Error when adding device: ' + e)
		})
	}
	private _removeDevice (deviceId: string) {
		delete this._tsrDevices[deviceId]

		this.tsr.removeDevice(deviceId)
		.catch(() => {
			// no device found, that's okay
		})
	}
	/**
	 * Go through and transform timeline and generalize the Core-specific things
	 * @param timeline
	 */
	private _transformTimeline (timeline: Array<TimelineObj>): Array<TimelineContentObject> | null {
		// _transformTimeline (timeline: Array<TimelineObj>): Array<TimelineContentObject> | null {

		let transformObject = (obj: TimelineObj): TimelineContentObjectTmp => {
			let transformedObj = clone(_.extend({
				id: obj['_id'],
				roId: obj['roId']
			}, _.omit(obj, ['_id', 'deviceId', 'siId'])))

			if (!transformedObj.content) transformedObj.content = {}
			if (transformedObj.isGroup) {
				if (!transformedObj.content.objects) transformedObj.content.objects = []
			}

			if (obj['slId']) {
				// Will cause a callback to be called, when the object starts to play:
				transformedObj.content.callBack = 'segmentLinePlaybackStarted'
				transformedObj.content.callBackData = {
					roId: obj.roId,
					slId: obj['slId']
				}
			}
			if (obj['sliId']) {
				// Will cause a callback to be called, when the object starts to play:
				transformedObj.content.callBack = 'segmentLineItemPlaybackStarted'
				transformedObj.content.callBackData = {
					roId: obj.roId,
					sliId: obj['sliId']
				}
			}

			return transformedObj
		}

		// let doTransform = (objs: Array<any>) => {
		// }

		let objs = timeline
		// First, transform and convert timeline to a key-value store, for fast referencing:
		let objects: {[id: string]: TimelineContentObjectTmp} = {}
		_.each(objs, (obj: TimelineObj) => {
			let transformedObj: TimelineContentObjectTmp = transformObject(obj)
			objects[transformedObj.id] = transformedObj
		})

		// Go through all objects:
		let transformedTimeline: Array<TimelineContentObject> = []
		_.each(objects, (obj: TimelineContentObjectTmp) => {
			if (obj.inGroup) {
				let groupObj = objects[obj.inGroup]
				if (groupObj) {
					// Add object into group:
					if (!groupObj.content.objects) groupObj.content.objects = []
					if (groupObj.content.objects) {
						delete obj.inGroup
						groupObj.content.objects.push(obj)
					}
				} else {
					// referenced group not found
					this.logger.warn('Referenced group "' + obj.inGroup + '" not found! Referenced by "' + obj.id + '"')
				}
			} else {
				// Add object to timeline
				delete obj.inGroup
				transformedTimeline.push(obj)
			}
		})
		return transformedTimeline
	}
}
