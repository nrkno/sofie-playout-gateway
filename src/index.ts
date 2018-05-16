import {Connector, Config} from './connector'

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
