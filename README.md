
[![Build Status](https://travis-ci.com/SamuelSchepp/unitybuildtool.svg?token=mPf4pp97WLfBs1nzWpsV&branch=master)](https://travis-ci.com/SamuelSchepp/unitybuildtool)

# Unity Build Tool

![](https://user-images.githubusercontent.com/11752441/35460637-00360bec-02e5-11e8-9a6e-b9381afc686d.png)

A build tool for Unity3D. Define targets with specific Unity3D versions.

Use this tool on a pre-configured Unity3D CI environment to manage build targets and unit testing. The tool will send all unity output to stdout by tailing the unity log file.

:warning: Only use this tool in a project with source control since some build settings will be overwritten. :warning:

## Features

* Easy use in CI environment, because
  * Ubt waits unitl all tasks are done
  * Editor log is printed to stdout
* Version management via new Unity Hub ([more information](https://blogs.unity3d.com/2018/01/24/streamline-your-workflow-introducing-unity-hub-beta/))
* Cross platform (Windows, macOS)
* Integrated Unity3D editor plugin for fast test builds

## Install

```bash
npm install -g SamuelSchepp/unitybuildtool
```

## Usage

Run the following commands in a Unity3D project root folder.

### Init project with `ubt.json` file

```bash
ubt init
```

```javascript
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

### Target configuration options

| Parameter | Values | Description |
| --------- | ------ | ----------- |
| platform | `ios` `android` `windows` `mac` `webgl` | |
| developmentBuild | `true`  `false` | |
| artifactName | eg. `my_fun_project_devbuild` | Any string 
| unityVersion | eg. `2017.2.0f3` | Any Unity version installed via Hub 
| test | `true` `false` | Runs playmode tests and quits |
| solution | `true` `false` | Creates \*.sln file and quits |

### Install support scripts into project
```bash
ubt install
```

The tool will copy a Unity editor script file to the project.
Add UnityBuildTool.cs to gitignore.

You will also find a new MenuBar entry for fast test builds.

<img src="https://user-images.githubusercontent.com/11752441/35460976-1fcc30fc-02e6-11e8-881d-d4efe7eb6175.png" width=154/>

### Build all targets

```bash
ubt run
```

The build artifact is stored at `<unity_project>/build/<target>/<artifactName>`

### Build specific target

```bash
ubt run -t windows
```

## Support 

### Host OS

* Windows
* macOS

### Unity Hub versions

Version 0.11.0 (0.11.0)

### Build platforms

* iOS
* Android
* Windows
* macOS
* WebGL

### Help

```bash
ubt --help
```
