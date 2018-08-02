import * as Winston from 'winston'
import axios from 'axios'
import { CoreHandler } from './coreHandler'

export interface LauncherConfig {
	httpApiPort: number
	httpApiHost: string
}

export class Launcher {
	config: LauncherConfig
	logger: Winston.LoggerInstance

	constructor (logger: Winston.LoggerInstance) {
		this.logger = logger
	}

	public async init (config: LauncherConfig, coreHandler: CoreHandler): Promise<void> {
		this.config = config
		coreHandler.restartCasparCGProcess = () => this.restartCasparCG()

		let device = await coreHandler.core.getPeripheralDevice()
		let casparcgLauncherSettings = (device.settings || {}).casparcgLauncher || {}
		this.config.httpApiHost = casparcgLauncherSettings.host || this.config.httpApiHost
		this.config.httpApiPort = casparcgLauncherSettings.port || this.config.httpApiPort
	}

	restartCasparCG () {
		this.logger.info('Restarting CasparCG')

		return axios.post(`http://${this.config.httpApiHost}:${this.config.httpApiPort}/processes/casparcg/restart`).then(response => {
			this.logger.info('Http request to launcher successful, response ' + response.status)
		}, (e) => {
			this.logger.error('Http request to launcher rejected', e + '')
		}).catch((e) => {
			throw Error(e)
		})
	}
}
