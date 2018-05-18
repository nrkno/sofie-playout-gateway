
# Playout-gateway
An application for piping data between Core (in the Sofie-project) and playout devices (such as CasparCG, Atem, Lawo etc..)

## Usage
```
// Development:
npm run start -host 127.0.0.1 -port 3000 -log "log.log"
// Production:
npm run start
```

**CLI arguments:**

| Argument  | Description | Environment variable |
| ------------- | ------------- | --- |
| -host  | Hostname or IP of Core  | CORE_HOST  |
| -port  | Port of Core   |  CORE_PORT |
| -log  | Path to output log |  CORE_LOG |

## Installation for dev

yarn

yarn build

yarn test


### Dev dependencies:

* yarn
	https://yarnpkg.com
	This is like npm, but better

* jest
	yarn global add jest
	This is our resting framework