import { Config } from './connector'

// CLI arguments / Environment variables --------------
let host: string 		= process.env.CORE_HOST 					|| '127.0.0.1'
let port: number 		= parseInt(process.env.CORE_PORT + '', 10) 	|| 3000
let logPath: string 	= process.env.CORE_LOG						|| ''
let deviceId: string 	= process.env.DEVICE_ID						|| ''
let deviceToken: string 	= process.env.DEVICE_TOKEN 				|| ''
let disableWatchdog: boolean = (process.env.DISABLE_WATCHDOG === '1') 		|| false
let mediaScannerHost: string = process.env.MEDIA_SCANNER_HOST || '127.0.0.1'
let mediaScannerPort: number = parseInt(process.env.MEDIA_SCANNER_PORT + '', 10) || 8000

logPath = logPath

let prevProcessArg = ''
process.argv.forEach((val) => {
	val = val + ''
	if (prevProcessArg.match(/-host/i)) {
		host = val
	} else if (prevProcessArg.match(/-port/i)) {
		port = parseInt(val, 10)
	} else if (prevProcessArg.match(/-log/i)) {
		logPath = val
	} else if (prevProcessArg.match(/-id/i)) {
		deviceId = val
	} else if (prevProcessArg.match(/-token/i)) {
		deviceToken = val
	} else if (val.match(/-disableWatchdog/i)) {
		disableWatchdog = true
	} else if (prevProcessArg.match(/-mediaScannerHost/i)) {
		mediaScannerHost = val
	} else if (prevProcessArg.match(/-mediaScannerPort/i)) {
		mediaScannerPort = parseInt(val, 10)
	}
	prevProcessArg = val + ''
})

const config: Config = {
	device: {
		deviceId: deviceId,
		deviceToken: deviceToken
	},
	core: {
		host: host,
		port: port,
		watchdog: !disableWatchdog
	},
	tsr: {
		devices: {} // to be fetched from Core
	},
	mediaScanner: {
		collectionId: 'default', // TODO: to be fetched from core
		host: mediaScannerHost,
		port: mediaScannerPort
	}
}

export { config, logPath, disableWatchdog }
