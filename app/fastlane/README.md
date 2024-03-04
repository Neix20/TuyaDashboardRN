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



### ios pushToTestFlight

```sh
[bundle exec] fastlane ios pushToTestFlight
```



----


## Android

### android genYatuAab

```sh
[bundle exec] fastlane android genYatuAab
```

Build Yatu AAB

### android genYatuLiteAab

```sh
[bundle exec] fastlane android genYatuLiteAab
```

Build Yatu Lite AAB

### android genYatuViewerAab

```sh
[bundle exec] fastlane android genYatuViewerAab
```

Build Yatu Viewer AAB

### android genYatuApk

```sh
[bundle exec] fastlane android genYatuApk
```

Build Yatu APK

### android genYatuLiteApk

```sh
[bundle exec] fastlane android genYatuLiteApk
```

Build Yatu Lite APK

### android genYatuViewerApk

```sh
[bundle exec] fastlane android genYatuViewerApk
```

Build Yatu Viewer APK

### android pushToPlayStore

```sh
[bundle exec] fastlane android pushToPlayStore
```

Release for the Android production

### android testCommand

```sh
[bundle exec] fastlane android testCommand
```

Test command

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
