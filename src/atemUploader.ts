import { Atem } from 'atem-connection'
import * as fs from 'fs'

/**
 * This script is a temporary implementation to upload media to the atem.
 * @todo: proper atem media management
 */

function consoleLog (...args: any[]) {
	console.log('AtemUpload:', ...args)
}
function consoleError (...args: any[]) {
	console.error('AtemUpload:', ...args)
}
export class AtemUploadScript {
	connection: Atem
	fileName: string
	file: Buffer
	mediaPool = 0

	constructor () {
		this.connection = new Atem()

		this.connection.on('error', consoleError)
	}

	connect (ip: string): Promise<null> {
		return new Promise((resolve, reject) => {
			this.connection.once('connected', () => {
				resolve()
			})
			this.connection.connect(ip)
			.catch((err) => {
				reject(err)
			})

		})
	}

	loadFile (url: string) {
		return new Promise((resolve, reject) => {
			this.fileName = url
			fs.readFile(url, (e, data) => {
				this.file = data
				consoleLog('got file')
				if (e) reject(e)
				else resolve()
			})
		})
	}

	checkIfFileExistsOnAtem (): boolean {
		if (!this.file) throw Error('Load a file locally before checking if it needs uploading')
		consoleLog('got a file')
		if (this.connection.state.media.stillPool[this.mediaPool]) {
			consoleLog('has stills')
			if (this.connection.state.media.stillPool[this.mediaPool].isUsed) {
				consoleLog('still is used')
				if (this.connection.state.media.stillPool[this.mediaPool].fileName === this.fileName) {
					consoleLog('name equals')
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		} else {
			consoleLog('has no stills')
			throw Error('Atem appears to not have any still pools')
		}
	}

	uploadToAtem () {
		if (!this.checkIfFileExistsOnAtem()) {
			consoleLog('does not exist on ATEM')
			return this.connection.clearMediaPoolStill(this.mediaPool).then(() =>
				this.connection.uploadStill(this.mediaPool, this.file, this.fileName, '')
			).then(() =>
				this.setMediaPlayerToStill()
			)
		} else {
			consoleLog('does exist on ATEM')
			return this.setMediaPlayerToStill()
		}
	}

	setMediaPlayerToStill () {
		if (this.connection.state.media.players[this.mediaPool] && (this.connection.state.media.players[this.mediaPool].stillIndex !== this.mediaPool || this.connection.state.media.players[this.mediaPool].sourceType !== 0)) {
			return this.connection.setMediaPlayerSource({ sourceType: 0, stillIndex: this.mediaPool }, this.mediaPool)
		}
		return Promise.resolve()
	}
}

export function setupAtemUploader () {
	console.log('Setup AtemUploader...')
	const singleton = new AtemUploadScript()
	singleton.connect(process.argv[2]).then(async () => {
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

		singleton.uploadToAtem().then(() => {
			consoleLog('uploaded ATEM media to pool ' + singleton.mediaPool)
			process.exit(0)
		}, () => process.exit(-1))
	}, () => process.exit(-1))
}
