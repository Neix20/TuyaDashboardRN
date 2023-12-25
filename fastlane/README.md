fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios genIpa

```sh
[bundle exec] fastlane ios genIpa
```



----


## Android

### android genDevApk

```sh
[bundle exec] fastlane android genDevApk
```

Build Android Developer APK

### android pushToPlayStore

```sh
[bundle exec] fastlane android pushToPlayStore
```

Release for the Android production

### android testPush

```sh
[bundle exec] fastlane android testPush
```

Test Push To Playstore

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
