import * as Winston from 'winston'
import axios from 'axios'
import * as http from 'http'
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
	}

	restartCasparCG () {
		this.logger.info('Restarting CasparCG')
		return new Promise<void>((resolve, reject) => {
			axios.post(`http://${this.config.httpApiHost}:${this.config.httpApiPort}/processes/casparcg/restart`).then(res => {
				if (res.status === 200) {
					this.logger.info('Http request to launcher succesfull')
					resolve()
				} else {
					this.logger.info('Http request to launcher rejected', res.status, res.statusText)
					reject(res.status)
				}
			})
		})
	}
}
