# Unity Build Tool

[![Build Status](https://travis-ci.com/SamuelSchepp/unitybuildtool.svg?token=mPf4pp97WLfBs1nzWpsV&branch=master)](https://travis-ci.com/SamuelSchepp/unitybuildtool)

![](https://user-images.githubusercontent.com/11752441/35460637-00360bec-02e5-11e8-9a6e-b9381afc686d.png)

A build tool for Unity3D. Define targets with specific Unity3D versions.

Use this tool on a pre-configured Unity3D CI environment to manage build targets and unit testing. The tool will send all unity output to stdout by tailing the unity log file.

:warning: Only use this tool in a project with source control since some build settings will be overwritten. :warning:

Only Unity Hub (https://blogs.unity3d.com/2018/01/24/streamline-your-workflow-introducing-unity-hub-beta/) Unity3D versions can be defined with `unityVersion`.

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
      "unityVersion": "2017.2.0f3"
    },
    "test": {
      "unityVersion": "2017.2.0f3",
      "test": true
    }
  }
}
```

### Install support scripts into project

`ubt install`

The tool will copy a Unity editor script file to the project.
Add UnityBuildTool.cs to gitignore.

### Build all targets

`ubt run`

The build artifact is stored at `<unity_project>/build/<target>/<artifactName>`

### Build specific target

`ubt run -t windows`

## Support 

### Host OS

* Windows
* macOS

### Unity Hub versions

Version 0.11.0 (0.11.0)

### Build platforms

* iOS `ios`
* Android `android`
* Windows `windows`
* macOS `mac`
* WebGL `webgl`

Support for playmode tests by settings `test`to true in target.

### Help

`ubt --help`
