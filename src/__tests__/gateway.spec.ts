
import {Gateway} from '../gateway'

test('Test Gateway', async () => {

	let gw = new Gateway()

	await gw.init()

	console.log('Test done')

	expect(1).toEqual(1)
})
