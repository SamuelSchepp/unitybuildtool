# Unity Build Tool

[![Build Status](https://travis-ci.com/SamuelSchepp/unitybuildtool.svg?token=mPf4pp97WLfBs1nzWpsV&branch=master)](https://travis-ci.com/SamuelSchepp/unitybuildtool)

A build tool for unity. Define targets with specific Unity3D versions.

Use this tool on a pre-configured Unity3D CI environment to manage build targets and unit testing. The tool will send all unity output to stdout by tailing the unity log file.

## Install

* `npm install -g SamuelSchepp/unitybuildtool`

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

## Support 

### Host OS

* Windows
* macOS
* (untested) Linux

### Unity3D versions

Unity 2017.x

### Build platforms

* iOS
* Android
* Windows
* macOS
* WebGL

Support for playmode tests by settings `test`to true in target.

### Help

`ubt --help`