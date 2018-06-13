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
import { CoreConnection, PeripheralDeviceAPI as P } from 'core-integration'

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
	siId: string
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
				this.logger.error(e, ...args)
			})
			this.tsr.on('info', (msg, ...args) => {
				this.logger.info(msg, ...args)
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
				callbackName = callbackName
				this._coreHandler.core.callMethod(P.methods.segmentLinePlaybackStarted, [{
					roId: data.roId,
					slId: data.slId,
					objId: objId,
					time: time
				}])
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
		console.log('got data')
		if (this._triggerupdateTimelineTimeout) {
			clearTimeout(this._triggerupdateTimelineTimeout)
		}
		this._triggerupdateTimelineTimeout = setTimeout(() => {
			this._updateTimeline()
		}, 20)
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

		let transformObject = (obj: TimelineObj): TimelineContentObject => {
			let transformedObj = clone(_.extend({
			   id: obj['_id'],
			   roId: obj['roId']
		   }, _.omit(obj, ['_id', 'deviceId', 'siId'])))

		   if (!transformedObj.content) transformedObj.content = {}
		   if (!transformedObj.content.objects) transformedObj.content.objects = []

		   if (obj['slId']) {
			   // Will cause a callback to be called, when the object starts to play:
			   transformedObj.content.callBack = 'segmentLinePlaybackStarted'
			   transformedObj.content.callBackData = {
				   roId: obj.roId,
				   slId: obj['slId']
			   }
		   }

		   return transformedObj
		}

		// let doTransform = (objs: Array<TimelineObj>) => {
		// }
		let groupObjects: {[id: string]: TimelineContentObject} = {}
		let transformedTimeline: Array<TimelineContentObject> = []
		let objs = timeline
		let i
		let startTime = Date.now()
		for (i = 0; i < 1000; i++) {
			let objsLeft: Array<TimelineObj> = []
			let changedObjects: number = 0
			_.each(objs, (obj: TimelineObj) => {

				let transformedObj = transformObject(obj)

				if (obj.isGroup) {
					groupObjects[transformedObj.id] = transformedObj
					changedObjects++
				}
				if (obj.inGroup) {
					let groupObj = groupObjects[obj.inGroup]
					if (groupObj) {
						// Add object into group:
						if (groupObj.content.objects) {
							groupObj.content.objects.push(transformedObj)
							changedObjects++
						}
					} else {
						// referenced group not found, try again later:
						objsLeft.push(obj)
					}
				} else {
					// Add object to timeline
					transformedTimeline.push(transformedObj)
					changedObjects++
				}
			})
			// Iterate again?
			if (!objsLeft.length || !changedObjects) {
				// dont iterate again
				break
			} else {
				console.log('iterate again', changedObjects, i)

				if (Date.now() - startTime > 5000) {
					this.logger.error('Timeline transform timeout!')
					// timeout
					return null
				}
			}
		}
		if (i >= 1000) {
			this.logger.error('Timeline transform reached it\'s maximum number of iterations!')
			return null
		} else if (Date.now() - startTime > 1000) {
			this.logger.warn('Timeline resolve was slow (' + timeline.length + ' objects in ' + (Date.now() - startTime) + 'ms)')
		} else if (i >= 900) {
			this.logger.warn('Timeline transform did more than 900 iterations (' + timeline.length + ' objects')
		}
		return transformedTimeline

	}
}
