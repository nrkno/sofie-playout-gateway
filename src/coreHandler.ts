
import { CoreConnection,
	CoreOptions,
	PeripheralDeviceAPI as P,
	DDPConnectorOptions,
	PeripheralDeviceAPI
} from 'tv-automation-server-core-integration'

import {
	DeviceType,
	CasparCGDevice,
	DeviceContainer,
	HyperdeckDevice,
	QuantelDevice,
	MediaObject
} from 'timeline-state-resolver'

import * as _ from 'underscore'
import { DeviceConfig } from './connector'
import { TSRHandler } from './tsrHandler'
import * as fs from 'fs'
import { LoggerInstance } from './index'
import { ThreadedClass } from 'threadedclass'
import { Process } from './process'
import { PLAYOUT_DEVICE_CONFIG } from './configManifest'

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
	logger: LoggerInstance
	public _observers: Array<any> = []
	public deviceSettings: {[key: string]: any} = {}

	public errorReporting: boolean = false
	public multithreading: boolean = false
	public reportAllCommands: boolean = false

	private _deviceOptions: DeviceConfig
	private _onConnected?: () => any
	private _executedFunctions: {[id: string]: boolean} = {}
	private _tsrHandler?: TSRHandler
	private _coreConfig?: CoreConfig
	private _process?: Process

	private _studioId: string
	private _timelineSubscription: string | null = null
	private _expectedItemsSubscription: string | null = null

	private _statusInitialized: boolean = false
	private _statusDestroyed: boolean = false

	constructor (logger: LoggerInstance, deviceOptions: DeviceConfig) {
		this.logger = logger
		this._deviceOptions = deviceOptions
	}

	async init (config: CoreConfig, process: Process): Promise<void> {
		// this.logger.info('========')
		this._statusInitialized = false
		this._coreConfig = config
		this._process = process

		this.core = new CoreConnection(this.getCoreConnectionOptions('Playout gateway', 'PlayoutCoreParent', P.SUBTYPE_PROCESS))

		this.core.onConnected(() => {
			this.logger.info('Core Connected!')
			if (this._onConnected) this._onConnected()
			this.setupObserversAndSubscriptions()
			.catch((e) => {
				this.logger.error('Core Error during setupObserversAndSubscriptions:', e)
			})
		})
		this.core.onDisconnected(() => {
			this.logger.warn('Core Disconnected!')
		})
		this.core.onError((err) => {
			this.logger.error('Core Error: ' + (err.message || err.toString() || err))
		})

		let ddpConfig: DDPConnectorOptions = {
			host: config.host,
			port: config.port
		}
		if (this._process && this._process.certificates.length) {
			ddpConfig.tlsOpts = {
				ca: this._process.certificates
			}
		}

		await this.core.init(ddpConfig)

		this.logger.info('Core id: ' + this.core.deviceId)
		if (this._onConnected) this._onConnected()
		await this.setupObserversAndSubscriptions()

		this._statusInitialized = true
		await this.updateCoreStatus()

	}
	setTSR (tsr: TSRHandler) {
		this._tsrHandler = tsr
	}
	setupObserversAndSubscriptions () {
		this.logger.info('Core: Setting up subscriptions..')
		this.logger.info('DeviceId: ' + this.core.deviceId)
		return Promise.all([
			this.core.autoSubscribe('peripheralDevices', {
				_id: this.core.deviceId
			}),
			this.core.autoSubscribe('studioOfDevice', this.core.deviceId),
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
			let observer = this.core.observe('peripheralDevices')
			observer.added = (id: string) => {
				this.onDeviceChanged(id)
			}
			observer.changed = (id: string) => {
				this.onDeviceChanged(id)
			}

			this.setupObserverForPeripheralDeviceCommands(this)

			return
		})
	}
	destroy (): Promise<void> {
		this._statusDestroyed = true
		return this.updateCoreStatus()
		.then(() => {
			return this.core.destroy()
		})
		.then(() => {
			// nothing
		})
	}
	getCoreConnectionOptions (name: string, subDeviceId: string, subDeviceType: DeviceType | P.SUBTYPE_PROCESS): CoreOptions {
		let credentials: {
			deviceId: string
			deviceToken: string
		}

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
		let options: CoreOptions = {
			...credentials,

			deviceCategory: P.DeviceCategory.PLAYOUT,
			deviceType: P.DeviceType.PLAYOUT,
			deviceSubType: subDeviceType,

			deviceName: name,
			watchDog: (this._coreConfig ? this._coreConfig.watchdog : true),

			configManifest: PLAYOUT_DEVICE_CONFIG
		}
		if (subDeviceType === P.SUBTYPE_PROCESS) options.versions = this._getVersions()
		return options
	}
	onConnected (fcn: () => any) {
		this._onConnected = fcn
	}
	onDeviceChanged (id: string) {
		if (id === this.core.deviceId) {
			let col = this.core.getCollection('peripheralDevices')
			if (!col) throw new Error('collection "peripheralDevices" not found!')

			let device = col.findOne(id)
			if (device) {
				this.deviceSettings = device.settings || {}
			} else {
				this.deviceSettings = {}
			}

			let logLevel = (
				this.deviceSettings['debugLogging'] ?
				'debug' :
				'info'
			)
			if (logLevel !== this.logger.level) {
				this.logger.level = logLevel

				this.logger.info('Loglevel: ' + this.logger.level)

				this.logger.debug('Test debug logging')
				// @ts-ignore
				this.logger.debug({ msg: 'test msg' })
				// @ts-ignore
				this.logger.debug({ message: 'test message' })
				// @ts-ignore
				this.logger.debug({ command: 'test command', context: 'test context' })

				this.logger.debug('End test debug logging')
			}

			if (this.deviceSettings['errorReporting'] !== this.errorReporting) {
				this.errorReporting = this.deviceSettings['errorReporting']
			}
			if (this.deviceSettings['multiThreading'] !== this.multithreading) {
				this.multithreading = this.deviceSettings['multiThreading']
			}
			if (this.deviceSettings['reportAllCommands'] !== this.reportAllCommands) {
				this.reportAllCommands = this.deviceSettings['reportAllCommands']
			}

			let studioId = device.studioId
			if (studioId !== this._studioId) {
				this._studioId = studioId

				// Set up timeline data subscription:
				if (this._timelineSubscription) {
					this.core.unsubscribe(this._timelineSubscription)
					this._timelineSubscription = null
				}
				this.core.autoSubscribe('timeline', {
					studioId: studioId
				}).then((subscriptionId) => {
					this._timelineSubscription = subscriptionId
				}).catch((err) => {
					this.logger.error(err)
				})

				// Set up expectedPlayoutItems data subscription:
				if (this._expectedItemsSubscription) {
					this.core.unsubscribe(this._expectedItemsSubscription)
					this._expectedItemsSubscription = null
				}
				this.core.autoSubscribe('expectedPlayoutItems', {
					studioId: studioId
				}).then((subscriptionId) => {
					this._expectedItemsSubscription = subscriptionId
				}).catch((err) => {
					this.logger.error(err)
				})
				this.logger.debug('VIZDEBUG: Subscription to expectedPlayoutItems done')
			}

			if (this._tsrHandler) {
				this._tsrHandler.onSettingsChanged()
			}
		}
	}
	get logDebug (): boolean {
		return !!this.deviceSettings['debugLogging']
	}

	executeFunction (cmd: PeripheralDeviceCommand, fcnObject: any) {
		if (cmd) {
			if (this._executedFunctions[cmd._id]) return // prevent it from running multiple times
			this.logger.debug(`Executing function "${cmd.functionName}", args: ${JSON.stringify(cmd.args)}`)
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
			let context = (
				fcnObject._device && fcnObject._device._device ?
				fcnObject._device._device : // fcnObject is a CoreTSRDeviceHandler
				fcnObject
			)
			let fcn: Function = fcnObject[cmd.functionName]
			try {
				if (!fcn) throw Error(`Function "${cmd.functionName}" not found on device "${cmd.deviceId}"!`)

				Promise.resolve(fcn.apply(context, cmd.args))
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
	setupObserverForPeripheralDeviceCommands (functionObject: CoreTSRDeviceHandler | CoreHandler) {
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
	devicesMakeReady (okToDestroyStuff?: boolean, activeRundownId?: string): Promise<any> {
		if (this._tsrHandler) {
			return this._tsrHandler.tsr.devicesMakeReady(okToDestroyStuff, activeRundownId)
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
	getSnapshot (): any {
		this.logger.info('getSnapshot')
		let timeline = (
			this._tsrHandler ?
			this._tsrHandler.getTimeline(false) :
			[]
		)
		let mappings = (
			this._tsrHandler ?
			this._tsrHandler.getMapping() :
			[]
		)
		return {
			timeline: timeline,
			mappings: mappings
		}
	}
	getDevicesInfo (): any {
		this.logger.info('getDevicesInfo')

		const devices: any[] = []
		if (this._tsrHandler) {
			for (let device of this._tsrHandler.tsr.getDevices()) {

				devices.push({
					instanceId: device.instanceId,
					deviceId: device.deviceId,
					deviceName: device.deviceName,
					startTime: device.startTime,
					upTime: Date.now() - device.startTime
				})
			}
		}
		return devices
	}
	restartCasparCG (deviceId: string): Promise<any> {
		if (!this._tsrHandler) throw new Error('TSRHandler is not initialized')

		let device = this._tsrHandler.tsr.getDevice(deviceId).device as ThreadedClass<CasparCGDevice>
		if (!device) throw new Error(`TSR Device "${deviceId}" not found!`)

		return device.restartCasparCG()
	}
	restartQuantel (deviceId: string): Promise<any> {
		if (!this._tsrHandler) throw new Error('TSRHandler is not initialized')

		let device = this._tsrHandler.tsr.getDevice(deviceId).device as ThreadedClass<QuantelDevice>
		if (!device) throw new Error(`TSR Device "${deviceId}" not found!`)

		return device.restartGateway()
	}
	async formatHyperdeck (deviceId: string): Promise<void> {
		if (!this._tsrHandler) throw new Error('TSRHandler is not initialized')

		let device = this._tsrHandler.tsr.getDevice(deviceId).device as ThreadedClass<HyperdeckDevice>
		if (!device) throw new Error(`TSR Device "${deviceId}" not found!`)

		await device.formatDisks()
	}
	updateCoreStatus (): Promise<any> {
		let statusCode = P.StatusCode.GOOD
		let messages: Array<string> = []

		if (!this._statusInitialized) {
			statusCode = P.StatusCode.BAD
			messages.push('Starting up...')
		}
		if (this._statusDestroyed) {
			statusCode = P.StatusCode.BAD
			messages.push('Shut down')
		}

		return this.core.setStatus({
			statusCode: statusCode,
			messages: messages
		})
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

export class CoreTSRDeviceHandler {
	core: CoreConnection
	public _observers: Array<any> = []
	public _devicePr: Promise<DeviceContainer>
	public _deviceId: string
	public _device: DeviceContainer
	private _coreParentHandler: CoreHandler
	private _tsrHandler: TSRHandler
	private _subscriptions: Array<string> = []
	private _hasGottenStatusChange: boolean = false

	constructor (parent: CoreHandler, device: Promise<DeviceContainer>, deviceId: string, tsrHandler: TSRHandler) {
		this._coreParentHandler = parent
		this._devicePr = device
		this._deviceId = deviceId
		this._tsrHandler = tsrHandler

		// this._coreParentHandler.logger.info('new CoreTSRDeviceHandler ' + device.deviceName)

		// this.core = new CoreConnection(parent.getCoreConnectionOptions('MOS: ' + device.idPrimary, device.idPrimary, false))
		// this.core.onError((err) => {
		// 	this._coreParentHandler.logger.error('Core Error: ' + (err.message || err.toString() || err))
		// })
	}
	async init (): Promise<void> {
		this._device = await this._devicePr
		let deviceName = this._device.deviceName
		let deviceId = this._device.deviceId

		this.core = new CoreConnection(this._coreParentHandler.getCoreConnectionOptions(deviceName, 'Playout' + deviceId, this._device.deviceOptions.type))
		this.core.onError((err) => {
			this._coreParentHandler.logger.error('Core Error: ' + ((_.isObject(err) && err.message) || err.toString() || err))
		})
		this.core.onInfo((message) => {
			this._coreParentHandler.logger.info('Core Info: ' + ((_.isObject(message) && message.message) || message.toString() || message))
		})
		await this.core.init(this._coreParentHandler.core)

		if (!this._hasGottenStatusChange) {
			await this.core.setStatus({
				statusCode: (
					await this._device.device.canConnect ?
					(await this._device.device.connected ? P.StatusCode.GOOD : P.StatusCode.BAD) :
					P.StatusCode.GOOD
				)
			})
		}
		await this.setupSubscriptionsAndObservers()
		console.log('setupSubscriptionsAndObservers done')
	}
	async setupSubscriptionsAndObservers (): Promise<void> {
		// console.log('setupObservers', this.core.deviceId)
		if (this._observers.length) {
			this._coreParentHandler.logger.info('CoreTSRDevice: Clearing observers..')
			this._observers.forEach((obs) => {
				obs.stop()
			})
			this._observers = []
		}
		let deviceId = this._device.deviceId

		this._coreParentHandler.logger.info('CoreTSRDevice: Setting up subscriptions for ' + this.core.deviceId + ' for device ' + deviceId + ' ..')
		this._subscriptions = []
		try {
			let sub = await this.core.autoSubscribe('peripheralDeviceCommands', this.core.deviceId)
			this._subscriptions.push(sub)
		} catch (e) {
			this._coreParentHandler.logger.error(e)
		}

		this._coreParentHandler.logger.info('CoreTSRDevice: Setting up observers..')

		// setup observers
		this._coreParentHandler.setupObserverForPeripheralDeviceCommands(this)
	}
	onConnectionChanged (deviceStatus: P.StatusObject) {
		this._hasGottenStatusChange = true

		this.core.setStatus(deviceStatus)
		.catch(e => this._coreParentHandler.logger.error('Error when setting status: ' + e, e.stack))
	}
	onCommandError (
		errorMessage: string,
		ref: {
			rundownId?: string,
			partId?: string,
			pieceId?: string,
			context: string,
			timelineObjId: string
		}) {
		this.core.callMethodLowPrio(PeripheralDeviceAPI.methods.reportCommandError, [
			errorMessage,
			ref
		])
		.catch(e => this._coreParentHandler.logger.error('Error when setting status: ' + e, e.stack))
	}
	onUpdateMediaObject (collectionId: string, docId: string, doc: MediaObject | null) {
		this.core.callMethodLowPrio(PeripheralDeviceAPI.methods.updateMediaObject, [
			collectionId,
			docId,
			doc
		])
		.catch(e => this._coreParentHandler.logger.error('Error when updating Media Object: ' + e, e.stack))
	}
	onClearMediaObjectCollection (collectionId: string) {
		this.core.callMethodLowPrio(PeripheralDeviceAPI.methods.clearMediaObjectCollection, [
			collectionId
		])
		.catch(e => this._coreParentHandler.logger.error('Error when clearing Media Objects collection: ' + e, e.stack))
	}

	async dispose (): Promise<void> {
		this._observers.forEach((obs) => {
			obs.stop()
		})

		await this._tsrHandler.tsr.removeDevice(this._deviceId)
		await this.core.setStatus({
			statusCode: P.StatusCode.BAD,
			messages: ['Uninitialized']
		})
	}
	killProcess (actually: number) {
		return this._coreParentHandler.killProcess(actually)
	}
	restartCasparCG (): Promise<any> {
		let device = this._device.device as ThreadedClass<CasparCGDevice>
		if (device.restartCasparCG) {
			return device.restartCasparCG()
		} else {
			return Promise.reject('device.restartCasparCG not set')
		}
	}
	restartQuantel (): Promise<any> {
		let device = this._device.device as ThreadedClass<QuantelDevice>
		if (device.restartGateway) {
			return device.restartGateway()
		} else {
			return Promise.reject('device.restartGateway not set')
		}
	}
	formatHyperdeck (): Promise<any> {
		let device = this._device.device as ThreadedClass<HyperdeckDevice>
		if (device.formatDisks) {
			return device.formatDisks()
		} else {
			return Promise.reject('device.formatHyperdeck not set')
		}
	}
}
