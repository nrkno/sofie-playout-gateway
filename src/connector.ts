import * as Winston from 'winston'
import { TSRHandler, TSRConfig } from './tsrHandler'
import { CoreHandler, CoreConfig } from './coreHandler'
import { MediaScanner, MediaScannerConfig } from './mediaScanner'
// import {Conductor, DeviceType} from 'timeline-state-resolver'

export interface Config {
	core: CoreConfig
	tsr: TSRConfig
	mediaScanner: MediaScannerConfig
}
export class Connector {

	private tsrHandler: TSRHandler
	private coreHandler: CoreHandler
	private mediaScanner: MediaScanner
	private _config: Config
	private _logger: Winston.LoggerInstance

	constructor (logger: Winston.LoggerInstance) {
		this._logger = logger
	}

	init (config: Config): Promise<void> {
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
			this._logger.info('TSR initialized')
			this._logger.info('Initializing Media Scanner...')
			return this.initMediaScanner()
		})
		.then(() => {
			this._logger.info('Initialization done')
			return
		})
		.catch((e) => {
			this._logger.error('Error during initialization:')
			this._logger.error(e)
			this._logger.error(e.stack)
			return
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
	initMediaScanner (): Promise<void> {
		this.mediaScanner = new MediaScanner()

		return this.mediaScanner.init(this._config.mediaScanner, this.coreHandler)

	}
}
