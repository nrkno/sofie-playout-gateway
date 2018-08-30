import * as PouchDB from 'pouchdb-node'
import * as _ from 'underscore'
import * as PromiseSequence from 'promise-sequence'
import { PeripheralDeviceAPI } from 'tv-automation-server-core-integration'
import { CoreHandler } from './coreHandler'
import * as Winston from 'winston'
import * as crypto from 'crypto'

export interface MediaScannerConfig {
	host?: string,
	port?: number,
	collectionId: string
}
export enum MediaStreamType {
	Audio = 'audio',
	Video = 'video'
}
export interface MediaStreamCodec {
	type?: MediaStreamType
	long_name?: string
	time_base?: string
	tag_string?: string
	is_avc?: string
}
export interface MediaStream {
	codec: MediaStreamCodec

	// video
	width?: number
	height?: number
	sample_aspect_ratio?: string
	display_aspect_ratio?: string
	pix_fmt?: string
	bits_per_raw_sample?: string

	// audio
	sample_fmt?: string
	sample_rate?: string
	channels?: number
	channel_layout?: string
	bits_per_sample?: number

	// common
	time_base?: string
	start_time?: string
	duration_ts?: number
	duration?: string

	bit_rate?: string
	max_bit_rate?: string
	nb_frames?: string
}
export interface MediaFormat {
	name?: string
	long_name?: string
	start_time?: string
	duration?: string
	bit_rate?: string
}

export enum FieldOrder {
	Unknown = 'unknown',
	Progressive = 'progressive',
	TFF = 'tff',
	BFF = 'bff'
}

export interface MediaInfo {
	name: string
	field_order: FieldOrder
	scenes: number[]
	streams: MediaStream[]
	format: MediaFormat
}

export interface MediaAttachment {
	digest: string
	content_type: string
	revpos: number
	data?: string // base64
}

export interface MediaObject {
	mediaId: string
	mediaPath: string
	mediaSize: number
	mediaTime: number
	mediainfo?: MediaInfo

	thumbSize: number
	thumbTime: number

	previewSize?: number
	previewTime?: number

	cinf: string // useless to us
	tinf: string // useless to us

	_attachments: {
		[key: string]: MediaAttachment // add more here
	}
	_id: string
	_rev: string
}
/**
 * Represents a connection between Gateway and Media-Scanner
 */
export class MediaScanner {
	logger: Winston.LoggerInstance
	private _config: {
		host: string,
		port: number,
		collectionId: string
	}
	private _db: PouchDB.Database
	private _remote: PouchDB.Database
	private _coreHandler: CoreHandler
	private _changes: PouchDB.Core.Changes<MediaObject>
	private _doReplication: boolean = false

