
import { CoreConnection,
	CoreOptions,
	PeripheralDeviceAPI as P
} from 'core-integration'

import * as _ from 'underscore'
import * as Winston from 'winston'
import { DeviceConfig } from './connector'

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
	private _deviceOptions: DeviceConfig
	private _onConnected?: () => any

	constructor (logger: Winston.LoggerInstance, deviceOptions: DeviceConfig) {
		this.logger = logger
		this._deviceOptions = deviceOptions
	}

	init (config: CoreConfig): Promise<void> {
		// this.logger.info('========')
		this.core = new CoreConnection(this.getCoreConnectionOptions('Playout: Parent process', 'PlayoutCoreParent', true))

		this.core.onConnected(() => {
			this.logger.info('Core Connected!')
			this.setupObserversAndSubscriptions()
			.catch((e) => {
				this.logger.error('Core Error:', e)
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
	getCoreConnectionOptions (name: string, subDeviceId: string, parentProcess: boolean): CoreOptions {
		let credentials

		if (this._deviceOptions.deviceId && this._deviceOptions.deviceToken) {
			credentials = {
				deviceId: this._deviceOptions.deviceId + subDeviceId,
				deviceToken: this._deviceOptions.deviceToken
			}
		} else if (this._deviceOptions.deviceId) {
			this.logger.warn('Token not set, only id! This might be unsecure!')
			credentials = {
				deviceId: this._deviceOptions.deviceId + subDeviceId,
				deviceToken: 'unsecureToken'
			}
		} else {
			credentials = CoreConnection.getCredentials(subDeviceId)
		}
		return _.extend(credentials, {
			deviceType: (parentProcess ? P.DeviceType.PLAYOUT : P.DeviceType.OTHER),
			deviceName: name
		})
	}
	onConnected (fcn: () => any) {
		this._onConnected = fcn
	}

}
