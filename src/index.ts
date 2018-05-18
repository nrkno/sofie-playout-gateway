import {Connector, Config} from './connector'
// import * as Winston from 'winston'

// // CLI arguments / Environment variables --------------
// let host: string 		= process.env.CORE_HOST 					|| '127.0.0.1'
// let port: number 		= parseInt(process.env.CORE_PORT + '', 10) 	|| 3000
// let logPath: string 	= process.env.CORE_LOG						|| ''

// logPath = logPath

// let prevProcessArg = ''
// process.argv.forEach((val) => {
// 	if (prevProcessArg.match(/-host/i)) {
// 		host = val
// 	} else if (prevProcessArg.match(/-port/i)) {
// 		port = parseInt(val, 10)
// 	} else if (prevProcessArg.match(/-log/i)) {
// 		logPath = val
// 	}
// 	prevProcessArg = val + ''
// })

console.log('------------------------------------------------------------------')
console.log('Starting Playout Gateway')
let c = new Connector()
let config: Config = {
	core: {
		host: '127.0.0.1',
		port: 3000
	},
	tsr: {
		devices: {} // to be fetched from Core
	}
}

console.log('Core:          ' + config.core.host + ':' + config.core.port)
console.log('------------------------------------------------------------------')
c.init(config)
