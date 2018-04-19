
import { CoreConnection,
	CoreOptions,
	DeviceType,
	PeripheralDeviceAPI as P
} from 'core-integration'

// import {
// 	IMOSConnectionStatus,
// 	IMOSDevice,
// 	IMOSListMachInfo,
// 	MosString128,
// 	MosTime,
// 	IMOSRunningOrder,
// 	IMOSRunningOrderBase,
// 	IMOSRunningOrderStatus,
// 	IMOSStoryStatus,
// 	IMOSItemStatus,
// 	IMOSStoryAction,
// 	IMOSROStory,
// 	IMOSROAction,
// 	IMOSItemAction,
// 	IMOSItem,
// 	IMOSROReadyToAir,
// 	IMOSROFullStory,
// 	MosDuration
// } from 'mos-connection'

import * as _ from 'underscore'
// import { MosHandler } from './mosHandler'
// import { STATUS_CODES } from 'http'

export interface CoreConfig {
	host: string,
	port: number
}
/**
 * Represents a connection between mos-integration and Core
 */
export class CoreHandler {
	core: CoreConnection

	init (config: CoreConfig): Promise<void> {
		console.log('========')
		this.core = new CoreConnection(this.getCoreConnectionOptions('MOS: Parent process', 'MosCoreParent'))

		this.core.onConnected(() => {
			console.log('Core Connected!')
		})
		this.core.onDisconnected(() => {
			console.log('Core Disconnected!')
		})
		this.core.onError((err) => {
			console.log('Core Error: ' + (err.message || err.toString() || err))
		})

		return this.core.init(config)
		.then(() => {
			console.log('Core id: ' + this.core.deviceId)
			return this.core.setStatus({
				statusCode: P.StatusCode.GOOD
				// messages: []
			})
		})
		.then(() => {
			console.log('Core: Setting up subscriptions..')
			return Promise.all([
				this.core.subscribe('timeline', {
					deviceId: this.core.deviceId
				}),
				this.core.subscribe('peripheralDevices', {
					_id: this.core.deviceId
				})
			])
		})
		.then(() => {
			// console.log('timeline:', this.core.getCollection('timeline').find({}))
			return
		})
	}
	destroy (): Promise<void> {
		return this.core.setStatus({
			statusCode: P.StatusCode.FATAL,
			messages: ['Shutting down']
		}).then(() => {
			return this.core.destroy()
		})
		.then(() => {
			// nothing
		})
	}
	getCoreConnectionOptions (name: string, deviceId: string): CoreOptions {
		let credentials = CoreConnection.getCredentials(deviceId)
		return _.extend(credentials, {
			deviceType: DeviceType.MOSDEVICE,
			deviceName: name
		})
	}
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
