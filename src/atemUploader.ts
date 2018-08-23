import { Atem } from 'atem-connection'
import * as fs from 'fs'

/**
 * This script is a temporary implementation to upload media to the atem.
 * @todo: proper atem media management
 */

export class AtemUploadScript {
	connection = new Atem()
	fileName: string
	file: Buffer

	connect (ip: string): Promise<null> {
		return new Promise((resolve) => {
			this.connection.connect(ip)
			this.connection.once('connected', () => {
				resolve()
			})
		})
	}

	loadFile (url: string) {
		return new Promise((resolve, reject) => {
			this.fileName = url
			fs.readFile(url, (e, data) => {
				this.file = data
				console.log('got file')
				if (e) reject(e)
				else resolve()
			})
		})
	}

	checkIfFileExistsOnAtem (): boolean {
		if (!this.file) throw Error('Load a file locally before checking if it needs uploading')
		console.log('got a file')
		if (this.connection.state.media.stillPool[0]) {
			console.log('has stills')
			if (this.connection.state.media.stillPool[0].isUsed) {
				console.log('still is used')
				if (this.connection.state.media.stillPool[0].fileName === this.fileName) {
					console.log('name equals')
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		} else {
			console.log('has no stills')
			throw Error('Atem appears to not have any still pools')
		}
	}

	uploadToAtem () {
		if (!this.checkIfFileExistsOnAtem()) {
			console.log('does not exist on atme')
			return this.connection.clearMediaPoolStill(0).then(() =>
				this.connection.uploadStill(0, this.file, this.fileName, '')
			).then(() =>
				this.setMediaPlayerToStill()
			)
		} else {
			console.log('does exist on atme')
			return this.setMediaPlayerToStill()
		}
	}

	setMediaPlayerToStill () {
		if (this.connection.state.media.players[0] && (this.connection.state.media.players[0].stillIndex !== 0 || this.connection.state.media.players[0].sourceType !== 0)) {
			return this.connection.setMediaPlayerSource({ sourceType: 0, stillIndex: 0 }, 0)
		}
		return Promise.resolve()
	}
}

const singleton = new AtemUploadScript()
singleton.connect(process.argv[2]).then(async () => {
	console.log('connected')
	await singleton.loadFile(process.argv[3]).catch((e) => {
		console.error(e)
		process.exit(-1)
	})
	singleton.uploadToAtem().then(() => {
		console.log('uploaded media')
		process.exit(0)
	}, () => process.exit(-1))
}, () => process.exit(-1))
