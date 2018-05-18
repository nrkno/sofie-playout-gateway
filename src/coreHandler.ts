
import { CoreConnection,
	CoreOptions,
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
	private _onConnected?: () => any

	init (config: CoreConfig): Promise<void> {
		console.log('========')
		this.core = new CoreConnection(this.getCoreConnectionOptions('Playout: Parent process', 'PlayoutCoreParent', true))

		this.core.onConnected(() => {
			console.log('Core Connected!')
			this.setupObserversAndSubscriptions()
			if (this._onConnected) this._onConnected()
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
			return this.setupObserversAndSubscriptions()
		})
		.then(() => {
			return this.core.setStatus({
				statusCode: P.StatusCode.GOOD
				// messages: []
			})
		})
		.then(() => {
			return
		})
	}
	setupObserversAndSubscriptions () {
		console.log('Core: Setting up subscriptions..')
		console.log('DeviceId: ' + this.core.deviceId)
		return Promise.all([
			this.core.subscribe('timeline', {
				deviceId: this.core.deviceId
			}),
			this.core.subscribe('peripheralDevices', {
				_id: this.core.deviceId
			}),
			this.core.subscribe('studioInstallationOfDevice', this.core.deviceId)
		])
		.then(() => {
			console.log('Core: Subscriptions are set up!')

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
	getCoreConnectionOptions (name: string, deviceId: string, parentProcess: boolean): CoreOptions {
		let credentials = CoreConnection.getCredentials(deviceId)
		return _.extend(credentials, {
			deviceType: (parentProcess ? P.DeviceType.PLAYOUT : P.DeviceType.OTHER),
			deviceName: name
		})
	}
	onConnected (fcn: () => any) {
		this._onConnected = fcn
	}

}
