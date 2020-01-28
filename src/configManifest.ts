import { DeviceConfigManifest, ConfigManifestEntryType, SubDeviceConfigManifest, SubDeviceConfigManifestEntry } from 'tv-automation-server-core-integration'
import { DeviceType, AtemMediaPoolType } from 'timeline-state-resolver'

export enum TimelineContentTypeHttp {
	GET = 'get',
	POST = 'post',
	PUT = 'put',
	DELETE = 'delete'
}
export enum TSRDeviceType {
	ABSTRACT = 'abstract',
	CASPARCG = 'casparcg',
	ATEM = 'atem',
	LAWO = 'lawo',
	HTTPSEND = 'httpsend',
	PANASONIC_PTZ = 'panasonic_ptz',
	TCPSEND = 'tcpsend',
	HYPERDECK = 'hyperdeck',
	PHAROS = 'pharos',
	OSC = 'osc',
	HTTPWATCHER = 'httpwatcher',
	SISYFOS = 'sisyfos',
	QUANTEL = 'quantel'
}
export const TSRDeviceTypeValue = {
	[TSRDeviceType.ABSTRACT]: 0,
	[TSRDeviceType.CASPARCG]: 1,
	[TSRDeviceType.ATEM]: 2,
	[TSRDeviceType.LAWO]: 3,
	[TSRDeviceType.HTTPSEND]: 4,
	[TSRDeviceType.PANASONIC_PTZ]: 5,
	[TSRDeviceType.TCPSEND]: 6,
	[TSRDeviceType.HYPERDECK]: 7,
	[TSRDeviceType.PHAROS]: 8,
	[TSRDeviceType.OSC]: 9,
	[TSRDeviceType.HTTPWATCHER]: 10,
	[TSRDeviceType.SISYFOS]: 11,
	[TSRDeviceType.QUANTEL]: 12
}

const PLAYOUT_SUBDEVICE_COMMON: SubDeviceConfigManifestEntry[] = [
	{
		id: 'disable',
		name: 'Disable',
		type: ConfigManifestEntryType.BOOLEAN
	},
	{
		id: 'threadUsage',
		name: 'Thread Usage',
		type: ConfigManifestEntryType.FLOAT
	}
]
const PLAYOUT_SUBDEVICE_HOST_PORT = [
	{
		id: 'options.host',
		name: 'Host',
		type: ConfigManifestEntryType.STRING
	},
	{
		id: 'options.port',
		name: 'Port',
		type: ConfigManifestEntryType.INT
	}
]
const PLAYOUT_SUBDEVICE_CONFIG: SubDeviceConfigManifest['config'] = {
	[TSRDeviceType.ABSTRACT]: [
		...PLAYOUT_SUBDEVICE_COMMON
	],
	[TSRDeviceType.CASPARCG]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		...PLAYOUT_SUBDEVICE_HOST_PORT,
		{
			id: 'options.launcherHost',
			name: 'Launcher Host',
			type: ConfigManifestEntryType.STRING
		},
		{
			id: 'options.launcherPort',
			name: 'Launcher Port',
			type: ConfigManifestEntryType.NUMBER
		}
	],
	[TSRDeviceType.ATEM]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		...PLAYOUT_SUBDEVICE_HOST_PORT,
		{
			id: 'options.mediaPoolAssets',
			name: 'Media Pool Assets',
			type: ConfigManifestEntryType.TABLE,
			defaultType: 'default',
			config: {
				'default': [
					{
						id: 'path',
						name: 'Path',
						columnName: 'File Path',
						type: ConfigManifestEntryType.STRING
					},
					{
						id: 'type',
						name: 'Type',
						columnName: 'Type',
						defaultVal: AtemMediaPoolType.Still,
						type: ConfigManifestEntryType.ENUM,
						values: AtemMediaPoolType
					},
					{
						id: 'position',
						name: 'Position',
						type: ConfigManifestEntryType.INT
					}
				]
			}
		}
	],
	[TSRDeviceType.LAWO]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		...PLAYOUT_SUBDEVICE_HOST_PORT,
		{
			id: 'options.sourcesPath',
			name: 'Sources Path',
			type: ConfigManifestEntryType.STRING
		},
		{
			id: 'options.rampMotorFunctionPath',
			name: 'Ramp Function Path',
			type: ConfigManifestEntryType.STRING
		}
	],
	[TSRDeviceType.HTTPSEND]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		{
			id: 'options.makeReadyCommands',
			name: 'Make Ready Commands',
			type: ConfigManifestEntryType.TABLE,
			defaultType: 'default',
			config: {
				'default': [
					{
						id: 'url',
						name: 'URL',
						columnName: 'URL',
						type: ConfigManifestEntryType.STRING
					},
					{
						id: 'type',
						name: 'Type',
						columnName: 'Type',
						defaultVal: TimelineContentTypeHttp.GET,
						type: ConfigManifestEntryType.ENUM,
						values: TimelineContentTypeHttp
					},
					{
						id: 'params',
						name: 'Parameters',
						type: ConfigManifestEntryType.OBJECT
					}
				]
			}
		}
	],
	[TSRDeviceType.PANASONIC_PTZ]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		...PLAYOUT_SUBDEVICE_HOST_PORT
	],
	[TSRDeviceType.TCPSEND]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		...PLAYOUT_SUBDEVICE_HOST_PORT,
		{
			id: 'options.bufferEncoding',
			name: 'Buffer Encoding',
			type: ConfigManifestEntryType.STRING
		}
	],
	[TSRDeviceType.HYPERDECK]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		...PLAYOUT_SUBDEVICE_HOST_PORT,
		{
			id: 'options.minRecordingTime',
			name: 'Minimum recording time',
			type: ConfigManifestEntryType.NUMBER
		}
	],
	[TSRDeviceType.PHAROS]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		PLAYOUT_SUBDEVICE_HOST_PORT[0], // Host only
		{
			id: 'options.spart',
			name: 'Enable SSL',
			type: ConfigManifestEntryType.BOOLEAN
		}
	],
	[TSRDeviceType.OSC]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		...PLAYOUT_SUBDEVICE_HOST_PORT
	],
	[TSRDeviceType.HTTPWATCHER]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		{
			id: 'options.uri',
			name: 'URI',
			type: ConfigManifestEntryType.STRING
		},
		{
			id: 'options.httpMethod',
			name: 'HTTPMethod',
			type: ConfigManifestEntryType.STRING
		},
		{
			id: 'options.expectedHttpResponse',
			name: 'Expected HTTP Response',
			type: ConfigManifestEntryType.NUMBER
		},
		{
			id: 'options.keyword',
			name: 'Keyword',
			type: ConfigManifestEntryType.STRING
		},
		{
			id: 'options.interval',
			name: 'Interval',
			type: ConfigManifestEntryType.NUMBER
		}
	],
	[TSRDeviceType.SISYFOS]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		...PLAYOUT_SUBDEVICE_HOST_PORT
	],
	[TSRDeviceType.QUANTEL]: [
		...PLAYOUT_SUBDEVICE_COMMON,
		{
			id: 'options.gatewayUrl',
			name: 'Gateway URL',
			type: ConfigManifestEntryType.STRING
		},
		{
			id: 'options.ISAUrl',
			name: 'ISA URL',
			type: ConfigManifestEntryType.STRING
		},
		{
			id: 'options.zoneId',
			name: 'Zone ID',
			type: ConfigManifestEntryType.STRING
		},
		{
			id: 'options.serverId',
			name: 'Quantel Server ID',
			type: ConfigManifestEntryType.NUMBER
		}
	]
}

