# Unity Build Tool

[![Build Status](https://travis-ci.com/SamuelSchepp/unitybuildtool.svg?token=mPf4pp97WLfBs1nzWpsV&branch=master)](https://travis-ci.com/SamuelSchepp/unitybuildtool)

A build tool for unity. Define targets with specific Unity3D versions.

## Usage

### Init project with `ubt.json` file

`ubt init`

```json
{
  "targets": {
    "mac_dev": {
      "platform": "mac",
      "developmentBuild": true,
      "artifactName": "mac_dev",
      "unityPath": "/Applications/Unity 2017.2.0f3/Unity.app/Contents/MacOS/Unity"
    },
    "test": {
      "unityPath": "/Applications/Unity 2017.2.0f3/Unity.app/Contents/MacOS/Unity",
      "test": true
    }
  }
}
```

### Install support scripts into project

`ubt install`

The tool will copy a Unity editor script file to the project.

### Build all targets

`ubt run`

### Build specific target

`ubt run -t windows`

### Supported Unity3D versions
Unity 2017.x

### Supported build platforms

* iOS
* Android
* Windows
* macOS
* WebGL

Support for playmode tests by settings `test`to true in target.

### Help

`ubt --help`