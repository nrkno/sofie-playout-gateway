import {Conductor, DeviceType, ConductorOptions} from 'timeline-state-resolver'
import {CoreHandler} from './coreHandler'
// import { CoreConnection,
// 	CoreOptions,
// 	DeviceType,
// 	PeripheralDeviceAPI as P
// } from 'core-integration'

import * as _ from 'underscore'

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
/**
 * Represents a connection between mos-integration and Core
 */
export class TSRHandler {
	tsr: Conductor
	private _config: TSRConfig
	private _coreHandler: CoreHandler
	private _triggerupdateTimelineTimeout: any = null

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
			this._updateTimeline()

			let observer = coreHandler.core.observe('timeline')
			observer.added = () => { this._triggerupdateTimeline() }
			observer.changed = () => { this._triggerupdateTimeline() }
			observer.removed = () => { this._triggerupdateTimeline() }

			console.log('tsr init')
			return this.tsr.init()
		})
		.then(() => {
			console.log('tsr init done')
			return
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
	// getCoreConnectionOptions (name: string, deviceId: string): CoreOptions {
	// 	let credentials = CoreConnection.getCredentials(deviceId)
	// 	return _.extend(credentials, {
	// 		deviceType: DeviceType.MOSDEVICE,
	// 		deviceName: name
	// 	})
	// }
	// registerMosDevice (mosDevice: IMOSDevice, mosHandler: MosHandler): Promise<CoreMosDeviceHandler> {
	// 	console.log('registerMosDevice -------------')
	// 	let coreMos = new CoreMosDeviceHandler(this, mosDevice, mosHandler)

	// 	return coreMos.init()
	// 	.then(() => {
	// 		return coreMos
	// 	})
	// }
}
/**
 * Represents a connection between a mos-device and Core
 */
// export class CoreMosDeviceHandler {

// 	core: CoreConnection
// 	private _coreParentHandler: CoreHandler
// 	private _mosDevice: IMOSDevice
// 	private _mosHandler: MosHandler

// 	constructor (parent: CoreHandler, mosDevice: IMOSDevice, mosHandler: MosHandler) {
// 		this._coreParentHandler = parent
// 		this._mosDevice = mosDevice
// 		this._mosHandler = mosHandler

// 		console.log('new CoreMosDeviceHandler ' + mosDevice.idPrimary)
// 		this.core = new CoreConnection(parent.getCoreConnectionOptions('MOS: ' + mosDevice.idPrimary, mosDevice.idPrimary))

// 	}
// 	init (): Promise<void> {
// 		return this.core.init(this._coreParentHandler.core)
// 		.then((id: string) => {
// 			// nothing
// 			id = id // tsignore
// 		})
// 	}
	// onMosConnectionChanged (connectionStatus: IMOSConnectionStatus) {

	// 	let statusCode = P.StatusCode.UNKNOWN
	// 	let messages: Array<string> = []

	// 	if (connectionStatus.PrimaryConnected) {
	// 		if (connectionStatus.SecondaryConnected) {
	// 			statusCode = P.StatusCode.GOOD
	// 		} else {
	// 			statusCode = P.StatusCode.WARNING_MINOR
	// 		}
	// 	} else {
	// 		if (connectionStatus.SecondaryConnected) {
	// 			statusCode = P.StatusCode.WARNING_MAJOR
	// 		} else {
	// 			statusCode = P.StatusCode.BAD
	// 		}
	// 	}

	// 	if (!connectionStatus.PrimaryConnected) {
	// 		messages.push(connectionStatus.PrimaryStatus || 'Primary not connected')
	// 	}
	// 	if (!connectionStatus.SecondaryConnected) {
	// 		messages.push(connectionStatus.SecondaryStatus || 'Fallback not connected')
	// 	}

	// 	this.core.setStatus({
	// 		statusCode: statusCode,
	// 		messages: messages
	// 	})
	// }
// }
