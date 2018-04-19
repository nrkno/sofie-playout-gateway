
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

	init (config: Config): Promise<number> {
		this._config = config

		return Promise.resolve()
		.then(() => {
			console.log('Initializing Core...')
			return this.initCore()
		})
		.then(() => {
			console.log('Core initialized')
			console.log('Initializing TSR...')
			return this.initTSR()
		})
		.then(() => {
			console.log('Initialization done')
			return 0
		})
		.catch((e) => {
			console.log('Error during initialization:')
			console.log(e)
			console.log(e.stack)
			return 0
		})
	}
	initCore () {
		this.coreHandler = new CoreHandler()
		return this.coreHandler.init(this._config.core)
	}
	initTSR (): Promise<void> {
		// TODO: maybe get some config data from core here?
		this.tsrHandler = new TSRHandler()
		return this.tsrHandler.init(this._config.tsr, this.coreHandler)

	}
}