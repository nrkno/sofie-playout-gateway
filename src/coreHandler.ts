
import { CoreConnection,
	CoreOptions,
	PeripheralDeviceAPI as P
} from 'tv-automation-server-core-integration'

import * as _ from 'underscore'
import * as Winston from 'winston'
import { DeviceConfig } from './connector'
import { TSRHandler } from './tsrHandler'
import * as fs from 'fs'

export interface CoreConfig {
	host: string,
	port: number,
	watchdog: boolean
}
export interface PeripheralDeviceCommand {
	_id: string

	deviceId: string
	functionName: string
	args: Array<any>

	hasReply: boolean
	reply?: any
	replyError?: any

	time: number // time
}
/**
 * Represents a connection between the Gateway and Core
 */
export class CoreHandler {
	core: CoreConnection
	logger: Winston.LoggerInstance
	restartCasparCGProcess: () => Promise<void>
	private _deviceOptions: DeviceConfig
	private _onConnected?: () => any
	private _executedFunctions: {[id: string]: boolean} = {}
	private _observers: Array<any> = []
	private _tsrHandler?: TSRHandler
	private _coreConfig?: CoreConfig

	constructor (logger: Winston.LoggerInstance, deviceOptions: DeviceConfig) {
		this.logger = logger
		this._deviceOptions = deviceOptions
	}

	init (config: CoreConfig): Promise<void> {
		// this.logger.info('========')
		this._coreConfig = config
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
	setTSR (tsr: TSRHandler) {
		this._tsrHandler = tsr
	}
	setupObserversAndSubscriptions () {
		this.logger.info('Core: Setting up subscriptions..')
		this.logger.info('DeviceId: ' + this.core.deviceId)
		return Promise.all([
			this.core.autoSubscribe('timeline', {
				deviceId: this.core.deviceId
			}),
			this.core.autoSubscribe('peripheralDevices', {
				_id: this.core.deviceId
			}),
			this.core.autoSubscribe('studioInstallationOfDevice', this.core.deviceId),
			this.core.autoSubscribe('peripheralDeviceCommands', this.core.deviceId)
		])
		.then(() => {
			this.logger.info('Core: Subscriptions are set up!')

			if (this._observers.length) {
				this.logger.info('CoreMos: Clearing observers..')
				this._observers.forEach((obs) => {
					obs.stop()
				})
				this._observers = []
			}
			// setup observers
			this.setupObserverForPeripheralDeviceCommands(this)

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
		let options: CoreOptions = _.extend(credentials, {
			deviceType: (parentProcess ? P.DeviceType.PLAYOUT : P.DeviceType.OTHER),
			deviceName: name,
			watchDog: (this._coreConfig ? this._coreConfig.watchdog : true)
		})
		if (parentProcess) options.versions = this._getVersions()
		return options
	}
	onConnected (fcn: () => any) {
		this._onConnected = fcn
	}

	executeFunction (cmd: PeripheralDeviceCommand, fcnObject: any) {
		if (cmd) {
			if (this._executedFunctions[cmd._id]) return // prevent it from running multiple times
			this.logger.info(cmd.functionName, cmd.args)
			this._executedFunctions[cmd._id] = true
			// console.log('executeFunction', cmd)
			let cb = (err: any, res?: any) => {
				// console.log('cb', err, res)
				if (err) {
					this.logger.error('executeFunction error', err, err.stack)
				}
				this.core.callMethod(P.methods.functionReply, [cmd._id, err, res])
				.then(() => {
					// console.log('cb done')
				})
				.catch((e) => {
					this.logger.error(e)
				})
			}
			// @ts-ignore
			let fcn: Function = fcnObject[cmd.functionName]
			try {
				if (!fcn) throw Error('Function "' + cmd.functionName + '" not found!')

				Promise.resolve(fcn.apply(fcnObject, cmd.args))
				.then((result) => {
					cb(null, result)
				})
				.catch((e) => {
					cb(e.toString(), null)
				})
			} catch (e) {
				cb(e.toString(), null)
			}
		}
	}
	retireExecuteFunction (cmdId: string) {
		delete this._executedFunctions[cmdId]
	}
	setupObserverForPeripheralDeviceCommands (functionObject: CoreHandler) {
		let observer = functionObject.core.observe('peripheralDeviceCommands')
		functionObject.killProcess(0)
		functionObject._observers.push(observer)
		let addedChangedCommand = (id: string) => {
			let cmds = functionObject.core.getCollection('peripheralDeviceCommands')
			if (!cmds) throw Error('"peripheralDeviceCommands" collection not found!')
			let cmd = cmds.findOne(id) as PeripheralDeviceCommand
			if (!cmd) throw Error('PeripheralCommand "' + id + '" not found!')
			// console.log('addedChangedCommand', id)
			if (cmd.deviceId === functionObject.core.deviceId) {
				this.executeFunction(cmd, functionObject)
			} else {
				// console.log('not mine', cmd.deviceId, this.core.deviceId)
			}
		}
		observer.added = (id: string) => {
			addedChangedCommand(id)
		}
		observer.changed = (id: string) => {
			addedChangedCommand(id)
		}
		observer.removed = (id: string) => {
			this.retireExecuteFunction(id)
		}
		let cmds = functionObject.core.getCollection('peripheralDeviceCommands')
		if (!cmds) throw Error('"peripheralDeviceCommands" collection not found!')
		cmds.find({}).forEach((cmd: PeripheralDeviceCommand) => {
			if (cmd.deviceId === functionObject.core.deviceId) {
				this.executeFunction(cmd, functionObject)
			}
		})
	}
	killProcess (actually: number) {
		if (actually === 1) {
			this.logger.info('KillProcess command received, shutting down in 1000ms!')
			setTimeout(() => {
				process.exit(0)
			}, 1000)
			return true
		}
		return 0
	}
	devicesMakeReady (okToDestroyStuff?: boolean): Promise<any> {
		if (this._tsrHandler) {
			return this._tsrHandler.tsr.devicesMakeReady(okToDestroyStuff)
		} else {
			throw Error('TSR not set up!')
		}
	}
	devicesStandDown (okToDestroyStuff?: boolean): Promise<any> {
		if (this._tsrHandler) {
			return this._tsrHandler.tsr.devicesStandDown(okToDestroyStuff)
		} else {
			throw Error('TSR not set up!')
		}
	}
	pingResponse (message: string) {
		this.core.setPingResponse(message)
		return true
	}
	private _getVersions () {
		let versions: {[packageName: string]: string} = {}

		if (process.env.npm_package_version) {
			versions['_process'] = process.env.npm_package_version
		}

		let dirNames = [
			'tv-automation-server-core-integration',
			'timeline-state-resolver',
			'atem-connection',
			'atem-state',
			'casparcg-connection',
			'casparcg-state',
			'emberplus',
			'superfly-timeline'
		]
		try {
			let nodeModulesDirectories = fs.readdirSync('node_modules')
			_.each(nodeModulesDirectories, (dir) => {
				try {
					if (dirNames.indexOf(dir) !== -1) {
						let file = 'node_modules/' + dir + '/package.json'
						file = fs.readFileSync(file, 'utf8')
						let json = JSON.parse(file)
						versions[dir] = json.version || 'N/A'
					}
				} catch (e) {
					this.logger.error(e)
				}
			})
		} catch (e) {
			this.logger.error(e)
		}
		return versions
	}

}
