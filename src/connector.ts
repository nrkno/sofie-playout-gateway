import * as Winston from 'winston'
import {TSRHandler, TSRConfig} from './tsrHandler'
import {CoreHandler, CoreConfig} from './coreHandler'
// import {Conductor, DeviceType} from 'timeline-state-resolver'

export interface Config {
	core: CoreConfig
	tsr: TSRConfig
}
export class Connector {

	private tsrHandler: TSRHandler
	private coreHandler: CoreHandler
	private _config: Config
	private _logger: Winston.LoggerInstance

	constructor (logger: Winston.LoggerInstance) {
		this._logger = logger
	}

	init (config: Config): Promise<number> {
		this._config = config

		return Promise.resolve()
		.then(() => {
			this._logger.info('Initializing Core...')
			return this.initCore()
		})
		.then(() => {
			this._logger.info('Core initialized')
			this._logger.info('Initializing TSR...')
			return this.initTSR()
		})
		.then(() => {
			this._logger.info('Initialization done')
			return 0
		})
		.catch((e) => {
			this._logger.error('Error during initialization:')
			this._logger.error(e)
			this._logger.error(e.stack)
			return 0
		})
	}
	initCore () {
		this.coreHandler = new CoreHandler(this._logger)
		return this.coreHandler.init(this._config.core)
	}
	initTSR (): Promise<void> {
		this.tsrHandler = new TSRHandler()
		return this.tsrHandler.init(this._config.tsr, this.coreHandler)

	}
}
