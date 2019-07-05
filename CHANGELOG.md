# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.20.0-1"></a>
# 0.20.0-1 (2019-07-05)


### Bug Fixes

* (troubleshooting) reenabling mediaScanner, but with replication disabled ([752f86c](https://github.com/nrkno/tv-automation-playout-gateway/commit/752f86c))
* add localTimestamp to logger output ([8ae2c01](https://github.com/nrkno/tv-automation-playout-gateway/commit/8ae2c01))
* add proActiveResolve option for TSR ([9c7ac66](https://github.com/nrkno/tv-automation-playout-gateway/commit/9c7ac66))
* added missing core onError handler ([d5b0f01](https://github.com/nrkno/tv-automation-playout-gateway/commit/d5b0f01))
* added option to fully disable statObj ([c9794bb](https://github.com/nrkno/tv-automation-playout-gateway/commit/c9794bb))
* added tracing of timeline ([b7b8120](https://github.com/nrkno/tv-automation-playout-gateway/commit/b7b8120))
* adjust debug levels ([897c57e](https://github.com/nrkno/tv-automation-playout-gateway/commit/897c57e))
* also save the original media id ([c0f6c0b](https://github.com/nrkno/tv-automation-playout-gateway/commit/c0f6c0b))
* also save the original media id ([9939db4](https://github.com/nrkno/tv-automation-playout-gateway/commit/9939db4))
* atemUpload: bugfix: didn't upload on init ([76b3802](https://github.com/nrkno/tv-automation-playout-gateway/commit/76b3802))
* atemUpload: handle errors & typo ([01bc8da](https://github.com/nrkno/tv-automation-playout-gateway/commit/01bc8da))
* better faster stronger timeline transform ([0612f96](https://github.com/nrkno/tv-automation-playout-gateway/commit/0612f96))
* bugfix: all mediaObjects are deleted upon startup ([e0624b0](https://github.com/nrkno/tv-automation-playout-gateway/commit/e0624b0))
* bugfix: all mediaObjects are deleted upon startup ([9f02191](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f02191))
* build ([20871c0](https://github.com/nrkno/tv-automation-playout-gateway/commit/20871c0))
* build-script: yarn.lock file should not be removed and if updates are needed, that shoud fail the build process. ([d83584d](https://github.com/nrkno/tv-automation-playout-gateway/commit/d83584d))
* bump package version ([92d61e6](https://github.com/nrkno/tv-automation-playout-gateway/commit/92d61e6))
* bump tsr version ([3fb51c1](https://github.com/nrkno/tv-automation-playout-gateway/commit/3fb51c1))
* bump tsr version ([3df738d](https://github.com/nrkno/tv-automation-playout-gateway/commit/3df738d))
* CasparCG LOADBG and PLAY command 404 errors are handled as warnings not errors ([54ceebb](https://github.com/nrkno/tv-automation-playout-gateway/commit/54ceebb))
* catch disk usage http errors ([635db9c](https://github.com/nrkno/tv-automation-playout-gateway/commit/635db9c))
* catch promises ([22db4bc](https://github.com/nrkno/tv-automation-playout-gateway/commit/22db4bc))
* changed callMethod to callMethodLowPrio, to avoid throttling Core ([684e271](https://github.com/nrkno/tv-automation-playout-gateway/commit/684e271))
* changed statobj id ([1920020](https://github.com/nrkno/tv-automation-playout-gateway/commit/1920020))
* clearing observers properly ([0679f66](https://github.com/nrkno/tv-automation-playout-gateway/commit/0679f66))
* crash when missing mediascanner setting ([76fbf1c](https://github.com/nrkno/tv-automation-playout-gateway/commit/76fbf1c))
* drop empty certificates ([8aa133c](https://github.com/nrkno/tv-automation-playout-gateway/commit/8aa133c))
* error logging ([76f3749](https://github.com/nrkno/tv-automation-playout-gateway/commit/76f3749))
* fix old collection names, etc. ([4859564](https://github.com/nrkno/tv-automation-playout-gateway/commit/4859564))
* handle promises appropriately ([d06635c](https://github.com/nrkno/tv-automation-playout-gateway/commit/d06635c))
* handle tsr asynchronousicity properly ([9db981c](https://github.com/nrkno/tv-automation-playout-gateway/commit/9db981c))
* ignore watchdog file changes ([b238e44](https://github.com/nrkno/tv-automation-playout-gateway/commit/b238e44))
* import underscore ([cfe6516](https://github.com/nrkno/tv-automation-playout-gateway/commit/cfe6516))
* lint & build ([8824435](https://github.com/nrkno/tv-automation-playout-gateway/commit/8824435))
* log error better ([b02c92b](https://github.com/nrkno/tv-automation-playout-gateway/commit/b02c92b))
* logging ([e3cb0d8](https://github.com/nrkno/tv-automation-playout-gateway/commit/e3cb0d8))
* media info missing mediaId property ([981f788](https://github.com/nrkno/tv-automation-playout-gateway/commit/981f788))
* media info missing mediaId property ([fb7f390](https://github.com/nrkno/tv-automation-playout-gateway/commit/fb7f390))
* media scanner lastRev + hashed id ([a6276b7](https://github.com/nrkno/tv-automation-playout-gateway/commit/a6276b7))
* media-scanner linting ([f7480cf](https://github.com/nrkno/tv-automation-playout-gateway/commit/f7480cf))
* media-scanner status ([1370703](https://github.com/nrkno/tv-automation-playout-gateway/commit/1370703))
* media-scanner status reporting ([b80c0a5](https://github.com/nrkno/tv-automation-playout-gateway/commit/b80c0a5))
* media-scanner status, message ordering & prioritys ([332c92e](https://github.com/nrkno/tv-automation-playout-gateway/commit/332c92e))
* mediascanner error traces & be able to disable by setting host to "disable" ([9734662](https://github.com/nrkno/tv-automation-playout-gateway/commit/9734662))
* Mediascanner reconnection bugs ([d72e3d1](https://github.com/nrkno/tv-automation-playout-gateway/commit/d72e3d1))
* multi threading is a runtime config from core ([233f20e](https://github.com/nrkno/tv-automation-playout-gateway/commit/233f20e))
* persist media through a restart ([3558c8a](https://github.com/nrkno/tv-automation-playout-gateway/commit/3558c8a))
* persist media through a restart ([627bd94](https://github.com/nrkno/tv-automation-playout-gateway/commit/627bd94))
* pleasing linter. One logical change. ([cb2449a](https://github.com/nrkno/tv-automation-playout-gateway/commit/cb2449a))
* postbump script ([7e603ad](https://github.com/nrkno/tv-automation-playout-gateway/commit/7e603ad))
* potential fix for reconnect issue ([81cbd1d](https://github.com/nrkno/tv-automation-playout-gateway/commit/81cbd1d))
* re-implement supression of 404 casparcg commands ([d57e03d](https://github.com/nrkno/tv-automation-playout-gateway/commit/d57e03d))
* remove unused methods ([1711b9d](https://github.com/nrkno/tv-automation-playout-gateway/commit/1711b9d))
* removed console.log ([05fdf46](https://github.com/nrkno/tv-automation-playout-gateway/commit/05fdf46))
* removed console.log ([2be9ff8](https://github.com/nrkno/tv-automation-playout-gateway/commit/2be9ff8))
* Removed Launcher dependency (moving the functionality into TSR) ([45088b4](https://github.com/nrkno/tv-automation-playout-gateway/commit/45088b4))
* resync when reconnecting ([1f7dab1](https://github.com/nrkno/tv-automation-playout-gateway/commit/1f7dab1))
* revert pouchdb dep version to last version known to work (7.0.0 is no good) ([49567b8](https://github.com/nrkno/tv-automation-playout-gateway/commit/49567b8))
* revert versionTime script ([0ba83c2](https://github.com/nrkno/tv-automation-playout-gateway/commit/0ba83c2))
* revert: remove baltes debug file ([7e37598](https://github.com/nrkno/tv-automation-playout-gateway/commit/7e37598))
* set correct atem media player for second still ([c2b4cca](https://github.com/nrkno/tv-automation-playout-gateway/commit/c2b4cca))
* Some playout bugs ([57c3fde](https://github.com/nrkno/tv-automation-playout-gateway/commit/57c3fde))
* subscribe to timeline in current studio ([4132a68](https://github.com/nrkno/tv-automation-playout-gateway/commit/4132a68))
* supress some mediaScanner errors ([0c3468a](https://github.com/nrkno/tv-automation-playout-gateway/commit/0c3468a))
* temporary fix to log debug-messages ([40e0921](https://github.com/nrkno/tv-automation-playout-gateway/commit/40e0921))
* temporary fix to log debug-messages ([c46f513](https://github.com/nrkno/tv-automation-playout-gateway/commit/c46f513))
* temporary test: added random id to all log outputs, to verify if logs are logged twice ([e72cbc1](https://github.com/nrkno/tv-automation-playout-gateway/commit/e72cbc1))
* temporary test: added random id to all log outputs, to verify if logs are logged twice ([f7deb7a](https://github.com/nrkno/tv-automation-playout-gateway/commit/f7deb7a))
* timelineCallback error handling ([3c5e494](https://github.com/nrkno/tv-automation-playout-gateway/commit/3c5e494))
* try to better output errors ([e4c2d3e](https://github.com/nrkno/tv-automation-playout-gateway/commit/e4c2d3e))
* tsr dep ([18eda01](https://github.com/nrkno/tv-automation-playout-gateway/commit/18eda01))
* tsr dep ([4f0dd2b](https://github.com/nrkno/tv-automation-playout-gateway/commit/4f0dd2b))
* tsr-dep, fixing a memory leak ([62d7843](https://github.com/nrkno/tv-automation-playout-gateway/commit/62d7843))
* TSR-dep: hotfix, debuglogging ([b605f66](https://github.com/nrkno/tv-automation-playout-gateway/commit/b605f66))
* tsr: timeline bugfix & callback fix ([0a1a43b](https://github.com/nrkno/tv-automation-playout-gateway/commit/0a1a43b))
* tsrHandler: dont run functions before init() ([b1ff246](https://github.com/nrkno/tv-automation-playout-gateway/commit/b1ff246))
* upd TSR dependency ([691b64d](https://github.com/nrkno/tv-automation-playout-gateway/commit/691b64d))
* upd TSR dependency ([176d6bf](https://github.com/nrkno/tv-automation-playout-gateway/commit/176d6bf))
* update atem-connection dependency, to fix 100% cpu usage issue ([4ebd370](https://github.com/nrkno/tv-automation-playout-gateway/commit/4ebd370))
* update core-integration dep (clean up old sockets) ([80bd1ad](https://github.com/nrkno/tv-automation-playout-gateway/commit/80bd1ad))
* update core-integration dep (clean up old sockets) ([7120337](https://github.com/nrkno/tv-automation-playout-gateway/commit/7120337))
* update core-integration dependency ([66383b1](https://github.com/nrkno/tv-automation-playout-gateway/commit/66383b1))
* update dependencies ([3550afd](https://github.com/nrkno/tv-automation-playout-gateway/commit/3550afd))
* update disk usage limits ([e646543](https://github.com/nrkno/tv-automation-playout-gateway/commit/e646543))
* update libs to fix atem supersource boxes ([dba8948](https://github.com/nrkno/tv-automation-playout-gateway/commit/dba8948))
* update lint & fix lint errors ([bfa94ba](https://github.com/nrkno/tv-automation-playout-gateway/commit/bfa94ba))
* update media-scanner Diskinfo typings & warning message ([de624bd](https://github.com/nrkno/tv-automation-playout-gateway/commit/de624bd))
* update namig to new set ([f787cc8](https://github.com/nrkno/tv-automation-playout-gateway/commit/f787cc8))
* update server-core-integration ([945c295](https://github.com/nrkno/tv-automation-playout-gateway/commit/945c295))
* update tsr ([1e0867a](https://github.com/nrkno/tv-automation-playout-gateway/commit/1e0867a))
* Update tsr and supertimeline ([0d76c2c](https://github.com/nrkno/tv-automation-playout-gateway/commit/0d76c2c))
* update TSR dep ([5cda708](https://github.com/nrkno/tv-automation-playout-gateway/commit/5cda708))
* update TSR dep ([943b270](https://github.com/nrkno/tv-automation-playout-gateway/commit/943b270))
* Update TSR dep ([975347b](https://github.com/nrkno/tv-automation-playout-gateway/commit/975347b))
* update typings for multithreaded tsr ([638da97](https://github.com/nrkno/tv-automation-playout-gateway/commit/638da97))
* updated dependencies ([97f1852](https://github.com/nrkno/tv-automation-playout-gateway/commit/97f1852))
* updated tsr & core-integration dependency ([7cc9386](https://github.com/nrkno/tv-automation-playout-gateway/commit/7cc9386))
* updated tsr & core-integration dependency ([0b04237](https://github.com/nrkno/tv-automation-playout-gateway/commit/0b04237))
* updated TSR dep (bugfixes in timeline) ([72f0369](https://github.com/nrkno/tv-automation-playout-gateway/commit/72f0369))
* updated tsr dependency ([43a7069](https://github.com/nrkno/tv-automation-playout-gateway/commit/43a7069))
* updated tsr dependency ([89c38b9](https://github.com/nrkno/tv-automation-playout-gateway/commit/89c38b9))
* use axios instead of native http ([d81e5e7](https://github.com/nrkno/tv-automation-playout-gateway/commit/d81e5e7))
* versions of non-parent processes ([0d08e9e](https://github.com/nrkno/tv-automation-playout-gateway/commit/0d08e9e))
* Winston logging typing (disabled .warning) ([97c7384](https://github.com/nrkno/tv-automation-playout-gateway/commit/97c7384))
* **logging:** More reasonable logging of the statObj evaluation ([422cd4f](https://github.com/nrkno/tv-automation-playout-gateway/commit/422cd4f))
* **media scanner:** catch http request errors ([9628e4a](https://github.com/nrkno/tv-automation-playout-gateway/commit/9628e4a))
* **media scanner:** safe document id ([9f41872](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f41872))
* **media-scanner:** reworked connection logic, adding better reconnection logic & status monitoring ([2f05586](https://github.com/nrkno/tv-automation-playout-gateway/commit/2f05586))
* **media-scanner:** reworked connection logic, adding better reconnection logic & status monitoring ([0cead6e](https://github.com/nrkno/tv-automation-playout-gateway/commit/0cead6e))
* **mediaScanner:** error trying to log warning when disk-usage not supported ([66e4324](https://github.com/nrkno/tv-automation-playout-gateway/commit/66e4324))
* **mediaScanner:** error trying to log warning when disk-usage not supported ([3d6bd22](https://github.com/nrkno/tv-automation-playout-gateway/commit/3d6bd22))
* **peripheralDevices:** creates more user-friendly names of devices and sub devices. Seen in combination with ongoing work in core and mos-gw to clean up the user interface. ([6b9efaa](https://github.com/nrkno/tv-automation-playout-gateway/commit/6b9efaa))


### Features

* add callbackStopped ([222a46e](https://github.com/nrkno/tv-automation-playout-gateway/commit/222a46e))
* add CLI option "-certificates", to use for self-signed certificates ([0064d7d](https://github.com/nrkno/tv-automation-playout-gateway/commit/0064d7d))
* add config for multi threading ([203c823](https://github.com/nrkno/tv-automation-playout-gateway/commit/203c823))
* Add segmentLineItemPlaybackStarted callback ([91c99e0](https://github.com/nrkno/tv-automation-playout-gateway/commit/91c99e0))
* addded versions to init data ([6641bf1](https://github.com/nrkno/tv-automation-playout-gateway/commit/6641bf1))
* added -disableWatchdog option ([4ce8ae1](https://github.com/nrkno/tv-automation-playout-gateway/commit/4ce8ae1))
* added statObj support, an attempt to avoid playing incomplete timelines ([cf48e16](https://github.com/nrkno/tv-automation-playout-gateway/commit/cf48e16))
* added watchDog ([3f55c7b](https://github.com/nrkno/tv-automation-playout-gateway/commit/3f55c7b))
* adding CoreTSRDeviceHandler: unifying with mos-connection, the CoreTSRDeviceHandler manages the subscriptions for sub-devices ([9f49951](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f49951))
* casparcg restart routine ([415387d](https://github.com/nrkno/tv-automation-playout-gateway/commit/415387d))
* CLI argument: "-unsafeSSL" ([757bf13](https://github.com/nrkno/tv-automation-playout-gateway/commit/757bf13))
* configurable media scanner host / port ([d142996](https://github.com/nrkno/tv-automation-playout-gateway/commit/d142996))
* implement support for slowCommands reporting ([c15f240](https://github.com/nrkno/tv-automation-playout-gateway/commit/c15f240))
* kill process when initialization fails ([bca0b51](https://github.com/nrkno/tv-automation-playout-gateway/commit/bca0b51))
* listen to setting debugLogging, to turn on/off debug logging. Also support of new TSR logging emitters. ([25b0a9e](https://github.com/nrkno/tv-automation-playout-gateway/commit/25b0a9e))
* log message on startup ([dbfde0c](https://github.com/nrkno/tv-automation-playout-gateway/commit/dbfde0c))
* log successful commands ([86f6f8a](https://github.com/nrkno/tv-automation-playout-gateway/commit/86f6f8a))
* media-scanner add example for loading the whole database ([422563b](https://github.com/nrkno/tv-automation-playout-gateway/commit/422563b))
* Prototype media-scanner connection and typings ([59a9927](https://github.com/nrkno/tv-automation-playout-gateway/commit/59a9927))
* **atemUpload:** multiple files ([ca0ce62](https://github.com/nrkno/tv-automation-playout-gateway/commit/ca0ce62))
* **atemUpload:** multiple files ([1efa683](https://github.com/nrkno/tv-automation-playout-gateway/commit/1efa683))
* script + function to upload a still to the atem ([18446f5](https://github.com/nrkno/tv-automation-playout-gateway/commit/18446f5))
* **disk-usage:** limit rate of disk usage check, and do it at an interval ([f5db8fb](https://github.com/nrkno/tv-automation-playout-gateway/commit/f5db8fb))
* Receive full timeline, not just portion for local devices ([388e310](https://github.com/nrkno/tv-automation-playout-gateway/commit/388e310))
* refactored getting of timeline, added getSnapshot, for debugging ([6df71de](https://github.com/nrkno/tv-automation-playout-gateway/commit/6df71de))
* removed callbacks, as they are created in Core now ([13b3cf1](https://github.com/nrkno/tv-automation-playout-gateway/commit/13b3cf1))
* report disk usage from media-scanner to core ([886548f](https://github.com/nrkno/tv-automation-playout-gateway/commit/886548f))
* script + function to upload a still to the atem ([e39762a](https://github.com/nrkno/tv-automation-playout-gateway/commit/e39762a))
* support for multi-threaded resolver ([c814ef3](https://github.com/nrkno/tv-automation-playout-gateway/commit/c814ef3))
* support for new device types ([54c3046](https://github.com/nrkno/tv-automation-playout-gateway/commit/54c3046))
* support new TSR interface ([3383dde](https://github.com/nrkno/tv-automation-playout-gateway/commit/3383dde))
* take mediascanner host + port from core, replicate pouchdb ([e5fa674](https://github.com/nrkno/tv-automation-playout-gateway/commit/e5fa674))
* timeline typings from Core & support for new timeline.id ([7a9f5a0](https://github.com/nrkno/tv-automation-playout-gateway/commit/7a9f5a0))
* tsr dependency: using internal command-queue instead of scheduler ([da95b46](https://github.com/nrkno/tv-automation-playout-gateway/commit/da95b46))
* tsr dependency: using internal command-queue instead of scheduler ([32dc692](https://github.com/nrkno/tv-automation-playout-gateway/commit/32dc692))
* upd tsr dep ([2596dba](https://github.com/nrkno/tv-automation-playout-gateway/commit/2596dba))
* upd TSR-dependency, featuring multi-threading ([e1f5ebc](https://github.com/nrkno/tv-automation-playout-gateway/commit/e1f5ebc))
* update atem-connection dep, fixing media upload ([d675cb9](https://github.com/nrkno/tv-automation-playout-gateway/commit/d675cb9))
* update core-integration dep ([6426afc](https://github.com/nrkno/tv-automation-playout-gateway/commit/6426afc))
* update core-integration dependency ([218f4cb](https://github.com/nrkno/tv-automation-playout-gateway/commit/218f4cb))
* update dependencies ([967a356](https://github.com/nrkno/tv-automation-playout-gateway/commit/967a356))
* update dependencies ([e1cc767](https://github.com/nrkno/tv-automation-playout-gateway/commit/e1cc767))
* update timeline dep ([bcc34f7](https://github.com/nrkno/tv-automation-playout-gateway/commit/bcc34f7))
* update TSR dep ([09c2fa9](https://github.com/nrkno/tv-automation-playout-gateway/commit/09c2fa9))
* update TSR dep, add Pharos device ([9f52ee3](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f52ee3))
* update TSR dep: restart casparcg using launcher-http endpoint ([b0fdca6](https://github.com/nrkno/tv-automation-playout-gateway/commit/b0fdca6))
* update TSR dependency: adding support for Hyperdeck ([de25c5f](https://github.com/nrkno/tv-automation-playout-gateway/commit/de25c5f))
* updated core-integration dep, introducing autoSubscribe ([4589eee](https://github.com/nrkno/tv-automation-playout-gateway/commit/4589eee))
* updated TSR dep (containing the big timeline refactoring) ([74ef284](https://github.com/nrkno/tv-automation-playout-gateway/commit/74ef284))
* updated tsr dependency ([be0e7dc](https://github.com/nrkno/tv-automation-playout-gateway/commit/be0e7dc))
* updated tsr dependency ([0820f05](https://github.com/nrkno/tv-automation-playout-gateway/commit/0820f05))
* updated TSR dependency (implementing lawo) ([fa79697](https://github.com/nrkno/tv-automation-playout-gateway/commit/fa79697))
* updated TSR-device-status handling ([11af163](https://github.com/nrkno/tv-automation-playout-gateway/commit/11af163))
* versionTime ([c7b478b](https://github.com/nrkno/tv-automation-playout-gateway/commit/c7b478b))
* **media scanner:** basic reconnection logic without replication ([d3ccd86](https://github.com/nrkno/tv-automation-playout-gateway/commit/d3ccd86))



<a name="0.19.1-0"></a>
## [0.19.1-0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.19.0...v0.19.1-0) (2019-05-22)


### Bug Fixes

* Update TSR dep ([975347b](https://github.com/nrkno/tv-automation-playout-gateway/commit/975347b))

# [0.19.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.19.0-1...v0.19.0) (2019-05-15)

<a name="0.19.0-1"></a>
# 0.19.0-1 (2019-05-15)


### Bug Fixes

* (troubleshooting) reenabling mediaScanner, but with replication disabled ([752f86c](https://github.com/nrkno/tv-automation-playout-gateway/commit/752f86c))
* add localTimestamp to logger output ([8ae2c01](https://github.com/nrkno/tv-automation-playout-gateway/commit/8ae2c01))
* add proActiveResolve option for TSR ([9c7ac66](https://github.com/nrkno/tv-automation-playout-gateway/commit/9c7ac66))
* added missing core onError handler ([d5b0f01](https://github.com/nrkno/tv-automation-playout-gateway/commit/d5b0f01))
* added option to fully disable statObj ([c9794bb](https://github.com/nrkno/tv-automation-playout-gateway/commit/c9794bb))
* added tracing of timeline ([b7b8120](https://github.com/nrkno/tv-automation-playout-gateway/commit/b7b8120))
* adjust debug levels ([897c57e](https://github.com/nrkno/tv-automation-playout-gateway/commit/897c57e))
* also save the original media id ([9939db4](https://github.com/nrkno/tv-automation-playout-gateway/commit/9939db4))
* also save the original media id ([c0f6c0b](https://github.com/nrkno/tv-automation-playout-gateway/commit/c0f6c0b))
* atemUpload: bugfix: didn't upload on init ([76b3802](https://github.com/nrkno/tv-automation-playout-gateway/commit/76b3802))
* atemUpload: handle errors & typo ([01bc8da](https://github.com/nrkno/tv-automation-playout-gateway/commit/01bc8da))
* better faster stronger timeline transform ([0612f96](https://github.com/nrkno/tv-automation-playout-gateway/commit/0612f96))
* bugfix: all mediaObjects are deleted upon startup ([9f02191](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f02191))
* bugfix: all mediaObjects are deleted upon startup ([e0624b0](https://github.com/nrkno/tv-automation-playout-gateway/commit/e0624b0))
* build ([20871c0](https://github.com/nrkno/tv-automation-playout-gateway/commit/20871c0))
* build-script: yarn.lock file should not be removed and if updates are needed, that shoud fail the build process. ([d83584d](https://github.com/nrkno/tv-automation-playout-gateway/commit/d83584d))
* bump package version ([92d61e6](https://github.com/nrkno/tv-automation-playout-gateway/commit/92d61e6))
* bump tsr version ([3df738d](https://github.com/nrkno/tv-automation-playout-gateway/commit/3df738d))
* bump tsr version ([3fb51c1](https://github.com/nrkno/tv-automation-playout-gateway/commit/3fb51c1))
* CasparCG LOADBG and PLAY command 404 errors are handled as warnings not errors ([54ceebb](https://github.com/nrkno/tv-automation-playout-gateway/commit/54ceebb))
* catch disk usage http errors ([635db9c](https://github.com/nrkno/tv-automation-playout-gateway/commit/635db9c))
* catch promises ([22db4bc](https://github.com/nrkno/tv-automation-playout-gateway/commit/22db4bc))
* changed callMethod to callMethodLowPrio, to avoid throttling Core ([684e271](https://github.com/nrkno/tv-automation-playout-gateway/commit/684e271))
* changed statobj id ([1920020](https://github.com/nrkno/tv-automation-playout-gateway/commit/1920020))
* clearing observers properly ([0679f66](https://github.com/nrkno/tv-automation-playout-gateway/commit/0679f66))
* crash when missing mediascanner setting ([76fbf1c](https://github.com/nrkno/tv-automation-playout-gateway/commit/76fbf1c))
* drop empty certificates ([8aa133c](https://github.com/nrkno/tv-automation-playout-gateway/commit/8aa133c))
* error logging ([76f3749](https://github.com/nrkno/tv-automation-playout-gateway/commit/76f3749))
* handle promises appropriately ([d06635c](https://github.com/nrkno/tv-automation-playout-gateway/commit/d06635c))
* handle tsr asynchronousicity properly ([9db981c](https://github.com/nrkno/tv-automation-playout-gateway/commit/9db981c))
* ignore watchdog file changes ([b238e44](https://github.com/nrkno/tv-automation-playout-gateway/commit/b238e44))
* import underscore ([cfe6516](https://github.com/nrkno/tv-automation-playout-gateway/commit/cfe6516))
* lint & build ([8824435](https://github.com/nrkno/tv-automation-playout-gateway/commit/8824435))
* log error better ([b02c92b](https://github.com/nrkno/tv-automation-playout-gateway/commit/b02c92b))
* logging ([e3cb0d8](https://github.com/nrkno/tv-automation-playout-gateway/commit/e3cb0d8))
* media info missing mediaId property ([981f788](https://github.com/nrkno/tv-automation-playout-gateway/commit/981f788))
* media info missing mediaId property ([fb7f390](https://github.com/nrkno/tv-automation-playout-gateway/commit/fb7f390))
* media scanner lastRev + hashed id ([a6276b7](https://github.com/nrkno/tv-automation-playout-gateway/commit/a6276b7))
* media-scanner linting ([f7480cf](https://github.com/nrkno/tv-automation-playout-gateway/commit/f7480cf))
* media-scanner status ([1370703](https://github.com/nrkno/tv-automation-playout-gateway/commit/1370703))
* media-scanner status reporting ([b80c0a5](https://github.com/nrkno/tv-automation-playout-gateway/commit/b80c0a5))
* media-scanner status, message ordering & prioritys ([332c92e](https://github.com/nrkno/tv-automation-playout-gateway/commit/332c92e))
* mediascanner error traces & be able to disable by setting host to "disable" ([9734662](https://github.com/nrkno/tv-automation-playout-gateway/commit/9734662))
* Mediascanner reconnection bugs ([d72e3d1](https://github.com/nrkno/tv-automation-playout-gateway/commit/d72e3d1))
* multi threading is a runtime config from core ([233f20e](https://github.com/nrkno/tv-automation-playout-gateway/commit/233f20e))
* persist media through a restart ([3558c8a](https://github.com/nrkno/tv-automation-playout-gateway/commit/3558c8a))
* persist media through a restart ([627bd94](https://github.com/nrkno/tv-automation-playout-gateway/commit/627bd94))
* pleasing linter. One logical change. ([cb2449a](https://github.com/nrkno/tv-automation-playout-gateway/commit/cb2449a))
* postbump script ([7e603ad](https://github.com/nrkno/tv-automation-playout-gateway/commit/7e603ad))
* potential fix for reconnect issue ([81cbd1d](https://github.com/nrkno/tv-automation-playout-gateway/commit/81cbd1d))
* re-implement supression of 404 casparcg commands ([d57e03d](https://github.com/nrkno/tv-automation-playout-gateway/commit/d57e03d))
* remove unused methods ([1711b9d](https://github.com/nrkno/tv-automation-playout-gateway/commit/1711b9d))
* removed console.log ([2be9ff8](https://github.com/nrkno/tv-automation-playout-gateway/commit/2be9ff8))
* removed console.log ([05fdf46](https://github.com/nrkno/tv-automation-playout-gateway/commit/05fdf46))
* Removed Launcher dependency (moving the functionality into TSR) ([45088b4](https://github.com/nrkno/tv-automation-playout-gateway/commit/45088b4))
* resync when reconnecting ([1f7dab1](https://github.com/nrkno/tv-automation-playout-gateway/commit/1f7dab1))
* revert pouchdb dep version to last version known to work (7.0.0 is no good) ([49567b8](https://github.com/nrkno/tv-automation-playout-gateway/commit/49567b8))
* revert versionTime script ([0ba83c2](https://github.com/nrkno/tv-automation-playout-gateway/commit/0ba83c2))
* revert: remove baltes debug file ([7e37598](https://github.com/nrkno/tv-automation-playout-gateway/commit/7e37598))
* set correct atem media player for second still ([c2b4cca](https://github.com/nrkno/tv-automation-playout-gateway/commit/c2b4cca))
* subscribe to timeline in current studio ([4132a68](https://github.com/nrkno/tv-automation-playout-gateway/commit/4132a68))
* supress some mediaScanner errors ([0c3468a](https://github.com/nrkno/tv-automation-playout-gateway/commit/0c3468a))
* temporary fix to log debug-messages ([c46f513](https://github.com/nrkno/tv-automation-playout-gateway/commit/c46f513))
* temporary fix to log debug-messages ([40e0921](https://github.com/nrkno/tv-automation-playout-gateway/commit/40e0921))
* temporary test: added random id to all log outputs, to verify if logs are logged twice ([e72cbc1](https://github.com/nrkno/tv-automation-playout-gateway/commit/e72cbc1))
* temporary test: added random id to all log outputs, to verify if logs are logged twice ([f7deb7a](https://github.com/nrkno/tv-automation-playout-gateway/commit/f7deb7a))
* timelineCallback error handling ([3c5e494](https://github.com/nrkno/tv-automation-playout-gateway/commit/3c5e494))
* try to better output errors ([e4c2d3e](https://github.com/nrkno/tv-automation-playout-gateway/commit/e4c2d3e))
* tsr dep ([4f0dd2b](https://github.com/nrkno/tv-automation-playout-gateway/commit/4f0dd2b))
* tsr dep ([18eda01](https://github.com/nrkno/tv-automation-playout-gateway/commit/18eda01))
* tsr-dep, fixing a memory leak ([62d7843](https://github.com/nrkno/tv-automation-playout-gateway/commit/62d7843))
* TSR-dep: hotfix, debuglogging ([b605f66](https://github.com/nrkno/tv-automation-playout-gateway/commit/b605f66))
* tsr: timeline bugfix & callback fix ([0a1a43b](https://github.com/nrkno/tv-automation-playout-gateway/commit/0a1a43b))
* tsrHandler: dont run functions before init() ([b1ff246](https://github.com/nrkno/tv-automation-playout-gateway/commit/b1ff246))
* upd TSR dependency ([176d6bf](https://github.com/nrkno/tv-automation-playout-gateway/commit/176d6bf))
* upd TSR dependency ([691b64d](https://github.com/nrkno/tv-automation-playout-gateway/commit/691b64d))
* update atem-connection dependency, to fix 100% cpu usage issue ([4ebd370](https://github.com/nrkno/tv-automation-playout-gateway/commit/4ebd370))
* update core-integration dep (clean up old sockets) ([80bd1ad](https://github.com/nrkno/tv-automation-playout-gateway/commit/80bd1ad))
* update core-integration dep (clean up old sockets) ([7120337](https://github.com/nrkno/tv-automation-playout-gateway/commit/7120337))
* update core-integration dependency ([66383b1](https://github.com/nrkno/tv-automation-playout-gateway/commit/66383b1))
* update dependencies ([3550afd](https://github.com/nrkno/tv-automation-playout-gateway/commit/3550afd))
* update disk usage limits ([e646543](https://github.com/nrkno/tv-automation-playout-gateway/commit/e646543))
* update libs to fix atem supersource boxes ([dba8948](https://github.com/nrkno/tv-automation-playout-gateway/commit/dba8948))
* update lint & fix lint errors ([bfa94ba](https://github.com/nrkno/tv-automation-playout-gateway/commit/bfa94ba))
* update media-scanner Diskinfo typings & warning message ([de624bd](https://github.com/nrkno/tv-automation-playout-gateway/commit/de624bd))
* update tsr ([1e0867a](https://github.com/nrkno/tv-automation-playout-gateway/commit/1e0867a))
* Update tsr and supertimeline ([0d76c2c](https://github.com/nrkno/tv-automation-playout-gateway/commit/0d76c2c))
* update TSR dep ([5cda708](https://github.com/nrkno/tv-automation-playout-gateway/commit/5cda708))
* update TSR dep ([943b270](https://github.com/nrkno/tv-automation-playout-gateway/commit/943b270))
* update typings for multithreaded tsr ([638da97](https://github.com/nrkno/tv-automation-playout-gateway/commit/638da97))
* updated dependencies ([97f1852](https://github.com/nrkno/tv-automation-playout-gateway/commit/97f1852))
* updated tsr & core-integration dependency ([0b04237](https://github.com/nrkno/tv-automation-playout-gateway/commit/0b04237))
* updated tsr & core-integration dependency ([7cc9386](https://github.com/nrkno/tv-automation-playout-gateway/commit/7cc9386))
* updated TSR dep (bugfixes in timeline) ([72f0369](https://github.com/nrkno/tv-automation-playout-gateway/commit/72f0369))
* updated tsr dependency ([43a7069](https://github.com/nrkno/tv-automation-playout-gateway/commit/43a7069))
* updated tsr dependency ([89c38b9](https://github.com/nrkno/tv-automation-playout-gateway/commit/89c38b9))
* use axios instead of native http ([d81e5e7](https://github.com/nrkno/tv-automation-playout-gateway/commit/d81e5e7))
* versions of non-parent processes ([0d08e9e](https://github.com/nrkno/tv-automation-playout-gateway/commit/0d08e9e))
* Winston logging typing (disabled .warning) ([97c7384](https://github.com/nrkno/tv-automation-playout-gateway/commit/97c7384))
* **logging:** More reasonable logging of the statObj evaluation ([422cd4f](https://github.com/nrkno/tv-automation-playout-gateway/commit/422cd4f))
* **media scanner:** catch http request errors ([9628e4a](https://github.com/nrkno/tv-automation-playout-gateway/commit/9628e4a))
* **media scanner:** safe document id ([9f41872](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f41872))
* **media-scanner:** reworked connection logic, adding better reconnection logic & status monitoring ([2f05586](https://github.com/nrkno/tv-automation-playout-gateway/commit/2f05586))
* **media-scanner:** reworked connection logic, adding better reconnection logic & status monitoring ([0cead6e](https://github.com/nrkno/tv-automation-playout-gateway/commit/0cead6e))
* **mediaScanner:** error trying to log warning when disk-usage not supported ([66e4324](https://github.com/nrkno/tv-automation-playout-gateway/commit/66e4324))
* **mediaScanner:** error trying to log warning when disk-usage not supported ([3d6bd22](https://github.com/nrkno/tv-automation-playout-gateway/commit/3d6bd22))
* **peripheralDevices:** creates more user-friendly names of devices and sub devices. Seen in combination with ongoing work in core and mos-gw to clean up the user interface. ([6b9efaa](https://github.com/nrkno/tv-automation-playout-gateway/commit/6b9efaa))


### Features

* add callbackStopped ([222a46e](https://github.com/nrkno/tv-automation-playout-gateway/commit/222a46e))
* add CLI option "-certificates", to use for self-signed certificates ([0064d7d](https://github.com/nrkno/tv-automation-playout-gateway/commit/0064d7d))
* add config for multi threading ([203c823](https://github.com/nrkno/tv-automation-playout-gateway/commit/203c823))
* Add segmentLineItemPlaybackStarted callback ([91c99e0](https://github.com/nrkno/tv-automation-playout-gateway/commit/91c99e0))
* addded versions to init data ([6641bf1](https://github.com/nrkno/tv-automation-playout-gateway/commit/6641bf1))
* added -disableWatchdog option ([4ce8ae1](https://github.com/nrkno/tv-automation-playout-gateway/commit/4ce8ae1))
* added statObj support, an attempt to avoid playing incomplete timelines ([cf48e16](https://github.com/nrkno/tv-automation-playout-gateway/commit/cf48e16))
* added watchDog ([3f55c7b](https://github.com/nrkno/tv-automation-playout-gateway/commit/3f55c7b))
* adding CoreTSRDeviceHandler: unifying with mos-connection, the CoreTSRDeviceHandler manages the subscriptions for sub-devices ([9f49951](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f49951))
* casparcg restart routine ([415387d](https://github.com/nrkno/tv-automation-playout-gateway/commit/415387d))
* CLI argument: "-unsafeSSL" ([757bf13](https://github.com/nrkno/tv-automation-playout-gateway/commit/757bf13))
* configurable media scanner host / port ([d142996](https://github.com/nrkno/tv-automation-playout-gateway/commit/d142996))
* implement support for slowCommands reporting ([c15f240](https://github.com/nrkno/tv-automation-playout-gateway/commit/c15f240))
* kill process when initialization fails ([bca0b51](https://github.com/nrkno/tv-automation-playout-gateway/commit/bca0b51))
* listen to setting debugLogging, to turn on/off debug logging. Also support of new TSR logging emitters. ([25b0a9e](https://github.com/nrkno/tv-automation-playout-gateway/commit/25b0a9e))
* log successful commands ([86f6f8a](https://github.com/nrkno/tv-automation-playout-gateway/commit/86f6f8a))
* media-scanner add example for loading the whole database ([422563b](https://github.com/nrkno/tv-automation-playout-gateway/commit/422563b))
* Prototype media-scanner connection and typings ([59a9927](https://github.com/nrkno/tv-automation-playout-gateway/commit/59a9927))
* Receive full timeline, not just portion for local devices ([388e310](https://github.com/nrkno/tv-automation-playout-gateway/commit/388e310))
* refactored getting of timeline, added getSnapshot, for debugging ([6df71de](https://github.com/nrkno/tv-automation-playout-gateway/commit/6df71de))
* report disk usage from media-scanner to core ([886548f](https://github.com/nrkno/tv-automation-playout-gateway/commit/886548f))
* script + function to upload a still to the atem ([e39762a](https://github.com/nrkno/tv-automation-playout-gateway/commit/e39762a))
* script + function to upload a still to the atem ([18446f5](https://github.com/nrkno/tv-automation-playout-gateway/commit/18446f5))
* support for multi-threaded resolver ([c814ef3](https://github.com/nrkno/tv-automation-playout-gateway/commit/c814ef3))
* support new TSR interface ([3383dde](https://github.com/nrkno/tv-automation-playout-gateway/commit/3383dde))
* take mediascanner host + port from core, replicate pouchdb ([e5fa674](https://github.com/nrkno/tv-automation-playout-gateway/commit/e5fa674))
* tsr dependency: using internal command-queue instead of scheduler ([32dc692](https://github.com/nrkno/tv-automation-playout-gateway/commit/32dc692))
* tsr dependency: using internal command-queue instead of scheduler ([da95b46](https://github.com/nrkno/tv-automation-playout-gateway/commit/da95b46))
* upd tsr dep ([2596dba](https://github.com/nrkno/tv-automation-playout-gateway/commit/2596dba))
* upd TSR-dependency, featuring multi-threading ([e1f5ebc](https://github.com/nrkno/tv-automation-playout-gateway/commit/e1f5ebc))
* update atem-connection dep, fixing media upload ([d675cb9](https://github.com/nrkno/tv-automation-playout-gateway/commit/d675cb9))
* update core-integration dependency ([218f4cb](https://github.com/nrkno/tv-automation-playout-gateway/commit/218f4cb))
* update dependencies ([e1cc767](https://github.com/nrkno/tv-automation-playout-gateway/commit/e1cc767))
* update dependencies ([967a356](https://github.com/nrkno/tv-automation-playout-gateway/commit/967a356))
* update timeline dep ([bcc34f7](https://github.com/nrkno/tv-automation-playout-gateway/commit/bcc34f7))
* update TSR dep ([09c2fa9](https://github.com/nrkno/tv-automation-playout-gateway/commit/09c2fa9))
* update TSR dep, add Pharos device ([9f52ee3](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f52ee3))
* update TSR dep: restart casparcg using launcher-http endpoint ([b0fdca6](https://github.com/nrkno/tv-automation-playout-gateway/commit/b0fdca6))
* update TSR dependency: adding support for Hyperdeck ([de25c5f](https://github.com/nrkno/tv-automation-playout-gateway/commit/de25c5f))
* updated core-integration dep, introducing autoSubscribe ([4589eee](https://github.com/nrkno/tv-automation-playout-gateway/commit/4589eee))
* updated TSR dep (containing the big timeline refactoring) ([74ef284](https://github.com/nrkno/tv-automation-playout-gateway/commit/74ef284))
* **atemUpload:** multiple files ([1efa683](https://github.com/nrkno/tv-automation-playout-gateway/commit/1efa683))
* **atemUpload:** multiple files ([ca0ce62](https://github.com/nrkno/tv-automation-playout-gateway/commit/ca0ce62))
* **disk-usage:** limit rate of disk usage check, and do it at an interval ([f5db8fb](https://github.com/nrkno/tv-automation-playout-gateway/commit/f5db8fb))
* **media scanner:** basic reconnection logic without replication ([d3ccd86](https://github.com/nrkno/tv-automation-playout-gateway/commit/d3ccd86))
* updated tsr dependency ([be0e7dc](https://github.com/nrkno/tv-automation-playout-gateway/commit/be0e7dc))
* updated tsr dependency ([0820f05](https://github.com/nrkno/tv-automation-playout-gateway/commit/0820f05))
* updated TSR dependency (implementing lawo) ([fa79697](https://github.com/nrkno/tv-automation-playout-gateway/commit/fa79697))
* updated TSR-device-status handling ([11af163](https://github.com/nrkno/tv-automation-playout-gateway/commit/11af163))
* versionTime ([c7b478b](https://github.com/nrkno/tv-automation-playout-gateway/commit/c7b478b))



<a name="0.18.0"></a>
# [0.18.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.17.2...v0.18.0) (2019-04-08)


### Bug Fixes

* add proActiveResolve option for TSR ([9c7ac66](https://github.com/nrkno/tv-automation-playout-gateway/commit/9c7ac66))
* upd TSR dependency ([691b64d](https://github.com/nrkno/tv-automation-playout-gateway/commit/691b64d))


### Features

* implement support for slowCommands reporting ([c15f240](https://github.com/nrkno/tv-automation-playout-gateway/commit/c15f240))
* support new TSR interface ([3383dde](https://github.com/nrkno/tv-automation-playout-gateway/commit/3383dde))
* upd TSR-dependency, featuring multi-threading ([e1f5ebc](https://github.com/nrkno/tv-automation-playout-gateway/commit/e1f5ebc))



<a name="0.17.2"></a>
## [0.17.2](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.17.1...v0.17.2) (2019-03-28)



<a name="0.17.1"></a>
## [0.17.1](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.17.0...v0.17.1) (2019-03-27)


### Bug Fixes

* upd TSR dependency ([176d6bf](https://github.com/nrkno/tv-automation-playout-gateway/commit/176d6bf))



<a name="0.17.0"></a>
# [0.17.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.16.2...v0.17.0) (2019-03-13)


### Bug Fixes

* mediascanner error traces & be able to disable by setting host to "disable" ([9734662](https://github.com/nrkno/tv-automation-playout-gateway/commit/9734662))
* pleasing linter. One logical change. ([cb2449a](https://github.com/nrkno/tv-automation-playout-gateway/commit/cb2449a))
* try to better output errors ([e4c2d3e](https://github.com/nrkno/tv-automation-playout-gateway/commit/e4c2d3e))
* update dependencies ([3550afd](https://github.com/nrkno/tv-automation-playout-gateway/commit/3550afd))


### Features

* support for multi-threaded resolver ([c814ef3](https://github.com/nrkno/tv-automation-playout-gateway/commit/c814ef3))



<a name="0.16.2"></a>
## [0.16.2](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.16.1...v0.16.2) (2019-02-13)


### Bug Fixes

* update tsr ([1e0867a](https://github.com/nrkno/tv-automation-playout-gateway/commit/1e0867a))



<a name="0.16.1"></a>
## [0.16.1](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.16.0...v0.16.1) (2019-02-08)


### Bug Fixes

* drop empty certificates ([8aa133c](https://github.com/nrkno/tv-automation-playout-gateway/commit/8aa133c))
* import underscore ([cfe6516](https://github.com/nrkno/tv-automation-playout-gateway/commit/cfe6516))



<a name="0.16.0"></a>
# [0.16.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.15.4...v0.16.0) (2019-02-08)


### Bug Fixes

* build ([20871c0](https://github.com/nrkno/tv-automation-playout-gateway/commit/20871c0))
* handle tsr asynchronousicity properly ([9db981c](https://github.com/nrkno/tv-automation-playout-gateway/commit/9db981c))
* log error better ([b02c92b](https://github.com/nrkno/tv-automation-playout-gateway/commit/b02c92b))
* multi threading is a runtime config from core ([233f20e](https://github.com/nrkno/tv-automation-playout-gateway/commit/233f20e))
* timelineCallback error handling ([3c5e494](https://github.com/nrkno/tv-automation-playout-gateway/commit/3c5e494))
* update typings for multithreaded tsr ([638da97](https://github.com/nrkno/tv-automation-playout-gateway/commit/638da97))


### Features

* add callbackStopped ([222a46e](https://github.com/nrkno/tv-automation-playout-gateway/commit/222a46e))
* add CLI option "-certificates", to use for self-signed certificates ([0064d7d](https://github.com/nrkno/tv-automation-playout-gateway/commit/0064d7d))
* add config for multi threading ([203c823](https://github.com/nrkno/tv-automation-playout-gateway/commit/203c823))
* CLI argument: "-unsafeSSL" ([757bf13](https://github.com/nrkno/tv-automation-playout-gateway/commit/757bf13))



<a name="0.15.4"></a>
## [0.15.4](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.15.3...v0.15.4) (2019-01-16)



<a name="0.15.3"></a>
## [0.15.3](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.15.2...v0.15.3) (2019-01-14)



<a name="0.15.2"></a>
## [0.15.2](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.15.1...v0.15.2) (2019-01-11)


### Bug Fixes

* Mediascanner reconnection bugs ([d72e3d1](https://github.com/nrkno/tv-automation-playout-gateway/commit/d72e3d1))
* potential fix for reconnect issue ([81cbd1d](https://github.com/nrkno/tv-automation-playout-gateway/commit/81cbd1d))
* revert pouchdb dep version to last version known to work (7.0.0 is no good) ([49567b8](https://github.com/nrkno/tv-automation-playout-gateway/commit/49567b8))



<a name="0.15.1"></a>
## [0.15.1](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.15.0...v0.15.1) (2019-01-10)


### Bug Fixes

* media-scanner status ([1370703](https://github.com/nrkno/tv-automation-playout-gateway/commit/1370703))
* media-scanner status, message ordering & prioritys ([332c92e](https://github.com/nrkno/tv-automation-playout-gateway/commit/332c92e))



<a name="0.15.0"></a>
# [0.15.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.14.2...v0.15.0) (2018-12-19)


### Bug Fixes

* **media-scanner:** reworked connection logic, adding better reconnection logic & status monitoring ([0cead6e](https://github.com/nrkno/tv-automation-playout-gateway/commit/0cead6e))
* bump package version ([92d61e6](https://github.com/nrkno/tv-automation-playout-gateway/commit/92d61e6))
* **media-scanner:** reworked connection logic, adding better reconnection logic & status monitoring ([2f05586](https://github.com/nrkno/tv-automation-playout-gateway/commit/2f05586))
* **mediaScanner:** error trying to log warning when disk-usage not supported ([3d6bd22](https://github.com/nrkno/tv-automation-playout-gateway/commit/3d6bd22))
* **mediaScanner:** error trying to log warning when disk-usage not supported ([66e4324](https://github.com/nrkno/tv-automation-playout-gateway/commit/66e4324))
* ignore watchdog file changes ([b238e44](https://github.com/nrkno/tv-automation-playout-gateway/commit/b238e44))
* re-implement supression of 404 casparcg commands ([d57e03d](https://github.com/nrkno/tv-automation-playout-gateway/commit/d57e03d))
* subscribe to timeline in current studio ([4132a68](https://github.com/nrkno/tv-automation-playout-gateway/commit/4132a68))
* supress some mediaScanner errors ([0c3468a](https://github.com/nrkno/tv-automation-playout-gateway/commit/0c3468a))
* TSR-dep: hotfix, debuglogging ([b605f66](https://github.com/nrkno/tv-automation-playout-gateway/commit/b605f66))
* Winston logging typing (disabled .warning) ([97c7384](https://github.com/nrkno/tv-automation-playout-gateway/commit/97c7384))


### Features

* Receive full timeline, not just portion for local devices ([388e310](https://github.com/nrkno/tv-automation-playout-gateway/commit/388e310))
* update TSR dep ([09c2fa9](https://github.com/nrkno/tv-automation-playout-gateway/commit/09c2fa9))



<a name="0.14.2"></a>
## [0.14.2](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.14.1...v0.14.2) (2018-12-13)



<a name="0.14.1"></a>
## [0.14.1](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.14.0...v0.14.1) (2018-11-28)


### Bug Fixes

* update atem-connection dependency, to fix 100% cpu usage issue ([4ebd370](https://github.com/nrkno/tv-automation-playout-gateway/commit/4ebd370))



<a name="0.14.0"></a>
# [0.14.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.13.0...v0.14.0) (2018-11-21)


### Bug Fixes

* **peripheralDevices:** creates more user-friendly names of devices and sub devices. Seen in combination with ongoing work in core and mos-gw to clean up the user interface. ([6b9efaa](https://github.com/nrkno/tv-automation-playout-gateway/commit/6b9efaa))
* update disk usage limits ([e646543](https://github.com/nrkno/tv-automation-playout-gateway/commit/e646543))


### Features

* **disk-usage:** limit rate of disk usage check, and do it at an interval ([f5db8fb](https://github.com/nrkno/tv-automation-playout-gateway/commit/f5db8fb))



<a name="0.13.0"></a>
# [0.13.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.12.0...v0.13.0) (2018-11-14)


### Bug Fixes

* atemUpload: bugfix: didn't upload on init ([76b3802](https://github.com/nrkno/tv-automation-playout-gateway/commit/76b3802))
* atemUpload: handle errors & typo ([01bc8da](https://github.com/nrkno/tv-automation-playout-gateway/commit/01bc8da))
* bump tsr version ([3fb51c1](https://github.com/nrkno/tv-automation-playout-gateway/commit/3fb51c1))
* catch disk usage http errors ([635db9c](https://github.com/nrkno/tv-automation-playout-gateway/commit/635db9c))
* media-scanner linting ([f7480cf](https://github.com/nrkno/tv-automation-playout-gateway/commit/f7480cf))
* media-scanner status reporting ([b80c0a5](https://github.com/nrkno/tv-automation-playout-gateway/commit/b80c0a5))
* revert: remove baltes debug file ([7e37598](https://github.com/nrkno/tv-automation-playout-gateway/commit/7e37598))
* temporary fix to log debug-messages ([40e0921](https://github.com/nrkno/tv-automation-playout-gateway/commit/40e0921))
* tsrHandler: dont run functions before init() ([b1ff246](https://github.com/nrkno/tv-automation-playout-gateway/commit/b1ff246))
* update core-integration dep (clean up old sockets) ([80bd1ad](https://github.com/nrkno/tv-automation-playout-gateway/commit/80bd1ad))
* update core-integration dependency ([66383b1](https://github.com/nrkno/tv-automation-playout-gateway/commit/66383b1))
* update lint & fix lint errors ([bfa94ba](https://github.com/nrkno/tv-automation-playout-gateway/commit/bfa94ba))
* update media-scanner Diskinfo typings & warning message ([de624bd](https://github.com/nrkno/tv-automation-playout-gateway/commit/de624bd))


### Features

* report disk usage from media-scanner to core ([886548f](https://github.com/nrkno/tv-automation-playout-gateway/commit/886548f))
* update atem-connection dep, fixing media upload ([d675cb9](https://github.com/nrkno/tv-automation-playout-gateway/commit/d675cb9))
* update dependencies ([e1cc767](https://github.com/nrkno/tv-automation-playout-gateway/commit/e1cc767))
* update TSR dep, add Pharos device ([9f52ee3](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f52ee3))



<a name="0.12.0"></a>
# [0.12.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.10...v0.12.0) (2018-11-13)


### Bug Fixes

* postbump script ([7e603ad](https://github.com/nrkno/tv-automation-playout-gateway/commit/7e603ad))
* revert versionTime script ([0ba83c2](https://github.com/nrkno/tv-automation-playout-gateway/commit/0ba83c2))


### Features

* versionTime ([c7b478b](https://github.com/nrkno/tv-automation-playout-gateway/commit/c7b478b))



<a name="0.11.10"></a>
## [0.11.10](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.9...v0.11.10) (2018-10-26)


### Bug Fixes

* temporary fix to log debug-messages ([c46f513](https://github.com/nrkno/tv-automation-playout-gateway/commit/c46f513))
* update TSR dep ([943b270](https://github.com/nrkno/tv-automation-playout-gateway/commit/943b270))



<a name="0.11.9"></a>
## [0.11.9](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.8...v0.11.9) (2018-10-26)


### Bug Fixes

* bump tsr version ([3df738d](https://github.com/nrkno/tv-automation-playout-gateway/commit/3df738d))



<a name="0.11.8"></a>
## [0.11.8](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.7...v0.11.8) (2018-10-24)



<a name="0.11.7"></a>
## [0.11.7](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.6...v0.11.7) (2018-10-24)



<a name="0.11.6"></a>
## [0.11.6](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.5...v0.11.6) (2018-10-24)


### Bug Fixes

* update core-integration dep (clean up old sockets) ([7120337](https://github.com/nrkno/tv-automation-playout-gateway/commit/7120337))



<a name="0.11.5"></a>
## [0.11.5](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.4...v0.11.5) (2018-10-24)



<a name="0.11.4"></a>
## [0.11.4](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.2...v0.11.4) (2018-10-19)

### Bug Fixes

* adjust debug levels ([897c57e](https://github.com/nrkno/tv-automation-playout-gateway/commit/897c57e))
* bugfix: all mediaObjects are deleted upon startup ([9f02191](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f02191))
* changed callMethod to callMethodLowPrio, to avoid throttling Core ([684e271](https://github.com/nrkno/tv-automation-playout-gateway/commit/684e271))


### Features

* listen to setting debugLogging, to turn on/off debug logging. Also support of new TSR logging emitters. ([25b0a9e](https://github.com/nrkno/tv-automation-playout-gateway/commit/25b0a9e))
* update core-integration dependency ([218f4cb](https://github.com/nrkno/tv-automation-playout-gateway/commit/218f4cb))
* update TSR dependency: adding support for Hyperdeck ([de25c5f](https://github.com/nrkno/tv-automation-playout-gateway/commit/de25c5f))
* updated TSR-device-status handling ([11af163](https://github.com/nrkno/tv-automation-playout-gateway/commit/11af163))



<a name="0.11.2"></a>
## [0.11.2](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.1...v0.11.2) (2018-10-17)


### Bug Fixes

* bugfix: all mediaObjects are deleted upon startup ([e0624b0](https://github.com/nrkno/tv-automation-playout-gateway/commit/e0624b0))



<a name="0.11.1"></a>
## [0.11.1](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.0...v0.11.1) (2018-10-16)


### Bug Fixes

* CasparCG LOADBG and PLAY command 404 errors are handled as warnings not errors ([54ceebb](https://github.com/nrkno/tv-automation-playout-gateway/commit/54ceebb))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.10.0...v0.11.0) (2018-09-21)


### Bug Fixes

* Removed Launcher dependency (moving the functionality into TSR) ([45088b4](https://github.com/nrkno/tv-automation-playout-gateway/commit/45088b4))


### Features

* adding CoreTSRDeviceHandler: unifying with mos-connection, the CoreTSRDeviceHandler manages the subscriptions for sub-devices ([9f49951](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f49951))
* update TSR dep: restart casparcg using launcher-http endpoint ([b0fdca6](https://github.com/nrkno/tv-automation-playout-gateway/commit/b0fdca6))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.9.0...v0.10.0) (2018-09-20)


### Features

* update timeline dep ([bcc34f7](https://github.com/nrkno/tv-automation-playout-gateway/commit/bcc34f7))



<a name="0.9.0"></a>
# [0.9.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.8.0...v0.9.0) (2018-09-10)


### Bug Fixes

* media info missing mediaId property ([fb7f390](https://github.com/nrkno/tv-automation-playout-gateway/commit/fb7f390))


### Features

* tsr dependency: using internal command-queue instead of scheduler ([da95b46](https://github.com/nrkno/tv-automation-playout-gateway/commit/da95b46))



<a name="0.8.0"></a>
# [0.8.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.7.4...v0.8.0) (2018-09-06)


### Bug Fixes

* media info missing mediaId property ([981f788](https://github.com/nrkno/tv-automation-playout-gateway/commit/981f788))


### Features

* tsr dependency: using internal command-queue instead of scheduler ([32dc692](https://github.com/nrkno/tv-automation-playout-gateway/commit/32dc692))



<a name="0.7.4"></a>
## [0.7.4](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.7.3...v0.7.4) (2018-09-05)


### Bug Fixes

* set correct atem media player for second still ([c2b4cca](https://github.com/nrkno/tv-automation-playout-gateway/commit/c2b4cca))



<a name="0.7.3"></a>
## [0.7.3](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.7.2...v0.7.3) (2018-09-05)


### Bug Fixes

* media scanner lastRev + hashed id ([a6276b7](https://github.com/nrkno/tv-automation-playout-gateway/commit/a6276b7))
* updated TSR dep (bugfixes in timeline) ([72f0369](https://github.com/nrkno/tv-automation-playout-gateway/commit/72f0369))



<a name="0.7.2"></a>
## [0.7.2](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.7.1...v0.7.2) (2018-09-04)



<a name="0.7.1"></a>
## [0.7.1](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.7.0...v0.7.1) (2018-08-31)



<a name="0.7.0"></a>
# [0.7.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.5.2...v0.7.0) (2018-08-31)


### Bug Fixes

* also save the original media id ([9939db4](https://github.com/nrkno/tv-automation-playout-gateway/commit/9939db4))
* also save the original media id ([c0f6c0b](https://github.com/nrkno/tv-automation-playout-gateway/commit/c0f6c0b))
* temporary test: added random id to all log outputs, to verify if logs are logged twice ([e72cbc1](https://github.com/nrkno/tv-automation-playout-gateway/commit/e72cbc1))
* temporary test: added random id to all log outputs, to verify if logs are logged twice ([f7deb7a](https://github.com/nrkno/tv-automation-playout-gateway/commit/f7deb7a))
* tsr dep ([18eda01](https://github.com/nrkno/tv-automation-playout-gateway/commit/18eda01))
* tsr dep ([4f0dd2b](https://github.com/nrkno/tv-automation-playout-gateway/commit/4f0dd2b))


### Features

* **atemUpload:** multiple files ([1efa683](https://github.com/nrkno/tv-automation-playout-gateway/commit/1efa683))
* **atemUpload:** multiple files ([ca0ce62](https://github.com/nrkno/tv-automation-playout-gateway/commit/ca0ce62))



<a name="0.6.0"></a>
# 0.6.0 (2018-08-31)


### Bug Fixes

* (troubleshooting) reenabling mediaScanner, but with replication disabled ([752f86c](https://github.com/nrkno/tv-automation-playout-gateway/commit/752f86c))
* add localTimestamp to logger output ([8ae2c01](https://github.com/nrkno/tv-automation-playout-gateway/commit/8ae2c01))
* added missing core onError handler ([d5b0f01](https://github.com/nrkno/tv-automation-playout-gateway/commit/d5b0f01))
* added option to fully disable statObj ([c9794bb](https://github.com/nrkno/tv-automation-playout-gateway/commit/c9794bb))
* added tracing of timeline ([b7b8120](https://github.com/nrkno/tv-automation-playout-gateway/commit/b7b8120))
* also save the original media id ([9939db4](https://github.com/nrkno/tv-automation-playout-gateway/commit/9939db4))
* also save the original media id ([c0f6c0b](https://github.com/nrkno/tv-automation-playout-gateway/commit/c0f6c0b))
* better faster stronger timeline transform ([0612f96](https://github.com/nrkno/tv-automation-playout-gateway/commit/0612f96))
* build-script: yarn.lock file should not be removed and if updates are needed, that shoud fail the build process. ([d83584d](https://github.com/nrkno/tv-automation-playout-gateway/commit/d83584d))
* catch promises ([22db4bc](https://github.com/nrkno/tv-automation-playout-gateway/commit/22db4bc))
* changed statobj id ([1920020](https://github.com/nrkno/tv-automation-playout-gateway/commit/1920020))
* clearing observers properly ([0679f66](https://github.com/nrkno/tv-automation-playout-gateway/commit/0679f66))
* crash when missing mediascanner setting ([76fbf1c](https://github.com/nrkno/tv-automation-playout-gateway/commit/76fbf1c))
* error logging ([76f3749](https://github.com/nrkno/tv-automation-playout-gateway/commit/76f3749))
* handle promises appropriately ([d06635c](https://github.com/nrkno/tv-automation-playout-gateway/commit/d06635c))
* lint & build ([8824435](https://github.com/nrkno/tv-automation-playout-gateway/commit/8824435))
* logging ([e3cb0d8](https://github.com/nrkno/tv-automation-playout-gateway/commit/e3cb0d8))
* persist media through a restart ([627bd94](https://github.com/nrkno/tv-automation-playout-gateway/commit/627bd94))
* persist media through a restart ([3558c8a](https://github.com/nrkno/tv-automation-playout-gateway/commit/3558c8a))
* remove unused methods ([1711b9d](https://github.com/nrkno/tv-automation-playout-gateway/commit/1711b9d))
* removed console.log ([05fdf46](https://github.com/nrkno/tv-automation-playout-gateway/commit/05fdf46))
* removed console.log ([2be9ff8](https://github.com/nrkno/tv-automation-playout-gateway/commit/2be9ff8))
* resync when reconnecting ([1f7dab1](https://github.com/nrkno/tv-automation-playout-gateway/commit/1f7dab1))
* temporary test: added random id to all log outputs, to verify if logs are logged twice ([f7deb7a](https://github.com/nrkno/tv-automation-playout-gateway/commit/f7deb7a))
* temporary test: added random id to all log outputs, to verify if logs are logged twice ([e72cbc1](https://github.com/nrkno/tv-automation-playout-gateway/commit/e72cbc1))
* tsr dep ([18eda01](https://github.com/nrkno/tv-automation-playout-gateway/commit/18eda01))
* tsr dep ([4f0dd2b](https://github.com/nrkno/tv-automation-playout-gateway/commit/4f0dd2b))
* tsr-dep, fixing a memory leak ([62d7843](https://github.com/nrkno/tv-automation-playout-gateway/commit/62d7843))
* tsr: timeline bugfix & callback fix ([0a1a43b](https://github.com/nrkno/tv-automation-playout-gateway/commit/0a1a43b))
* update libs to fix atem supersource boxes ([dba8948](https://github.com/nrkno/tv-automation-playout-gateway/commit/dba8948))
* Update tsr and supertimeline ([0d76c2c](https://github.com/nrkno/tv-automation-playout-gateway/commit/0d76c2c))
* **logging:** More reasonable logging of the statObj evaluation ([422cd4f](https://github.com/nrkno/tv-automation-playout-gateway/commit/422cd4f))
* updated dependencies ([97f1852](https://github.com/nrkno/tv-automation-playout-gateway/commit/97f1852))
* updated tsr & core-integration dependency ([7cc9386](https://github.com/nrkno/tv-automation-playout-gateway/commit/7cc9386))
* updated tsr & core-integration dependency ([0b04237](https://github.com/nrkno/tv-automation-playout-gateway/commit/0b04237))
* updated tsr dependency ([43a7069](https://github.com/nrkno/tv-automation-playout-gateway/commit/43a7069))
* updated tsr dependency ([89c38b9](https://github.com/nrkno/tv-automation-playout-gateway/commit/89c38b9))
* use axios instead of native http ([d81e5e7](https://github.com/nrkno/tv-automation-playout-gateway/commit/d81e5e7))
* **media scanner:** catch http request errors ([9628e4a](https://github.com/nrkno/tv-automation-playout-gateway/commit/9628e4a))
* **media scanner:** safe document id ([9f41872](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f41872))
* versions of non-parent processes ([0d08e9e](https://github.com/nrkno/tv-automation-playout-gateway/commit/0d08e9e))


### Features

* Add segmentLineItemPlaybackStarted callback ([91c99e0](https://github.com/nrkno/tv-automation-playout-gateway/commit/91c99e0))
* addded versions to init data ([6641bf1](https://github.com/nrkno/tv-automation-playout-gateway/commit/6641bf1))
* added -disableWatchdog option ([4ce8ae1](https://github.com/nrkno/tv-automation-playout-gateway/commit/4ce8ae1))
* added statObj support, an attempt to avoid playing incomplete timelines ([cf48e16](https://github.com/nrkno/tv-automation-playout-gateway/commit/cf48e16))
* added watchDog ([3f55c7b](https://github.com/nrkno/tv-automation-playout-gateway/commit/3f55c7b))
* casparcg restart routine ([415387d](https://github.com/nrkno/tv-automation-playout-gateway/commit/415387d))
* configurable media scanner host / port ([d142996](https://github.com/nrkno/tv-automation-playout-gateway/commit/d142996))
* kill process when initialization fails ([bca0b51](https://github.com/nrkno/tv-automation-playout-gateway/commit/bca0b51))
* log successful commands ([86f6f8a](https://github.com/nrkno/tv-automation-playout-gateway/commit/86f6f8a))
* media-scanner add example for loading the whole database ([422563b](https://github.com/nrkno/tv-automation-playout-gateway/commit/422563b))
* Prototype media-scanner connection and typings ([59a9927](https://github.com/nrkno/tv-automation-playout-gateway/commit/59a9927))
* script + function to upload a still to the atem ([18446f5](https://github.com/nrkno/tv-automation-playout-gateway/commit/18446f5))
* **atemUpload:** multiple files ([1efa683](https://github.com/nrkno/tv-automation-playout-gateway/commit/1efa683))
* **atemUpload:** multiple files ([ca0ce62](https://github.com/nrkno/tv-automation-playout-gateway/commit/ca0ce62))
* **media scanner:** basic reconnection logic without replication ([d3ccd86](https://github.com/nrkno/tv-automation-playout-gateway/commit/d3ccd86))
* refactored getting of timeline, added getSnapshot, for debugging ([6df71de](https://github.com/nrkno/tv-automation-playout-gateway/commit/6df71de))
* script + function to upload a still to the atem ([e39762a](https://github.com/nrkno/tv-automation-playout-gateway/commit/e39762a))
* take mediascanner host + port from core, replicate pouchdb ([e5fa674](https://github.com/nrkno/tv-automation-playout-gateway/commit/e5fa674))
* upd tsr dep ([2596dba](https://github.com/nrkno/tv-automation-playout-gateway/commit/2596dba))
* updated core-integration dep, introducing autoSubscribe ([4589eee](https://github.com/nrkno/tv-automation-playout-gateway/commit/4589eee))
* updated TSR dep (containing the big timeline refactoring) ([74ef284](https://github.com/nrkno/tv-automation-playout-gateway/commit/74ef284))
* updated tsr dependency ([be0e7dc](https://github.com/nrkno/tv-automation-playout-gateway/commit/be0e7dc))
* updated tsr dependency ([0820f05](https://github.com/nrkno/tv-automation-playout-gateway/commit/0820f05))
* updated TSR dependency (implementing lawo) ([fa79697](https://github.com/nrkno/tv-automation-playout-gateway/commit/fa79697))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.5.1...v0.5.2) (2018-08-29)


### Bug Fixes

* tsr: timeline bugfix & callback fix ([0a1a43b](https://github.com/nrkno/tv-automation-playout-gateway/commit/0a1a43b))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.5.0...v0.5.1) (2018-08-29)


### Bug Fixes

* resync when reconnecting ([1f7dab1](https://github.com/nrkno/tv-automation-playout-gateway/commit/1f7dab1))
* **media scanner:** safe document id ([9f41872](https://github.com/nrkno/tv-automation-playout-gateway/commit/9f41872))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.4.0...v0.5.0) (2018-08-28)


### Bug Fixes

* tsr-dep, fixing a memory leak ([62d7843](https://github.com/nrkno/tv-automation-playout-gateway/commit/62d7843))


### Features

* upd tsr dep ([2596dba](https://github.com/nrkno/tv-automation-playout-gateway/commit/2596dba))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.3.1...v0.4.0) (2018-08-27)


### Bug Fixes

* add localTimestamp to logger output ([8ae2c01](https://github.com/nrkno/tv-automation-playout-gateway/commit/8ae2c01))


### Features

* refactored getting of timeline, added getSnapshot, for debugging ([6df71de](https://github.com/nrkno/tv-automation-playout-gateway/commit/6df71de))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.3.0...v0.3.1) (2018-08-27)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.2.1...v0.3.0) (2018-08-23)


### Bug Fixes

* updated tsr & core-integration dependency ([7cc9386](https://github.com/nrkno/tv-automation-playout-gateway/commit/7cc9386))
* **logging:** More reasonable logging of the statObj evaluation ([422cd4f](https://github.com/nrkno/tv-automation-playout-gateway/commit/422cd4f))
* added missing core onError handler ([d5b0f01](https://github.com/nrkno/tv-automation-playout-gateway/commit/d5b0f01))
* added option to fully disable statObj ([c9794bb](https://github.com/nrkno/tv-automation-playout-gateway/commit/c9794bb))
* build-script: yarn.lock file should not be removed and if updates are needed, that shoud fail the build process. ([d83584d](https://github.com/nrkno/tv-automation-playout-gateway/commit/d83584d))
* changed statobj id ([1920020](https://github.com/nrkno/tv-automation-playout-gateway/commit/1920020))
* error logging ([76f3749](https://github.com/nrkno/tv-automation-playout-gateway/commit/76f3749))
* handle promises appropriately ([d06635c](https://github.com/nrkno/tv-automation-playout-gateway/commit/d06635c))
* lint & build ([8824435](https://github.com/nrkno/tv-automation-playout-gateway/commit/8824435))
* persist media through a restart ([627bd94](https://github.com/nrkno/tv-automation-playout-gateway/commit/627bd94))
* persist media through a restart ([3558c8a](https://github.com/nrkno/tv-automation-playout-gateway/commit/3558c8a))
* remove unused methods ([1711b9d](https://github.com/nrkno/tv-automation-playout-gateway/commit/1711b9d))
* removed console.log ([2be9ff8](https://github.com/nrkno/tv-automation-playout-gateway/commit/2be9ff8))
* removed console.log ([05fdf46](https://github.com/nrkno/tv-automation-playout-gateway/commit/05fdf46))
* updated tsr & core-integration dependency ([0b04237](https://github.com/nrkno/tv-automation-playout-gateway/commit/0b04237))


### Features

* **media scanner:** basic reconnection logic without replication ([d3ccd86](https://github.com/nrkno/tv-automation-playout-gateway/commit/d3ccd86))
* log successful commands ([86f6f8a](https://github.com/nrkno/tv-automation-playout-gateway/commit/86f6f8a))
* script + function to upload a still to the atem ([18446f5](https://github.com/nrkno/tv-automation-playout-gateway/commit/18446f5))
* script + function to upload a still to the atem ([e39762a](https://github.com/nrkno/tv-automation-playout-gateway/commit/e39762a))
* updated TSR dep (containing the big timeline refactoring) ([74ef284](https://github.com/nrkno/tv-automation-playout-gateway/commit/74ef284))
* updated tsr dependency ([0820f05](https://github.com/nrkno/tv-automation-playout-gateway/commit/0820f05))
* updated tsr dependency ([be0e7dc](https://github.com/nrkno/tv-automation-playout-gateway/commit/be0e7dc))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.2.0...v0.2.1) (2018-08-03)


### Bug Fixes

* (troubleshooting) reenabling mediaScanner, but with replication disabled ([752f86c](https://github.com/nrkno/tv-automation-playout-gateway/commit/752f86c))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.1.0...v0.2.0) (2018-08-03)


### Bug Fixes

* **media scanner:** catch http request errors ([9628e4a](https://github.com/nrkno/tv-automation-playout-gateway/commit/9628e4a))
* catch promises ([22db4bc](https://github.com/nrkno/tv-automation-playout-gateway/commit/22db4bc))
* crash when missing mediascanner setting ([76fbf1c](https://github.com/nrkno/tv-automation-playout-gateway/commit/76fbf1c))
* logging ([e3cb0d8](https://github.com/nrkno/tv-automation-playout-gateway/commit/e3cb0d8))
* updated dependencies ([97f1852](https://github.com/nrkno/tv-automation-playout-gateway/commit/97f1852))
* versions of non-parent processes ([0d08e9e](https://github.com/nrkno/tv-automation-playout-gateway/commit/0d08e9e))


### Features

* addded versions to init data ([6641bf1](https://github.com/nrkno/tv-automation-playout-gateway/commit/6641bf1))
* added statObj support, an attempt to avoid playing incomplete timelines ([cf48e16](https://github.com/nrkno/tv-automation-playout-gateway/commit/cf48e16))
* configurable media scanner host / port ([d142996](https://github.com/nrkno/tv-automation-playout-gateway/commit/d142996))
* take mediascanner host + port from core, replicate pouchdb ([e5fa674](https://github.com/nrkno/tv-automation-playout-gateway/commit/e5fa674))



<a name="0.1.0"></a>
# 0.1.0 (2018-08-02)


### Bug Fixes

* added tracing of timeline ([b7b8120](https://github.com/nrkno/tv-automation-playout-gateway/commit/b7b8120))
* better faster stronger timeline transform ([0612f96](https://github.com/nrkno/tv-automation-playout-gateway/commit/0612f96))
* clearing observers properly ([0679f66](https://github.com/nrkno/tv-automation-playout-gateway/commit/0679f66))
* update libs to fix atem supersource boxes ([dba8948](https://github.com/nrkno/tv-automation-playout-gateway/commit/dba8948))
* Update tsr and supertimeline ([0d76c2c](https://github.com/nrkno/tv-automation-playout-gateway/commit/0d76c2c))
* updated tsr dependency ([43a7069](https://github.com/nrkno/tv-automation-playout-gateway/commit/43a7069))
* updated tsr dependency ([89c38b9](https://github.com/nrkno/tv-automation-playout-gateway/commit/89c38b9))
* use axios instead of native http ([d81e5e7](https://github.com/nrkno/tv-automation-playout-gateway/commit/d81e5e7))


### Features

* Add segmentLineItemPlaybackStarted callback ([91c99e0](https://github.com/nrkno/tv-automation-playout-gateway/commit/91c99e0))
* added -disableWatchdog option ([4ce8ae1](https://github.com/nrkno/tv-automation-playout-gateway/commit/4ce8ae1))
* added watchDog ([3f55c7b](https://github.com/nrkno/tv-automation-playout-gateway/commit/3f55c7b))
* casparcg restart routine ([415387d](https://github.com/nrkno/tv-automation-playout-gateway/commit/415387d))
* kill process when initialization fails ([bca0b51](https://github.com/nrkno/tv-automation-playout-gateway/commit/bca0b51))
* media-scanner add example for loading the whole database ([422563b](https://github.com/nrkno/tv-automation-playout-gateway/commit/422563b))
* Prototype media-scanner connection and typings ([59a9927](https://github.com/nrkno/tv-automation-playout-gateway/commit/59a9927))
* updated core-integration dep, introducing autoSubscribe ([4589eee](https://github.com/nrkno/tv-automation-playout-gateway/commit/4589eee))
* updated TSR dependency (implementing lawo) ([fa79697](https://github.com/nrkno/tv-automation-playout-gateway/commit/fa79697))
