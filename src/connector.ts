import { TSRHandler, TSRConfig } from './tsrHandler'
import { CoreHandler, CoreConfig } from './coreHandler'
import { LoggerInstance } from './index'
import { Process } from './process'
// import {Conductor, DeviceType} from 'timeline-state-resolver'

export interface Config {
	process: ProcessConfig
	device: DeviceConfig
	core: CoreConfig
	tsr: TSRConfig
}
export interface ProcessConfig {
	/** Will cause the Node applocation to blindly accept all certificates. Not recommenced unless in local, controlled networks. */
	unsafeSSL: boolean
	/** Paths to certificates to load, for SSL-connections */
	certificates: string[]
}
export interface DeviceConfig {
	deviceId: string
	deviceToken: string
}
export class Connector {
	private tsrHandler: TSRHandler
	private coreHandler: CoreHandler
	private _config: Config
	private _logger: LoggerInstance
	private _process: Process

	constructor(logger: LoggerInstance) {
		this._logger = logger
	}

	public async init(config: Config): Promise<void> {
		this._config = config

		try {
			await this.initProcess()
			await this.initCore()
			await this.initTSR()

			this._logger.info('Initialization done')
			return
		} catch (e) {
			this._logger.error('Error during initialization:')
			this._logger.error(e)
			this._logger.error(e.stack)

			try {
				if (this.coreHandler) {
					this.coreHandler.destroy().catch(this._logger.error)
				}
				if (this.tsrHandler) {
					this.tsrHandler.destroy().catch(this._logger.error)
				}
			} catch (e) {
				this._logger.error(e)
			}

			this._logger.info('Shutting down in 10 seconds!')
			setTimeout(() => {
				process.exit(0)
			}, 10 * 1000)
			return
		}
	}
	private async initProcess(): Promise<void> {
		this._logger.info('Initializing Process...')
		this._process = new Process(this._logger)
		this._process.init(this._config.process)
		this._logger.info('Process initialized')
	}
	private async initCore(): Promise<void> {
		this._logger.info('Initializing Core...')
		this.coreHandler = new CoreHandler(this._logger, this._config.device)
		await this.coreHandler.init(this._config.core, this._process)
		this._logger.info('Core initialized')
	}
	private async initTSR(): Promise<void> {
		this._logger.info('Initializing TSR...')
		this.tsrHandler = new TSRHandler(this._logger)
		await this.tsrHandler.init(this._config.tsr, this.coreHandler)
		this._logger.info('TSR initialized')
	}
}
