import * as PouchDB from 'pouchdb-node'
import * as _ from 'underscore'
import * as PromiseSequence from 'promise-sequence'
import { PeripheralDeviceAPI } from 'core-integration'
import { CoreHandler } from './coreHandler'

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
	private _config: {
		host: string,
		port: number,
		collectionId: string
	}
	private _db: PouchDB.Database
	private _coreHandler: CoreHandler
	private _changes: PouchDB.Core.Changes<MediaObject>

	public init (config: MediaScannerConfig, coreHandler: CoreHandler): Promise<void> {

		this._config = {
			host: config.host || '127.0.0.1',
			port: config.port || 8000,
			collectionId: config.collectionId
		}
		this._coreHandler = coreHandler

		console.log('========')

		const baseUrl = 'http://' + this._config.host + ':' + this._config.port

		this._db = new PouchDB(`${baseUrl}/db/_media`)

		// Get sequence id to start at
		// return core.call('getMySequenceNumber', someDeviceId, (sequenceNr) => {

		// Listen for changes
		this._changes = this._db.changes<MediaObject>({
			since: 'now',
			include_docs: true,
			live: true,
			attachments: true
		}).on('change', (changes) => {
			const newSequenceNr = changes.seq

			if (changes.deleted) {
				console.log('deleteMediaObject', changes.id, newSequenceNr)
				this._sendRemoved(changes.id)
				.catch((e) => {
					this._coreHandler.logger.error('Error sending deledet doc', e)
				})
			} else if (changes.doc) {
				const md: MediaObject = changes.doc
				console.log('updateMediaObject', newSequenceNr, md._id)

				this._sendChanged(md)
				.catch((e) => {
					this._coreHandler.logger.error('Error sending changed doc', e)
				})

				// const previewUrl = `${baseUrl}/media/preview/${md._id}`
				// Note: it only exists if there is a previewTime or previewSize set in the doc
			}
		}).on('error', (err) => {
			if (err.code === 'ECONNREFUSED') {
				// TODO: try to reconnect
				console.log('Connection refused')
			} else if (err instanceof SyntaxError) {
				console.log('Connection terminated') // most likely
				// TODO: try to reconnect
			} else {
				console.log('Error', err)
			}

			this._changes.cancel()
			// TODO - restart the changes stream
		})

		this._coreHandler.logger.info('Start syncing media files')

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

			this._coreHandler.logger.info('synk objectlists', coreObjects.length, allDocsResponse.total_rows)

			let tasks: Array<() => Promise<any>> = []

			let coreObjRevisions: {[id: string]: string} = {}
			_.each(coreObjects, (obj: any) => {
				coreObjRevisions[obj.id] = obj.rev
			})
			tasks = tasks.concat(_.compact(_.map(allDocsResponse.rows, (doc) => {

				if (doc.value.deleted) {
					if (coreObjRevisions[doc.id]) {
						// deleted
					}
					return null // handled later
				} else if (
					!coreObjRevisions[doc.id] ||				// created
					coreObjRevisions[doc.id] !== doc.value.rev	// changed
				) {
					// emit created / changed
					delete coreObjRevisions[doc.id]
					return () => {
						return this._db.get<MediaObject>(doc.id, {
							attachments: true
						}).then((doc) => {
							return this._sendChanged(doc)
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
			this._coreHandler.logger.info('Done file sync init')
			return
		})
		.catch((e) => {
			this._coreHandler.logger.error('Error initializing MediaScanner', e)
		})
	}

	public scrapeAll (): Promise<any> {
		return this.scrapePage('', 100)
	}
	public destroy (): Promise<void> {
		if (this._changes) {
			this._changes.cancel()
		}

		return this._db.close()
	}
	private _sendChanged (doc: MediaObject): Promise<void> {
		// Added or changed

		let sendDoc = _.omit(doc, ['_attachments'])
		// @ts-ignore
		// this._coreHandler.logger.info('_sendChanged', JSON.stringify(sendDoc, ' ', 2))
		return this._coreHandler.core.callMethod(PeripheralDeviceAPI.methods.updateMediaObject, [
			this._config.collectionId,
			doc._id,
			sendDoc
		])
		.then(() => {
			return
		})
		.catch((e) => {
			// @ts-ignore
			this._coreHandler.logger.info('_sendChanged', JSON.stringify(sendDoc, ' ', 2))
			this._coreHandler.logger.error('Error while updating changed Media object', e)
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
			this._coreHandler.logger.error('Error while updating deleted Media object', e)
		})
	}

	private scrapePage (startKey: string, limit: number): Promise<any> {
		const someDeviceId = 'dev1'

		// Note: startKey and limit are optional, and are used to page the results. Not sure if paging is necessary, but its easier to strip it out than add it in
		return this._db.allDocs<MediaObject>({
			attachments: true,
			include_docs: true,
			startkey: startKey,
			limit: limit
		})
		.then(docs => {
			docs.rows.forEach(doc => {
				if (doc.doc) {
					const md: MediaObject = doc.doc
					console.log('updateMediaObject', someDeviceId, md, -1)
				}
			})

			// Note: Also drop this block if paging isnt wanted
			if (docs.rows.length === limit) {
				return this.scrapePage(docs.rows[docs.rows.length - 1].id, limit)
			}
			return 'N/A' // TODO: what does this function do? /Nyman
		})
	}
}
