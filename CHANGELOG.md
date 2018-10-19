# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.0.0"></a>
# [0.0.0](https://github.com/nrkno/tv-automation-playout-gateway/compare/v0.11.2...v0.0.0) (2018-10-19)


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
