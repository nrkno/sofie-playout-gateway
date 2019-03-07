import * as PouchDB from 'pouchdb-node'
import * as _ from 'underscore'
import * as PromiseSequence from 'promise-sequence'
import { PeripheralDeviceAPI } from 'tv-automation-server-core-integration'
import { CoreHandler } from './coreHandler'
import * as crypto from 'crypto'
import axios from 'axios'
import { LoggerInstance } from './index'

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

export interface DiskInfo {
	fs: string
	type?: string
	size: number | null
	used: number | null
	use: number | null
	mount: boolean | string
}
/**
 * Represents a connection between Gateway and Media-Scanner
 */
export class MediaScanner {
	logger: LoggerInstance
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
	private _triggerupdateFsStatsTimeout?: NodeJS.Timer
	private _checkFsStatsInterval?: NodeJS.Timer

	private _lastSequenceNr: number = 0

	private _monitorConnectionTimeout: NodeJS.Timer | null = null

	private _statusDisk: PeripheralDeviceAPI.StatusObject = {
		statusCode: PeripheralDeviceAPI.StatusCode.UNKNOWN
	}
	private _statusConnection: PeripheralDeviceAPI.StatusObject = {
		statusCode: PeripheralDeviceAPI.StatusCode.UNKNOWN
	}