export const PLAYOUT_DEVICE_CONFIG: DeviceConfigManifest = {
	deviceConfig: [
		{
			id: 'mediaScanner.host',
			name: 'Media Scanner Host',
			type: ConfigManifestEntryType.STRING

		},
		{
			id: 'mediaScanner.port',
			name: 'Media Scanner Port',
			type: ConfigManifestEntryType.NUMBER

		},
		{
			id: 'debugLogging',
			name: 'Activate Debug Logging',
			type: ConfigManifestEntryType.BOOLEAN
		},
		{
			id: 'multiThreading',
			name: 'Activate Multi-Threading',
			type: ConfigManifestEntryType.BOOLEAN
		},
		{
			id: 'multiThreadedResolver',
			name: 'Activate Multi-Threaded Timeline Resolving',
			type: ConfigManifestEntryType.BOOLEAN
		},
		{
			id: 'reportAllCommands',
			name: 'Report command timings on all commands',
			type: ConfigManifestEntryType.BOOLEAN
		},
		{
			id: 'devices',
			name: 'Sub Devices',
			type: ConfigManifestEntryType.TABLE,
			defaultType: TSRDeviceType.ABSTRACT,
			isSubDevices: true,
			deviceTypesMapping: {
				[TSRDeviceType.ABSTRACT]: TSRDeviceType.ABSTRACT,
				[TSRDeviceType.CASPARCG]: TSRDeviceType.CASPARCG,
				[TSRDeviceType.ATEM]: TSRDeviceType.ATEM,
				[TSRDeviceType.LAWO]: TSRDeviceType.LAWO,
				[TSRDeviceType.HTTPSEND]: TSRDeviceType.HTTPSEND,
				[TSRDeviceType.PANASONIC_PTZ]: TSRDeviceType.PANASONIC_PTZ,
				[TSRDeviceType.TCPSEND]: TSRDeviceType.TCPSEND,
				[TSRDeviceType.HYPERDECK]: TSRDeviceType.HYPERDECK,
				[TSRDeviceType.PHAROS]: TSRDeviceType.PHAROS,
				[TSRDeviceType.OSC]: TSRDeviceType.OSC,
				[TSRDeviceType.HTTPWATCHER]: TSRDeviceType.HTTPWATCHER,
				[TSRDeviceType.SISYFOS]: TSRDeviceType.SISYFOS,
				[TSRDeviceType.QUANTEL]: TSRDeviceType.QUANTEL,

				[TSRDeviceType.ABSTRACT]: TSRDeviceType.ABSTRACT,
				[TSRDeviceType.CASPARCG]: TSRDeviceType.CASPARCG,
				[TSRDeviceType.ATEM]: TSRDeviceType.ATEM,
				[TSRDeviceType.LAWO]: TSRDeviceType.LAWO,
				[TSRDeviceType.HTTPSEND]: TSRDeviceType.HTTPSEND,
				[TSRDeviceType.PANASONIC_PTZ]: TSRDeviceType.PANASONIC_PTZ,
				[TSRDeviceType.TCPSEND]: TSRDeviceType.TCPSEND,
				[TSRDeviceType.HYPERDECK]: TSRDeviceType.HYPERDECK,
				[TSRDeviceType.PHAROS]: TSRDeviceType.PHAROS,
				[TSRDeviceType.OSC]: TSRDeviceType.OSC,
				[TSRDeviceType.HTTPWATCHER]: TSRDeviceType.HTTPWATCHER,
				[TSRDeviceType.SISYFOS]: TSRDeviceType.SISYFOS,
				[TSRDeviceType.QUANTEL]: TSRDeviceType.QUANTEL
			},
			config: PLAYOUT_SUBDEVICE_CONFIG
		}
	]
}
