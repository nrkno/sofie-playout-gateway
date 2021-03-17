/* eslint-disable no-process-exit */
// eslint-disable-next-line node/no-extraneous-import
import { Atem } from 'atem-connection'
import * as fs from 'fs'
import * as _ from 'underscore'

/**
 * This script is a temporary implementation to upload media to the atem.
 * @todo: proper atem media management
 */

function consoleLog(...args: any[]) {
	console.log('AtemUpload:', ...args)
}
function consoleError(...args: any[]) {
	console.error('AtemUpload:', ...args)
}
export class AtemUploadScript {
	connection: Atem
	fileName: string
	file: Buffer
	mediaPool = 0

	constructor() {
		this.connection = new Atem()

		this.connection.on('error', consoleError)
	}

	connect(ip: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection.once('connected', () => {
				resolve()
			})
			this.connection.connect(ip).catch((err) => {
				reject(err)
			})
		})
	}

	loadFile(url: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.fileName = url.substr(-63) // cannot be longer than 63 chars
			fs.readFile(url, (e, data) => {
				this.file = data
				consoleLog('got file')
				if (e) reject(e)
				else resolve()
			})
		})
	}

	checkIfFileExistsOnAtem(): boolean {
		if (!this.file) throw Error('Load a file locally before checking if it needs uploading')
		consoleLog('got a file')

		const still = this.connection.state ? this.connection.state.media.stillPool[this.mediaPool] : undefined
		if (still) {
			consoleLog('has still')
			if (still.isUsed) {
				consoleLog('still is used')
				if (this.fileName.length === 63) {
					consoleLog('filename is max length, change detection might fail')
				}

				if (still.fileName === this.fileName) {
					consoleLog('name equals')
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		} else {
			consoleLog('has no still')
			throw Error('Atem appears to be missing still')
		}
	}

	async uploadToAtem(): Promise<void> {
		if (!this.checkIfFileExistsOnAtem()) {
			consoleLog('does not exist on ATEM')
			await this.connection.clearMediaPoolStill(this.mediaPool)
			await this.connection.uploadStill(this.mediaPool, this.file, this.fileName, '')
		} else {
			consoleLog('does exist on ATEM')
			return
		}
	}
}

console.log('Setup AtemUploader...')
const singleton = new AtemUploadScript()
singleton.connect(process.argv[2]).then(
	async () => {
		consoleLog('ATEM upload connected')
		await singleton.loadFile(process.argv[3]).catch((e) => {
			consoleError(e)
			console.error('Exiting process due to atemUpload error')
			process.exit(-1)
		})
		let mediaPool: string | undefined
		if (process.argv.length >= 5) {
			mediaPool = process.argv[4]
		}
		if (mediaPool !== undefined) {
			singleton.mediaPool = parseInt(mediaPool, 10)
		}

		if (isNaN(singleton.mediaPool) || !_.isNumber(singleton.mediaPool)) {
			console.error('Exiting due to invalid mediaPool')
			process.exit(-1)
		}

		singleton.uploadToAtem().then(
			() => {
				consoleLog('uploaded ATEM media to pool ' + singleton.mediaPool)
				process.exit(0)
			},
			() => process.exit(-1)
		)
	},
	() => process.exit(-1)
)
