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

	constructor (logger: Winston.LoggerInstance, config: LauncherConfig, coreHandler: CoreHandler) {
		this.logger = logger
		this.config = config
		coreHandler.restartCasparCGProcess = () => this.restartCasparCG()
		coreHandler.core.getPeripheralDevice().then((device) => {
			this.config.httpApiHost = device.settings.casparcgLauncher.host || this.config.httpApiHost
			this.config.httpApiPort = device.settings.casparcgLauncher.port || this.config.httpApiPort
		})
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
