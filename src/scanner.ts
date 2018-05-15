import * as PouchDB from 'pouchdb-node'

export interface ScannerConfig {
}

export enum MediaStreamType {
	Audio = "audio",
	Video = "video",
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
	Unknown = "unknown",
	Progressive = "progressive",
	TFF = "tff",
	BFF = "bff",
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
export class ScannerHandler {
	private _config: ScannerConfig
	private _db: PouchDB.Database
	private _changes: PouchDB.Core.Changes<MediaObject>

	public init (config: ScannerConfig): Promise<any> {

		this._config = config
		console.log('========')

		const baseUrl = 'http://localhost:8000'

		this._db = new PouchDB(`${baseUrl}/db/_media`)

		const someDeviceId = 'dev1'

		// Get sequence id to start at
		// return core.call('getMySequenceNumber', someDeviceId, (sequenceNr) => {
		{
			const sequenceNr = 185

			// Listen for changes
			this._changes = this._db.changes<MediaObject>({
				since: sequenceNr,
				include_docs: true,
				live: true,
				attachments: true
			}).on('change', (changes) => {
				const newSequenceNr = changes.seq

				if (changes.deleted) {
					console.log('deleteMediaObject', someDeviceId, changes.id, newSequenceNr)
				} else if (changes.doc) {
					const md: MediaObject = changes.doc
					console.log('updateMediaObject', someDeviceId, md, newSequenceNr)

					// const previewUrl = `${baseUrl}/media/preview/${md._id}`
					// Note: it only exists if there is a previewTime or previewSize set in the doc
				}
			}).on('error', (err) => {
				if (err.code == "ECONNREFUSED"){
					// TODO
					console.log("Connection refused")
				} else if (err instanceof SyntaxError) {
					console.log("Connection terminated") // most likely
				} else {
					console.log("Error", err)
				}

				this._changes.cancel()
				// TODO - restart the changes stream
			})
		}
		// })
		return Promise.resolve()
		.then(() => {
			console.log('scanner init done')
		})
	}
	destroy (): Promise<void> {
		if (this._changes) {
			this._changes.cancel()
		}

		return this._db.close()
	}
}
