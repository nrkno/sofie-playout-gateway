import {Conductor, DeviceType, ConductorOptions, Device} from 'timeline-state-resolver'
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
		this.tsr.timeline = _.map(this._coreHandler.core.getCollection('timeline').find({
			deviceId: this._coreHandler.core.deviceId
		}), (timelineObj) => {
			return _.extend({
				id: timelineObj._id
			}, _.omit(timelineObj, ['_id', 'deviceId']))
		})
	}
}
