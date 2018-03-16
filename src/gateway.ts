import {CoreConnection, PeripheralDeviceAPI} from 'core-integration'
import {Conductor, DeviceType} from 'timeline-state-resolver'

export class Gateway {

	core: CoreConnection
	conductor: Conductor

	constructor () {
		// Nothing
	}

	async init () {

		console.log('----------------------')
		console.log('Initializing...')

		await this.initCore()

		console.log('Initialized core')

		await this.initTSR()

		console.log('Initialized TSR')

	}

	async initCore () {

		// @todo: add this.core.destroy()

		this.core = new CoreConnection({
			deviceId: 'temp',
			deviceToken: 'abcd',
			deviceType: PeripheralDeviceAPI.DeviceType.PLAYOUT,
			deviceName: 'Temporary name for playout device'
		})

		await this.core.init({
			host: '192.168.177.128',
			port: 3000
		})
	}
	async initTSR () {

		// @todo: add this.conductor.destroy()

		this.conductor = new Conductor({
			devices: { // @todo: this data should come from Core
				'device0': {
					type: DeviceType.CASPARCG,
					options: {
					}
				},
				'device1': {
					type: DeviceType.CASPARCG,
					options: {
					}
				}
			},
			initializeAsClear: true, // @todo: set this to false in the future
			getCurrentTime: () => { return this.getCurrentTime() }
		})
	}
	getCurrentTime () {
		return this.core.getCurrentTime()
	}
}
