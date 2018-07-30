import * as Winston from 'winston'
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
		coreHandler.restartCasparCGProcess = this.restartCasparCG
	}

	restartCasparCG () {
		this.logger.info('Restarting CasparCG')
		return new Promise<void>((resolve, reject) => {
			http.request({
				hostname: this.config.httpApiHost,
				port: this.config.httpApiPort,
				path: 'processes/casparcg/restart',
				method: 'POST'
			}, (res) => {
				res.on('end', () => {
					if (res.statusCode === 200) {
						this.logger.info('Http request to launcher succesfull')
						resolve()
					} else {
						this.logger.info('Http request to launcher rejected', res.statusCode, res.statusMessage)
						reject(res.statusCode)
					}
				})
			})
		})
	}
}
