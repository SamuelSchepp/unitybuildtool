# Unity Build Tool

[![Build Status](https://travis-ci.com/SamuelSchepp/unitybuildtool.svg?token=mPf4pp97WLfBs1nzWpsV&branch=master)](https://travis-ci.com/SamuelSchepp/unitybuildtool)

A build tool for unity. Define targets with specific Unity3D versions. On build, the tool will copy a Unity editor script file to the project and will call the specific static methods.

## Usage

### Init project with `ubt.json` file

`ubt init`

```json
{
  "targets": {
    "ios": {
      "platform": "ios",
      "unityPath": "/Applications/Unity 2017.3.0f3/Unity.app/Contents/MacOS/Unity"
    },
    "android": {
      "platform": "android",
      "unityPath": "D:\\Program Files\\Unity 2017.3.0f3\\Editor\\Unity.exe"
    }
  }
}
```

### Build all targets

`ubt build`

### Build specific target

`ubt build -t windows`

### Help

`ubt --help`