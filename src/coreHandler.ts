
import { CoreConnection,
	CoreOptions,
	DeviceType,
	PeripheralDeviceAPI as P
} from 'core-integration'

import * as _ from 'underscore'

export interface CoreConfig {
	host: string,
	port: number
}
/**
 * Represents a connection between the Gateway and Core
 */
export class CoreHandler {
	core: CoreConnection

	init (config: CoreConfig): Promise<void> {
		console.log('========')
		this.core = new CoreConnection(this.getCoreConnectionOptions('Playout: Parent process', 'PlayoutCoreParent'))

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
			deviceType: DeviceType.PLAYOUT,
			deviceName: name
		})
	}

}
