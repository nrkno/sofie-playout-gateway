
import { CoreConnection,
	CoreOptions,
	PeripheralDeviceAPI as P
} from 'core-integration'

import * as _ from 'underscore'
import * as Winston from 'winston'

export interface CoreConfig {
	host: string,
	port: number
}
/**
 * Represents a connection between the Gateway and Core
 */
export class CoreHandler {
	core: CoreConnection
	logger: Winston.LoggerInstance
	private _onConnected?: () => any

	constructor (logger: Winston.LoggerInstance) {
		this.logger = logger
	}

	init (config: CoreConfig): Promise<void> {
		// this.logger.info('========')
		this.core = new CoreConnection(this.getCoreConnectionOptions('Playout: Parent process', 'PlayoutCoreParent', true))

		this.core.onConnected(() => {
			this.logger.info('Core Connected!')
			this.setupObserversAndSubscriptions()
			.catch((e) => {
				this.logger.error(e)
			})
			if (this._onConnected) this._onConnected()
		})
		this.core.onDisconnected(() => {
			this.logger.warn('Core Disconnected!')
		})
		this.core.onError((err) => {
			this.logger.error('Core Error: ' + (err.message || err.toString() || err))
		})

		return this.core.init(config)
		.then(() => {
			this.logger.info('Core id: ' + this.core.deviceId)
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
		this.logger.info('Core: Setting up subscriptions..')
		this.logger.info('DeviceId: ' + this.core.deviceId)
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
			this.logger.info('Core: Subscriptions are set up!')

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
