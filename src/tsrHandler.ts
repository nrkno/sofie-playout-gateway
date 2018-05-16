import {Conductor,
	DeviceType,
	ConductorOptions,
	Device,
	TimelineContentObject,
	TriggerType
} from 'timeline-state-resolver'
import {CoreHandler} from './coreHandler'

import * as _ from 'underscore'
import { CoreConnection, PeripheralDeviceAPI as P } from 'core-integration'

export interface TSRConfig {
	// devices: {
	// 	[deviceName: string]: {
	// 		type: DeviceType
	// 		options?: {}
	// 	}
	// }
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
	tsr: Conductor
	private _config: TSRConfig
	private _coreHandler: CoreHandler
	private _triggerupdateTimelineTimeout: any = null
	private _tsrDevices: {[deviceId: string]: TSRDevice} = {}

	public init (config: TSRConfig, coreHandler: CoreHandler): Promise<any> {

		this._config = config
		this._coreHandler = coreHandler

		this._config = this._config // ts-lint: not used fix
		console.log('========')

		return coreHandler.core.getPeripheralDevice()
		.then((peripheralDevice) => {
			let settings: TSRSettings = peripheralDevice.settings || {}

			let c: ConductorOptions = {
				getCurrentTime: () => {
					return Date.now() // todo: tmp!
				},
				initializeAsClear: (settings.initializeAsClear !== false),
				devices: settings.devices
			}
			this.tsr = new Conductor(c)
			this.tsr.mapping = settings.mappings
			this.tsr.mapping = settings.mappings

			let observer = coreHandler.core.observe('timeline')
			observer.added = () => { this._triggerupdateTimeline() }
			observer.changed = () => { this._triggerupdateTimeline() }
			observer.removed = () => { this._triggerupdateTimeline() }

			console.log('tsr init')
			return this.tsr.init()
		})
		.then(() => {
			console.log('tsr setting up device statuses')
			// Setup connection statuses
			return Promise.all(_.map(this.tsr.getDevices(), (device: Device) => {

				if (!this._tsrDevices[device.deviceId]) {
					console.log(device.deviceName)
					let coreConn = new CoreConnection(this._coreHandler.getCoreConnectionOptions('Playout: ' + device.deviceName, 'Playout' + device.deviceId))

					this._tsrDevices[device.deviceId] = {
						device: device,
						coreConnection: coreConn
					}

					return coreConn.init(this._coreHandler.core)
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
				} else {
					return Promise.resolve()
				}
			}))
		})
		.then(() => {
			console.log('tsr init done')
		})

	}
	destroy (): Promise<void> {
		return this.tsr.destroy()
	}
	private _triggerupdateTimeline () {
		if (this._triggerupdateTimelineTimeout) {
			clearTimeout(this._triggerupdateTimelineTimeout)
		}
		this._triggerupdateTimelineTimeout = setTimeout(() => {
			this._updateTimeline()
		}, 20)
	}
	private _updateTimeline () {
		let transformedTimeline = this._transformTimeline(this._coreHandler.core.getCollection('timeline').find({
			deviceId: this._coreHandler.core.deviceId
		}) as Array<TimelineObj>)
		this.tsr.timeline = transformedTimeline
	}
	/**
	 * Go through and transform timeline and generalize the Core-specific things
	 * @param timeline
	 */
	private _transformTimeline (timeline: Array<TimelineObj>): Array<TimelineContentObject> {

		let transformObject = (obj: TimelineObj): TimelineContentObject => {
			let transformedObj = _.extend({
			   id: obj['_id'],
			   roId: obj['roId']
		   }, _.omit(obj, ['_id', 'deviceId', 'siId']))

		   if (!transformedObj.content) transformedObj.content = {}
		   if (!transformedObj.content.objects) transformedObj.content.objects = []

		   return transformedObj
		}

		let groupObjects: {[id: string]: TimelineContentObject} = {}
		let transformedTimeline: Array<TimelineContentObject> = []
		let doTransform = (objs: Array<TimelineObj>) => {
			let objsLeft: Array<TimelineObj> = []
			let changedSomething: boolean = false
			_.each(objs, (obj: TimelineObj) => {

				let transformedObj = transformObject(obj)

				if (obj.isGroup) {
					groupObjects[transformedObj.id] = transformedObj
					changedSomething = true
				}
				if (obj.inGroup) {
					let groupObj = groupObjects[obj.inGroup]
					if (groupObj) {
						// Add object into group:
						if (groupObj.content.objects) {
							groupObj.content.objects.push(transformedObj)
							changedSomething = true
						}
					} else {
						// referenced group not found, try again later:
						objsLeft.push(obj)
					}
				} else {
					// Add object to timeline
					transformedTimeline.push(transformedObj)
					changedSomething = true
				}
			})
			// Iterate again?
			if (objsLeft.length && changedSomething) {
				doTransform(objsLeft)
			}
		}
		doTransform(timeline)
		return transformedTimeline

	}
}
