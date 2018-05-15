import {ScannerHandler} from './scanner'

console.log('------------------------------------------------------------------')
console.log('Starting Playout Gateway')

console.log('------------------------------------------------------------------')
var scanner = new ScannerHandler()
var config = {}
scanner.init(config)