	private _replication: PouchDB.Replication.Replication<{}>
	private _isDestroyed: boolean = false
	constructor (logger: LoggerInstance) {
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
		this._config.host = mediaScannerSettings.host || this._config.host
		this._config.port = mediaScannerSettings.port || this._config.port

		if (this._config.host !== 'disable') {

			this.logger.info('MediaScanner init')

			const baseUrl = 'http://' + this._config.host + ':' + this._config.port

			if (this._doReplication) {
				this._db = new PouchDB('local')
				this._remote = new PouchDB(`${baseUrl}/db/_media`)
				this._replication = this._remote.replicate.to(this._db, { live: true, retry: true })
			} else {
				this._db = new PouchDB(`${baseUrl}/db/_media`)
			}

			this._restartChangesStream()

			this._coreHandler.logger.info('MediaScanner: Start syncing media files')

			// Check disk usage now
			this._updateFsStats()
			this._checkFsStatsInterval = setInterval(() => {
				this._triggerupdateFsStats()
			}, 30 * 1000) // Run a check every 30 seconds

			return Promise.all([
				this._coreHandler.core.callMethodLowPrio(PeripheralDeviceAPI.methods.getMediaObjectRevisions, [
					this._config.collectionId
				]),
				this._db.allDocs({
					include_docs: true,
					attachments: true
				}),
				this._db.info()
			])
			.then(([coreObjects, allDocsResponse, dbInfo]) => {
				this._coreHandler.logger.info('MediaScanner: synk objectlists', coreObjects.length, allDocsResponse.total_rows)

				let tasks: Array<() => Promise<any>> = []

				let coreObjRevisions: {[id: string]: string} = {}
				_.each(coreObjects, (obj: any) => {
					coreObjRevisions[obj.id] = obj.rev
				})
				tasks = tasks.concat(_.compact(_.map(allDocsResponse.rows, (doc) => {
					const docId = this.hashId(doc.id)

					if (doc.value.deleted) {
						if (coreObjRevisions[docId]) {
							// deleted
						}
						return null // handled later
					} else if (
						!coreObjRevisions[docId] ||				// created
						coreObjRevisions[docId] !== doc.value.rev	// changed
					) {
						delete coreObjRevisions[docId]

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
						delete coreObjRevisions[docId]
						// identical
						return null
					}
				})))
				if (parseInt(dbInfo.update_seq + '', 10)) this._lastSequenceNr = parseInt(dbInfo.update_seq + '', 10)
				// The ones left in coreObjRevisions have not been touched, ie they should be deleted
				_.each(coreObjRevisions, (_rev, id) => {
					// deleted

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
		} else {

			this.logger.info('MediaScanner disabled')
		}
	}

	public destroy (): Promise<void> {
		this._isDestroyed = true
		if (this._checkFsStatsInterval) {
			clearInterval(this._checkFsStatsInterval)
			this._checkFsStatsInterval = undefined
		}
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
	public _triggerupdateFsStats (): void {
		if (!this._triggerupdateFsStatsTimeout) {
			this._triggerupdateFsStatsTimeout = setTimeout(() => {
				this._triggerupdateFsStatsTimeout = undefined
				this._updateFsStats()
			}, 5000)
		}
	}
	public _updateFsStats (): void {
		axios.get(`http://${this._config.host}:${this._config.port}/stat/fs`)
		.then(res => res.data)
		.then((disks: Array<DiskInfo>) => {
			// @todo: we temporarily report under playout-gateway, until we can handle multiple media-scanners
			let messages: Array<string> = []
			let status = PeripheralDeviceAPI.StatusCode.GOOD
			_.each(disks, (disk) => {

				let diskStatus = PeripheralDeviceAPI.StatusCode.GOOD
				if (disk.use) {
					if (disk.use > 75) {
						diskStatus = PeripheralDeviceAPI.StatusCode.WARNING_MAJOR
						messages.push(`Disk usage for ${disk.fs} is at ${disk.use}%, this may cause degraded performance.`)
					} else if (disk.use > 60) {
						diskStatus = PeripheralDeviceAPI.StatusCode.WARNING_MINOR
						messages.push(`Disk usage for ${disk.fs} is at ${disk.use}%, this may cause degraded performance.`)
					}
				}

				if (diskStatus > status) {
					status = diskStatus
				}
			})
			this._statusDisk.statusCode = status
			this._statusDisk.messages = messages
			this._updateStatus()
		})
		.catch((e) => {
			this.logger.warn('It appears as if media-scanner does not support disk usage stats.')
			if (
				!(
					(e + '').match(/ECONNREFUSED/i) ||
					(e + '').match(/ECONNRESET/i) ||
					(e + '').match(/ENOTFOUND/i)
				)
			) {
				this.logger.warn('Error in _updateFsStats', e.message || e.stack || e)
			}

			this._statusDisk.statusCode = PeripheralDeviceAPI.StatusCode.WARNING_MAJOR
			this._statusDisk.messages = [`Unable to fetch disk status from media-scanner`]
			this._updateStatus()
		})
	}
	private getChangesOptions () {
		return {
			since: this._lastSequenceNr || 'now',
			include_docs: true,
			live: true,
			attachments: true
		}
	}
	private _setConnectionStatus (connected) {
		let status = (
			connected ?
			PeripheralDeviceAPI.StatusCode.GOOD :
			PeripheralDeviceAPI.StatusCode.BAD
		)
		let messages = (
			connected ?
			[] :
			['MediaScanner not connected']
		)
		if (status !== this._statusConnection.statusCode) {
			this._statusConnection.statusCode = status
			this._statusConnection.messages = messages
			this._updateStatus()
		}
	}
	private _updateStatus () {

		let status: PeripheralDeviceAPI.StatusCode = PeripheralDeviceAPI.StatusCode.GOOD
		let messages: Array<string> = []
		_.each([
			this._statusConnection,
			this._statusDisk
		], (s) => {
			if (s.statusCode >= status) {
				if (s.messages) {
					messages = messages.concat(s.messages)
				}
				if (s.statusCode > status) {
					status = s.statusCode
				}
			}
		})

		if (
			this._coreHandler.mediaScannerStatus !== status ||
			!_.isEqual(this._coreHandler.mediaScannerMessages, messages)
		) {
			this._coreHandler.mediaScannerStatus = status
			this._coreHandler.mediaScannerMessages = messages
			this._coreHandler.updateCoreStatus()
			.catch(this.logger.error)
		}
	}
	private _sendChanged (doc: MediaObject): Promise<void> {
		// Added or changed

		let sendDoc = _.omit(doc, ['_attachments'])
		sendDoc.mediaId = doc._id
		// @ts-ignore
		// this._coreHandler.logger.info('MediaScanner: _sendChanged', JSON.stringify(sendDoc, ' ', 2))
		return this._coreHandler.core.callMethodLowPrio(PeripheralDeviceAPI.methods.updateMediaObject, [
			this._config.collectionId,
			this.hashId(doc._id),
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
		return this._coreHandler.core.callMethodLowPrio(PeripheralDeviceAPI.methods.updateMediaObject, [
			this._config.collectionId,
			this.hashId(docId),
			null
		])
		.then(() => {
			return
		})
		.catch((e) => {
			this._coreHandler.logger.error('MediaScanner: Error while updating deleted Media object', e)
		})
	}
	private hashId (id: string): string {
		return crypto.createHash('md5').update(id).digest('hex')
	}
	private _triggerMonitorConnection () {
		if (!this._monitorConnectionTimeout) {
			this._monitorConnectionTimeout = setTimeout(() => {
				this._monitorConnectionTimeout = null
				this._monitorConnection()
			}, 10 * 1000)
		}
	}
	private _monitorConnection () {
		if (this._isDestroyed) return

		if (this._statusConnection.statusCode === PeripheralDeviceAPI.StatusCode.BAD) {
			this._restartChangesStream(true)

			this._triggerMonitorConnection()
		}
	}
	private _restartChangesStream (rewindSequence?: boolean) {

		if (rewindSequence) {
			if (this._lastSequenceNr > 0) {
				this._lastSequenceNr--
			}
		}
		// restart the changes stream
		if (this._changes) {
			this._changes.cancel()
		}
		const opts = this.getChangesOptions()
		this.logger.info(`MediaScanner: Restarting changes stream (since ${opts.since})`)
		this._changes = this._db.changes<MediaObject>(opts)
			.on('change', changes => this._changeHandler(changes))
			.on('error', error => this._errorHandler(error))
	}
	private _changeHandler (changes: PouchDB.Core.ChangesResponseChange<MediaObject>) {
		const newSequenceNr: string | number = changes.seq
		if (_.isNumber(newSequenceNr)) this._lastSequenceNr = newSequenceNr
		else this.logger.warn(`Expected changes.seq to be number, got "${newSequenceNr}"`)

		if (changes.deleted) {
			if (!(changes.id + '').match(/watchdogIgnore/i)) { // Ignore watchdog file changes

				this.logger.debug('MediaScanner: deleteMediaObject', changes.id, newSequenceNr)
				this._sendRemoved(changes.id)
				.catch((e) => {
					this._coreHandler.logger.error('MediaScanner: Error sending deleted doc', e)
				})
			}
		} else if (changes.doc) {
			const md: MediaObject = changes.doc
			if (!(md._id + '').match(/watchdogIgnore/i)) { // Ignore watchdog file changes

				this.logger.debug('MediaScanner: updateMediaObject', newSequenceNr, md._id, md.mediaId)
				this._sendChanged(md)
				.catch((e) => {
					this._coreHandler.logger.error('MediaScanner: Error sending changed doc', e)
				})

				// const previewUrl = `${baseUrl}/media/preview/${md._id}`
				// Note: it only exists if there is a previewTime or previewSize set in the doc
			}
		}

		this._setConnectionStatus(true)

		this._triggerupdateFsStats()
	}
	private _errorHandler (err) {
		if (
			err.code === 'ECONNREFUSED' ||
			err.code === 'ECONNRESET'
		) {
			// TODO: try to reconnect
			this.logger.warn('MediaScanner: ' + err.code)
		} else if (err instanceof SyntaxError) {
			this.logger.warn('MediaScanner: Connection terminated (' + err.message + ')') // most likely
			// TODO: try to reconnect
		} else {
			this.logger.error('MediaScanner: Error', err)
		}

		this._setConnectionStatus(false)

		this._triggerMonitorConnection()
	}
}
