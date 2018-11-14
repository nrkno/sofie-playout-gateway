import { Connector } from './connector'
import { config, logPath, disableWatchdog } from './config'
import * as Winston from 'winston'

let c: Connector
// Setup logging --------------------------------------
let logger = new (Winston.Logger)({
})
if (logPath) {
	// Log json to file, human-readable to console
	logger.add(Winston.transports.Console, {
		level: 'verbose',
		handleExceptions: true,
		json: false
	})
	logger.add(Winston.transports.File, {
		level: 'debug',
		handleExceptions: true,
		json: true,
		filename: logPath
	})
	logger.info('Logging to', logPath)
	// Hijack console.log:
	// @ts-ignore
	let orgConsoleLog = console.log
	console.log = function (...args: any[]) {
		// orgConsoleLog('a')
		if (args.length >= 1) {
			// @ts-ignore one or more arguments
			logger.debug(...args)
			orgConsoleLog(...args)
		}
	}
} else {
	// Log json to console
	logger.add(Winston.transports.Console,{
		handleExceptions: true,
		json: true,
		stringify: (obj) => {
			obj.localTimestamp = getCurrentTime()
			obj.randomId = Math.round(Math.random() * 10000)
			return JSON.stringify(obj) // make single line
		}
	})
	logger.info('Logging to Console')
	// Hijack console.log:
	// @ts-ignore
	let orgConsoleLog = console.log
	console.log = function (...args: any[]) {
		// orgConsoleLog('a')
		if (args.length >= 1) {
			// @ts-ignore one or more arguments
			logger.debug(...args)
		}
	}
}
function getCurrentTime () {
	let v = Date.now()
	// if (c && c.coreHandler && c.coreHandler.core) {
	// 	v = c.coreHandler.core.getCurrentTime()
	// }
	return new Date(v).toISOString()
}

// Because the default NodeJS-handler sucks and wont display error properly
process.on('unhandledRejection', (e: any) => {
	logger.error('Unhandled Promise rejection:', e, e.reason || e.message, e.stack)
})
process.on('warning', (e: any) => {
	logger.warn('Unhandled warning:', e, e.reason || e.message, e.stack)
})

logger.info('------------------------------------------------------------------')
logger.info('Starting Playout Gateway')
if (disableWatchdog) logger.info('Watchdog is disabled!')
c = new Connector(logger)

logger.info('Core:          ' + config.core.host + ':' + config.core.port)
logger.info('------------------------------------------------------------------')
c.init(config)
.catch(e => {
	logger.error(e)
})

// @todo: remove this line of comment