	private _replication: PouchDB.Replication.Replication<{}>
	constructor (logger: Winston.LoggerInstance) {
		this.logger = logger
	}
	public async init (config: MediaScannerConfig, coreHandler: CoreHandler): Promise<void> {

		this._config = {
			host: config.host || '127.0.0.1',
			port: config.port || 8000,
			collectionId: config.collectionId
		}
		this._coreHandler = coreHandler

		let device = await this._coreHandler.core.getPeripheralDevice()
		// this.logger.info('device', device)

		let mediaScannerSettings = (device.settings || {}).mediaScanner || {}
		let lastSeq
		this._config.host = mediaScannerSettings.host || this._config.host
		this._config.port = mediaScannerSettings.port || this._config.port

		this.logger.info('MediaScanner init')

		const baseUrl = 'http://' + this._config.host + ':' + this._config.port

		if (this._doReplication) {
			this._db = new PouchDB('local')
			this._remote = new PouchDB(`${baseUrl}/db/_media`)
			this._replication = this._remote.replicate.to(this._db, { live: true, retry: true })
		} else {
			this._db = new PouchDB(`${baseUrl}/db/_media`)
		}

		// Get sequence id to start at
		// return core.call('getMySequenceNumber', someDeviceId, (sequenceNr) => {
		const changesOptions = {
			since: lastSeq || 'now',
			include_docs: true,
			live: true,
			attachments: true
		}
		const changeHandler = (changes) => {
			const newSequenceNr = changes.seq
			lastSeq = newSequenceNr

			if (changes.deleted) {
				this.logger.debug('MediaScanner: deleteMediaObject', changes.id, newSequenceNr)
				const docId = crypto.createHash('md5').update(changes.id).digest('hex')
				this._sendRemoved(docId)
				.catch((e) => {
					this._coreHandler.logger.error('MediaScanner: Error sending deleted doc', e)
				})
			} else if (changes.doc) {
				const md: MediaObject = changes.doc
				md.mediaId = changes.id
				const docId = crypto.createHash('md5').update(changes.id).digest('hex')
				this.logger.debug('MediaScanner: updateMediaObject', newSequenceNr, md._id, md.mediaId)
				this._sendChanged(md, docId)
				.catch((e) => {
					this._coreHandler.logger.error('MediaScanner: Error sending changed doc', e)
				})

				// const previewUrl = `${baseUrl}/media/preview/${md._id}`
				// Note: it only exists if there is a previewTime or previewSize set in the doc
			}
		}
		const errHandler = (err) => {
			if (err.code === 'ECONNREFUSED') {
				// TODO: try to reconnect
				this.logger.warn('MediaScanner: Connection refused')
			} else if (err instanceof SyntaxError) {
				this.logger.warn('MediaScanner: Connection terminated (' + err.message + ')') // most likely
				// TODO: try to reconnect
			} else {
				this.logger.error('MediaScanner: Error', err)
			}

			this._changes.cancel()
			// restart the changes stream
			setTimeout(() => {
				this._changes = this._db.changes<MediaObject>(changesOptions)
					.on('change', changeHandler)
					.on('error', errHandler)
			}, 2500)
		}

		// Listen for changes
		this._changes = this._db.changes<MediaObject>(changesOptions)
			.on('change', changeHandler)
			.on('error', errHandler)

		this._coreHandler.logger.info('MediaScanner: Start syncing media files')

		return Promise.all([
			this._coreHandler.core.callMethod(PeripheralDeviceAPI.methods.getMediaObjectRevisions, [
				this._config.collectionId
			]),
			this._db.allDocs({
				include_docs: true,
				attachments: true
			})
		])
		.then(([coreObjects, allDocsResponse]) => {

			this._coreHandler.logger.info('MediaScanner: synk objectlists', coreObjects.length, allDocsResponse.total_rows)

			let tasks: Array<() => Promise<any>> = []

			let coreObjRevisions: {[id: string]: string} = {}
			_.each(coreObjects, (obj: any) => {
				coreObjRevisions[obj.id] = obj.rev
			})
			tasks = tasks.concat(_.compact(_.map(allDocsResponse.rows, (doc) => {
				const docId = crypto.createHash('md5').update(doc.id).digest('hex')

				if (doc.value.deleted) {
					if (coreObjRevisions[docId]) {
						// deleted
					}
					return null // handled later
				} else if (
					!coreObjRevisions[docId] ||				// created
					coreObjRevisions[docId] !== doc.value.rev	// changed
				) {
					// emit created / changed
					delete coreObjRevisions[docId]
					return () => {
						return this._db.get<MediaObject>(doc.id, {
							attachments: true
						}).then((doc) => {
							doc.mediaId = doc._id
							return this._sendChanged(doc, docId)
						})
						.then(() => {
							return new Promise(resolve => {
								setTimeout(resolve, 100) // slow it down a bit, maybe remove this later
							})
						})
					}
				} else {
					// identical
					return null
				}
			})))
			_.each(coreObjRevisions, (rev, id) => {
				// deleted
				rev = rev
				// emit deleted
				tasks.push(
					() => {
						return this._sendRemoved(id)
					}
				)
			})
			return PromiseSequence(tasks)
		})
		.then(() => {
			this._coreHandler.logger.info('MediaScanner: Done file sync init')
			return
		})
		.catch((e) => {
			this._coreHandler.logger.error('MediaScanner: Error initializing MediaScanner', e)
		})
	}

	public destroy (): Promise<void> {
		if (this._changes) {
			this._changes.cancel()
		}
		if (this._replication) {
			this._replication.cancel()
		}
		let p = this._db.close()

		if (this._remote) {
			p = p.then(() => this._remote.close())
		}

		return p
	}
	private _sendChanged (doc: MediaObject, id: string): Promise<void> {
		// Added or changed

		let sendDoc = _.omit(doc, ['_attachments'])
		// @ts-ignore
		// this._coreHandler.logger.info('MediaScanner: _sendChanged', JSON.stringify(sendDoc, ' ', 2))
		return this._coreHandler.core.callMethod(PeripheralDeviceAPI.methods.updateMediaObject, [
			this._config.collectionId,
			id,
			sendDoc
		])
		.then(() => {
			return
		})
		.catch((e) => {
			// @ts-ignore
			this._coreHandler.logger.info('MediaScanner: _sendChanged', JSON.stringify(sendDoc, ' ', 2))
			this._coreHandler.logger.error('MediaScanner: Error while updating changed Media object', e)
		})
	}
	private _sendRemoved (docId: string): Promise<void> {
		return this._coreHandler.core.callMethod(PeripheralDeviceAPI.methods.updateMediaObject, [
			this._config.collectionId,
			docId,
			null
		])
		.then(() => {
			return
		})
		.catch((e) => {
			this._coreHandler.logger.error('MediaScanner: Error while updating deleted Media object', e)
		})
	}
}
