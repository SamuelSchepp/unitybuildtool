#!/usr/bin/env node
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GlobalParameters_1 = __webpack_require__(5);
class Logger {
    static logUBT(msg) {
        this.logPrefix(msg, "UBT");
    }
    static logUnity(target, msg) {
        this.logPrefix(msg, `Unity3D ${target}`);
    }
    static logError(msg) {
        this.logPrefix(msg, "ERROR");
    }
    static logPrefix(msg, prefix) {
        if (GlobalParameters_1.GlobalParameters.Silent) {
            return;
        }
        const date = new Date();
        msg.split("\n").forEach(line => {
            console.log(`[${prefix}] ${line}`);
        });
    }
    static boxed(msg) {
        if (GlobalParameters_1.GlobalParameters.Silent) {
            return;
        }
        var lines = "";
        for (let i = 0; i < msg.length; i++) {
            lines += "─";
        }
        console.log(`┌─${lines}─┐`);
        console.log(`│ ${msg} │`);
        console.log(`└─${lines}─┘`);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=Logger.js.map

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const os = __webpack_require__(9);
const fs = __webpack_require__(0);
const Logger_1 = __webpack_require__(1);
const UnityBuildTool_cs_1 = __webpack_require__(10);
const path = __webpack_require__(3);
const TargetDataReader_1 = __webpack_require__(6);
const AppDirectory = __webpack_require__(12);
class Helper {
    static getVersion() {
        return "0.0.1";
    }
    static RunForPlatform(windows, mac) {
        if (this.IsWindows()) {
            windows();
        }
        else if (this.IsMac()) {
            mac();
        }
        else {
            throw Error("Unknwon platform: " + os.platform());
        }
    }
    static CopyUnityBuildScript() {
        this.AssertUnityProjectFolder();
        const p = path.resolve(`Assets`, `Editor`);
        if (!fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
        const dest = path.resolve(p, `${Helper.BuildToolCSharpClass}.cs`);
        Logger_1.Logger.logUBT(`Writing -> ${dest}`);
        fs.writeFileSync(dest, UnityBuildTool_cs_1.UnityBuildTool.Base64, { encoding: "base64" });
    }
    static CreateLogFile() {
        fs.writeFileSync(Helper.UnityLogFilePath, "");
    }
    static IsWindows() {
        return os.platform() === "win32";
    }
    static IsMac() {
        return os.platform() === "darwin";
    }
    static GetUnityPathForTarget(target) {
        let version = TargetDataReader_1.TargetDataReader.GetUnityVersion(target);
        return Helper.GetUnityPathForVersion(version);
    }
    static GetUnityPathForVersion(versionID) {
        const obj = this.GetUnityHubEditorsData();
        let p = "";
        if (!Object.keys(obj).includes(versionID)) {
            this.RunForPlatform(() => {
                p = `C:\\Program Files\\Unity\\Hub\\Editor\\${versionID}\\Editor\\Unity.exe`;
            }, () => {
                p = `/Applications/Unity/Hub/Editor/${versionID}/Unity.app`;
            });
        }
        else {
            try {
                p = obj[versionID][`location`];
            }
            catch (err) {
                throw Error(`Unity Hub database is not readable (new Unity Hub version?).`);
            }
            if (p == undefined) {
                throw Error("Unity Hub database is not readable (new Unity Hub version?).");
            }
        }
        this.RunForPlatform(() => { }, () => {
            p = path.resolve(p, "Contents", "MacOS", "Unity");
        });
        if (!fs.existsSync(p)) {
            throw Error(`Unity version ${versionID} not installed via Unity Hub. (${p})`);
        }
        return p;
    }
    static GetUnityHubEditorsData() {
        let p = "";
        this.RunForPlatform(() => {
            const dirs = new AppDirectory({
                appName: "UnityHub",
                appAuthor: ".",
                useRoaming: true,
            });
            p = path.resolve(dirs.userData(), `editors.json`);
        }, () => {
            const dirs = new AppDirectory('UnityHub');
            p = path.resolve(dirs.userData(), `editors.json`);
        });
        if (!fs.existsSync(p)) {
            throw Error(`Unity Hub database does not exist. (${p})`);
        }
        try {
            return JSON.parse(fs.readFileSync(p).toString());
        }
        catch (err) {
            throw Error(`Couldn't parse Unity Hub database (${err})`);
        }
    }
    static GetTargetData(target) {
        let targets = Object.keys(this.GetTargetList());
        if (!targets.includes(target)) {
            throw Error(`Target ${target} not found. Found targets are: ${targets.join(", ")}`);
        }
        return this.GetTargetList()[target];
    }
    static GetTargetList() {
        if (!Object.keys(Helper.GetUBTJson()).includes(`targets`)) {
            throw Error(`No target definitions found. Add the top-level property "targets" to ${Helper.ubtFileName}`);
        }
        return Helper.GetUBTJson()[`targets`];
    }
    static GetUBTJson() {
        if (Helper.UBTJson == undefined) {
            if (!fs.existsSync(Helper.ubtFileName)) {
                throw Error(`File ${Helper.ubtFileName} not found in working directory.`);
            }
            try {
                Helper.UBTJson = JSON.parse(fs.readFileSync(Helper.ubtFileName).toString());
            }
            catch (err) {
                throw Error(`Couldn't read ${Helper.ubtFileName} (${err})`);
            }
        }
        try {
            fs.writeFileSync(Helper.ubtFileName, JSON.stringify(Helper.UBTJson, null, 2));
        }
        catch (err) {
            Logger_1.Logger.logUBT(`Warning: Unable to rewrite ${Helper.ubtFileName}.`);
        }
        return Helper.UBTJson;
    }
    static AssertUnityProjectFolder() {
        if (!fs.existsSync(`Assets`)) {
            throw Error(`The current folder is not the root of a Unity project (no assets folder).`);
        }
    }
}
Helper.UBTJson = undefined;
Helper.ubtFileName = "ubt.json";
Helper.BuildToolCSharpClass = "UnityBuildTool";
Helper.UnityLogFilePath = "unity_log.txt";
exports.Helper = Helper;
//# sourceMappingURL=Helper.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GlobalParameters {
}
GlobalParameters.NoLog = false;
GlobalParameters.Silent = false;
GlobalParameters.Interactive = false;
exports.GlobalParameters = GlobalParameters;
//# sourceMappingURL=GlobalParameters.js.map

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __webpack_require__(11);
const Helper_1 = __webpack_require__(2);
class TargetDataReader {
    static ReadField(field, target, validator, defaultValue = undefined) {
        let targetData = Helper_1.Helper.GetTargetData(target);
        if (!Object.keys(targetData).includes(field)) {
            if (defaultValue == undefined) {
                throw Error(`Property ${field} of target ${target} not set.`);
            }
            else {
                return defaultValue;
            }
        }
        const value = targetData[field];
        if (!validator(value)) {
            throw Error(`Property ${field} has wrong data type.`);
        }
        return value;
    }
    static IsTest(target) {
        return this.ReadField("test", target, util_1.isBoolean, false);
    }
    static IsDevelopmentBuild(target) {
        return this.ReadField("developmentBuild", target, util_1.isBoolean, false);
    }
    static GetArtifactName(target) {
        return this.ReadField("artifactName", target, util_1.isString);
    }
    static GetUnityVersion(target) {
        return this.ReadField("unityVersion", target, util_1.isString);
    }
    static GetPlatform(target) {
        return this.ReadField("platform", target, util_1.isString);
    }
}
exports.TargetDataReader = TargetDataReader;
//# sourceMappingURL=TargetDataReader.js.map

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __webpack_require__(1);
const Helper_1 = __webpack_require__(2);
const Tool_1 = __webpack_require__(14);
const GlobalParameters_1 = __webpack_require__(5);
const program = __webpack_require__(17);
Logger_1.Logger.boxed(`Unity Build Tool ${Helper_1.Helper.getVersion()}`);
program
    .command('init')
    .description('Init project with ubt.json file')
    .action(function () {
    Tool_1.Tool.init();
});
program
    .command('install')
    .description(`Installs build tools into Unity3D project`)
    .action((options) => {
    Tool_1.Tool.install();
});
program
    .command('run')
    .description(`Run all targets as described in ${Helper_1.Helper.ubtFileName}`)
    .option("-t, --target [target]", "Specifiy target")
    .option("-i, --interactive", "Open Unity GUI to be able to interact with modal windows.")
    .action((options) => {
    Promise.resolve()
        .then(() => {
        if (options["interactive"]) {
            GlobalParameters_1.GlobalParameters.Interactive = true;
        }
        if (options["target"]) {
            return Tool_1.Tool.run(options["target"]);
        }
        else {
            return Tool_1.Tool.runAll();
        }
    })
        .catch((error) => {
        Logger_1.Logger.logUBT(`Run failed: ${error}`);
        process.exit(1);
    });
});
program
    .command('list')
    .description(`List all targets as described in ${Helper_1.Helper.ubtFileName}`)
    .action((options) => {
    Promise.resolve()
        .then(() => {
        Logger_1.Logger.logUBT(`${Object.keys(Helper_1.Helper.GetTargetList()).join(", ")}.`);
    })
        .catch((error) => {
        Logger_1.Logger.logUBT(`List failed: ${error}`);
        process.exit(1);
    });
});
program
    .option("-l, --nolog", "Hides Unity log. Default application log will still be visible.")
    .option("-s, --silent", "Don't show any log.")
    .parse(process.argv);
if (program.nolog) {
    GlobalParameters_1.GlobalParameters.NoLog = true;
}
if (program.silent) {
    GlobalParameters_1.GlobalParameters.Silent = true;
}
//# sourceMappingURL=index.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class UnityBuildTool {
}
UnityBuildTool.Base64 = "dXNpbmcgU3lzdGVtOw0KdXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7DQp1c2luZyBTeXN0ZW0uRGlhZ25vc3RpY3M7DQp1c2luZyBTeXN0ZW0uTGlucTsNCnVzaW5nIFN5c3RlbS5OZXQuTmV0d29ya0luZm9ybWF0aW9uOw0KdXNpbmcgVW5pdHlFZGl0b3I7DQp1c2luZyBVbml0eUVuZ2luZTsNCg0KbmFtZXNwYWNlIEVkaXRvcg0Kew0KCXB1YmxpYyBzdGF0aWMgY2xhc3MgVW5pdHlCdWlsZFRvb2wgew0KDQoJCXByaXZhdGUgc3RhdGljIERpY3Rpb25hcnk8c3RyaW5nLCBCdWlsZFRhcmdldEdyb3VwPiBUYXJnZXRHcm91cHMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIEJ1aWxkVGFyZ2V0R3JvdXA+KCkgew0KCQkJeyJpb3MiLCBCdWlsZFRhcmdldEdyb3VwLmlPU30sDQoJCQl7ImFuZHJvaWQiLCBCdWlsZFRhcmdldEdyb3VwLkFuZHJvaWR9LA0KCQkJeyJ3aW5kb3dzIiwgQnVpbGRUYXJnZXRHcm91cC5TdGFuZGFsb25lfSwNCgkJCXsibWFjIiwgQnVpbGRUYXJnZXRHcm91cC5TdGFuZGFsb25lfSwNCgkJCXsid2ViZ2wiLCBCdWlsZFRhcmdldEdyb3VwLldlYkdMfQ0KCQl9Ow0KDQoJCXByaXZhdGUgc3RhdGljIERpY3Rpb25hcnk8c3RyaW5nLCBCdWlsZFRhcmdldD4gVGFyZ2V0cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQnVpbGRUYXJnZXQ+KCkgew0KCQkJeyJpb3MiLCBCdWlsZFRhcmdldC5pT1N9LA0KCQkJeyJhbmRyb2lkIiwgQnVpbGRUYXJnZXQuQW5kcm9pZH0sDQoJCQl7IndpbmRvd3MiLCBCdWlsZFRhcmdldC5TdGFuZGFsb25lV2luZG93czY0fSwNCgkJCXsid2ViZ2wiLCBCdWlsZFRhcmdldC5XZWJHTH0sDQoJCQkjaWYgVU5JVFlfMjAxN18yIHx8IFVOSVRZXzIwMTdfMQ0KCQkJeyJtYWMiLCBCdWlsZFRhcmdldC5TdGFuZGFsb25lT1NYVW5pdmVyc2FsfQ0KCQkJI2Vsc2UNCgkJCXsibWFjIiwgQnVpbGRUYXJnZXQuU3RhbmRhbG9uZU9TWH0NCgkJCSNlbmRpZg0KCQl9Ow0KDQoJCXByaXZhdGUgc3RhdGljIHN0cmluZ1tdIEdldFNjZW5lUGF0aHMoKSB7DQoJCQlyZXR1cm4gRWRpdG9yQnVpbGRTZXR0aW5ncy5zY2VuZXMuU2VsZWN0KChzY2VuZSkgPT4gc2NlbmUucGF0aCkuVG9BcnJheSgpOw0KCQl9DQoNCgkJcHJpdmF0ZSBzdGF0aWMgdm9pZCBQZXJmb3JtQnVpbGQoc3RyaW5nIHRhcmdldE5hbWUsIHN0cmluZyBhcnRpZmFjdE5hbWUsIHN0cmluZyBwbGF0Zm9ybSwgYm9vbCBkZXZlbG9wbWVudEJ1aWxkKSB7DQoJCQl2YXIgb3B0aW9ucyA9IEJ1aWxkT3B0aW9ucy5Ob25lOw0KCQkJaWYgKGRldmVsb3BtZW50QnVpbGQpIHsNCgkJCQlvcHRpb25zID0gb3B0aW9ucyB8IEJ1aWxkT3B0aW9ucy5EZXZlbG9wbWVudDsNCgkJCX0NCg0KCQkJUGxheWVyU2V0dGluZ3MuQW5kcm9pZC5rZXlhbGlhc05hbWUgPSAiIjsNCgkJCVBsYXllclNldHRpbmdzLkFuZHJvaWQua2V5c3RvcmVOYW1lID0gIiI7DQoNCgkJCUVkaXRvclVzZXJCdWlsZFNldHRpbmdzLmRldmVsb3BtZW50ID0gZGV2ZWxvcG1lbnRCdWlsZDsNCgkJCUVkaXRvclVzZXJCdWlsZFNldHRpbmdzLlN3aXRjaEFjdGl2ZUJ1aWxkVGFyZ2V0KFRhcmdldEdyb3Vwc1twbGF0Zm9ybV0sIFRhcmdldHNbcGxhdGZvcm1dKTsNCg0KCQkJaWYgKHBsYXRmb3JtID09ICJhbmRyb2lkIikgew0KCQkJCWFydGlmYWN0TmFtZSA9IGFydGlmYWN0TmFtZSArICIuYXBrIjsNCgkJCX0NCgkJCWlmIChwbGF0Zm9ybSA9PSAid2luZG93cyIpIHsNCgkJCQlhcnRpZmFjdE5hbWUgPSBhcnRpZmFjdE5hbWUgKyAiLmV4ZSI7DQoJCQl9DQoNCgkJCUJ1aWxkUGlwZWxpbmUuQnVpbGRQbGF5ZXIoR2V0U2NlbmVQYXRocygpLCAiYnVpbGQvIiArIHRhcmdldE5hbWUgKyAiLyIgKyBhcnRpZmFjdE5hbWUsIFRhcmdldHNbcGxhdGZvcm1dLCBvcHRpb25zKTsNCgkJfQ0KDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBQZXJmb3JtKCkgew0KCQkJaWYgKCFUYXJnZXRHcm91cHMuQ29udGFpbnNLZXkoUmVhZFBsYXRmb3JtKCkpIHx8ICFUYXJnZXRzLkNvbnRhaW5zS2V5KFJlYWRQbGF0Zm9ybSgpKSkgew0KCQkJCXRocm93IG5ldyBFeGNlcHRpb24oIlBsYXRmb3JtICIgKyBSZWFkUGxhdGZvcm0oKSArICIgbm90IHN1cHBvcnRlZCIpOw0KCQkJfQ0KCQkJZWxzZSB7DQoJCQkJUGVyZm9ybUJ1aWxkKFJlYWRUYXJnZXROYW1lKCksIFJlYWRBcnRpZmFjdE5hbWUoKSwgUmVhZFBsYXRmb3JtKCksIFJlYWREZXZlbG9wbWVudEJ1aWxkKCkpOw0KCQkJfQ0KCQl9DQoNCgkJcHJpdmF0ZSBzdGF0aWMgc3RyaW5nIFJlYWRQbGF0Zm9ybSgpIHsNCgkJCXZhciBhcmdzID0gRW52aXJvbm1lbnQuR2V0Q29tbWFuZExpbmVBcmdzKCk7DQoJCQlyZXR1cm4gYXJnc1thcmdzLkxlbmd0aCAtIDFdOw0KCQl9DQoNCgkJcHJpdmF0ZSBzdGF0aWMgYm9vbCBSZWFkRGV2ZWxvcG1lbnRCdWlsZCgpIHsNCgkJCXZhciBhcmdzID0gRW52aXJvbm1lbnQuR2V0Q29tbWFuZExpbmVBcmdzKCk7DQoJCQl2YXIgZGV2QnVpbGQgPSBhcmdzW2FyZ3MuTGVuZ3RoIC0gMl07DQoJCQlyZXR1cm4gZGV2QnVpbGQuRXF1YWxzKCJ0cnVlIik7DQoJCX0NCg0KCQlwcml2YXRlIHN0YXRpYyBzdHJpbmcgUmVhZEFydGlmYWN0TmFtZSgpIHsNCgkJCXZhciBhcmdzID0gRW52aXJvbm1lbnQuR2V0Q29tbWFuZExpbmVBcmdzKCk7DQoJCQlyZXR1cm4gYXJnc1thcmdzLkxlbmd0aCAtIDNdOw0KCQl9DQoJCQ0KCQlwcml2YXRlIHN0YXRpYyBzdHJpbmcgUmVhZFRhcmdldE5hbWUoKSB7DQoJCQl2YXIgYXJncyA9IEVudmlyb25tZW50LkdldENvbW1hbmRMaW5lQXJncygpOw0KCQkJcmV0dXJuIGFyZ3NbYXJncy5MZW5ndGggLSA0XTsNCgkJfQ0KDQoJCVtNZW51SXRlbSgiVW5pdHlCdWlsZFRvb2wvQnVpbGQgTWFjIiwgZmFsc2UsIDEwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBCdWlsZE1hYygpIHsNCgkJCVBlcmZvcm1CdWlsZCgidGFyZ2V0X21hYyIsICJwcm9qZWN0IiwgIm1hYyIsIHRydWUpOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9CdWlsZCBXaW5kb3dzIiwgZmFsc2UsIDEwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBCdWlsZFdpbmRvd3MoKSB7DQoJCQlQZXJmb3JtQnVpbGQoInRhcmdldF93aW5kb3dzIiwgInByb2plY3QiLCAid2luZG93cyIsIHRydWUpOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9CdWlsZCBXZWJHTCIsIGZhbHNlLCAxMDEpXQ0KCQlwdWJsaWMgc3RhdGljIHZvaWQgQnVpbGRXZWJHTCgpIHsNCgkJCVBlcmZvcm1CdWlsZCgidGFyZ2V0X3dlYmdsIiwgInByb2plY3QiLCAid2ViZ2wiLCB0cnVlKTsNCgkJfQ0KDQoJCVtNZW51SXRlbSgiVW5pdHlCdWlsZFRvb2wvQnVpbGQgaU9TIiwgZmFsc2UsIDEwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBCdWlsZElPUygpIHsNCgkJCVBlcmZvcm1CdWlsZCgidGFyZ2V0X2lvcyIsICJwcm9qZWN0IiwgImlvcyIsIHRydWUpOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9CdWlsZCBBbmRyb2lkIiwgZmFsc2UsIDEwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBCdWlsZEFuZHJvaWQoKSB7DQoJCQlQZXJmb3JtQnVpbGQoInRhcmdldF9hbmRyb2lkIiwgInByb2plY3QiLCAiYW5kcm9pZCIsIHRydWUpOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9DbGVhbiIsIGZhbHNlLCAxMDAxKV0NCgkJcHVibGljIHN0YXRpYyB2b2lkIENsZWFuKCkgew0KCQkJRmlsZVV0aWwuRGVsZXRlRmlsZU9yRGlyZWN0b3J5KCJidWlsZCIpOw0KCQl9DQoJDQoJCVtNZW51SXRlbSgiVW5pdHlCdWlsZFRvb2wvQ3JlYXRlIFNvbHV0aW9uIiwgZmFsc2UsIDEwMDAxKV0NCgkJcHVibGljIHN0YXRpYyB2b2lkIENyZWF0ZVNvbHV0aW9uKCkgew0KCQkJRWRpdG9yQXBwbGljYXRpb24uRXhlY3V0ZU1lbnVJdGVtKCJBc3NldHMvT3BlbiBDIyBQcm9qZWN0Iik7DQoJCX0NCgl9DQp9";
exports.UnityBuildTool = UnityBuildTool;
//# sourceMappingURL=UnityBuildTool.cs.js.map

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(3)
var helpers = __webpack_require__(13)

var userData = function(roaming, platform) {
    var dataPath
      , platform = platform || process.platform
    if (platform === "darwin") {
        dataPath = path.join(process.env.HOME, 'Library', 'Application Support', '{0}')
    } else if (platform === "win32") {
        var sysVariable
        if (roaming) {
            sysVariable = "APPDATA"
        } else {
            sysVariable = "LOCALAPPDATA" // Note, on WinXP, LOCALAPPDATA doesn't exist, catch this later
        }
        dataPath = path.join(process.env[sysVariable] || process.env.APPDATA /*catch for XP*/, '{1}', '{0}')
    } else {
        if (process.env.XDG_DATA_HOME) {
            dataPath = path.join(process.env.XDG_DATA_HOME, '{0}')
        } else {
            dataPath = path.join(process.env.HOME, ".local", "share", "{0}")
        }
    }
    return dataPath
}

/*var siteData = function(platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "darwin") {
        dataPath = path.join("/Library", "Application Support", "{0}")
    } else if (platform === "win32") {
        dataPath = path.join(process.env.PROGRAMDATA, "{1}", "{0}")
    } else {
        if (process.env.XDG_DATA_DIRS) {
            dataPath = process.env.XDG_DATA_DIRS.split((path.delimiter || ':'))[0]
        } else {
            dataPath = path.join("/usr", "local", "share")
        }

        dataPath = path.join(dataPath, "{0}")
    }
    return dataPath
}*/

var userConfig = function(roaming, platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "darwin" || platform === "win32") {
        dataPath = userData(roaming, platform)
    } else {
        if (process.env.XDG_CONFIG_HOME) {
            dataPath = path.join(process.env.XDG_CONFIG_HOME, "{0}")
        } else {
            dataPath = path.join(process.env.HOME, ".config", "{0}")
        }
    }

    return dataPath
}

/*var siteConfig = function(platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "darwin" || platform === "win32") {
        dataPath = siteData(platform)
    } else {
        if (process.env.XDG_CONFIG_HOME) {
            dataPath = process.env.XDG_CONFIG_HOME.split((path.delimiter || ':'))[0]
        } else {
            dataPath = path.join("/etc", "xdg")
        }

        dataPath = path.join(dataPath, "{0}")
    }
    return dataPath
}*/

var userCache = function(platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "win32") {
        dataPath = path.join(process.env.LOCALAPPDATA || process.env.APPDATA, '{1}', '{0}', 'Cache')
    } else if (platform === "darwin") {
        dataPath = path.join(process.env.HOME, 'Library', 'Caches', '{0}')
    } else {
        if (process.env.XDG_CACHE_HOME) {
            dataPath = path.join(process.env.XDG_CACHE_HOME, '{0}')
        } else {
            dataPath = path.join(process.env.HOME, '.cache', '{0}')
        }
    }
    return dataPath
}

var userLogs = function(platform) {
    var dataPath
      , platform = platform || process.platform

    if (platform === "win32") {
        dataPath = path.join(userData(false, platform), 'Logs')
    } else if (platform === "darwin") {
        dataPath = path.join(process.env.HOME, 'Library', 'Logs', '{0}')
    } else {
        dataPath = path.join(userCache(platform), 'log')
    }
    return dataPath
}

function AppDirectory(options) {
    if (helpers.instanceOf(options, String)) {
        options = {appName: options}
    }

    // substitution order:
    // {0} - appName
    // {1} - appAuthor

    this.appName = options.appName
    this.appAuthor = options.appAuthor || options.appName
    this.appVersion = options.appVersion || null
    this._useRoaming = options.useRoaming || false
    this._platform  = options.platform || null

    this._setTemplates()
}

AppDirectory.prototype = {
    _setTemplates: function() {
        this._userDataTemplate = userData(this._useRoaming, this._platform)
        /*this._siteDataTemplate = siteData(this._platform)*/
        this._userConfigTemplate = userConfig(this._useRoaming, this._platform)
        /*this._siteConfigTempalte = siteConfig(this._platform)*/
        this._userCacheTemplate = userCache(this._platform)
        this._userLogsTemplate = userLogs(this._platform)
    },
    get useRoaming() {
        return this._useRoaming
    },
    set useRoaming(bool) {
        this._useRoaming = bool
        this._setTemplates()
    },
    get platform() {
        return this._platform
    },
    set platform(str) {
        this._platform = str
        this._setTemplates()
    },
    userData: function() {
        var dataPath = this._userDataTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    siteData: function() {
        var dataPath = this._siteDataTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    userConfig: function() {
        var dataPath = this._userConfigTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    siteConfig: function() {
        var dataPath = this._siteConfigTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    userCache: function() {
        var dataPath = this._userCacheTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    },
    userLogs: function() {
        var dataPath = this._userLogsTemplate
        if (this.appVersion !== null) {
            var dataPath = path.join(dataPath, this.appVersion)
        }
        return helpers.formatStr(dataPath, this.appName, this.appAuthor)
    }

}

module.exports = AppDirectory


/***/ }),
/* 13 */
/***/ (function(module, exports) {

/* This module contains helpers for appdirectory
 *
 * instanceOf(object, constructor)
 *    - determines if an object is an instance of
 *      a constructor
 *    - ignores distinction between objects and
 *      literals - converts all literals into
 *      their object counterparts
 *    - returns a boolean
 */

var instanceOf = function(object, constructor) {
  // If object is a string/array/number literal,
  // turn it into a 'real' object
  if (typeof object != "object") {
    object = new object.constructor(object)
  }

  // Iterate up the object's prototype chain
  while (object != null) {
    if (object == constructor.prototype) {
      // We've found the correct prototype!
      return true
    }

    // Next prototype up
    object = Object.getPrototypeOf(object)
  }

  // Nothing found.
  return false
}

var formatStr = function(format) {
  // This function has been stolen liberally from 
  // http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
  var args = Array.prototype.slice.call(arguments, 1)
  return format.replace(/{(\d+)}/g, function(match, number)  {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
  })
}

module.exports.instanceOf = instanceOf
module.exports.formatStr= formatStr

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __webpack_require__(1);
const Helper_1 = __webpack_require__(2);
const fs = __webpack_require__(0);
const child_process_1 = __webpack_require__(4);
const Process_1 = __webpack_require__(15);
const path = __webpack_require__(3);
const { spawn } = __webpack_require__(4);
class Tool {
    static init() {
        Helper_1.Helper.AssertUnityProjectFolder();
        Logger_1.Logger.logUBT(`Initializing ${Helper_1.Helper.ubtFileName} @ ${process.cwd()}`);
        const data = JSON.stringify({
            targets: {
                mac_dev: {
                    platform: "mac",
                    developmentBuild: true,
                    artifactName: "mac_dev",
                    unityVersion: "2017.2.1f1"
                },
                test: {
                    unityVersion: "2017.2.1f1",
                    test: true
                }
            }
        }, null, 2);
        fs.writeFileSync(Helper_1.Helper.ubtFileName, data);
        Logger_1.Logger.logUBT(data);
    }
    static runAll() {
        return Promise.resolve()
            .then(() => {
            Logger_1.Logger.logUBT("Running all targets");
            const allTargetsList = Object.keys(Helper_1.Helper.GetTargetList());
            Logger_1.Logger.logUBT(`Targets found: ${allTargetsList.join(", ")}.`);
            return allTargetsList.reduce((p, fn) => p.then(() => this.run(fn)), Promise.resolve());
        })
            .then(() => {
            Logger_1.Logger.logUBT("Done building all targets");
        });
    }
    static run(target) {
        return Promise.resolve()
            .then(() => {
            Logger_1.Logger.boxed(target);
            Logger_1.Logger.logPrefix(`Running target ${target}`, target);
            Logger_1.Logger.logPrefix(`config: ${JSON.stringify(Helper_1.Helper.GetTargetData(target), null, 2)}`, target);
            Helper_1.Helper.CreateLogFile();
            let outputPath = path.resolve(`build`, target);
            Logger_1.Logger.logPrefix(`Removing ${outputPath}`, target);
            if (fs.existsSync(outputPath)) {
                child_process_1.spawnSync(`rm`, ["-r", outputPath]);
            }
            return new Process_1.Process().ExecuteUnity(target);
        })
            .then(() => {
            Logger_1.Logger.logPrefix(`Done running target ${target}`, target);
        });
    }
    static install() {
        Helper_1.Helper.CopyUnityBuildScript();
        Logger_1.Logger.logUBT("Done install.");
    }
    static default() {
        Logger_1.Logger.logUBT("Nothing to do.");
    }
}
exports.Tool = Tool;
//# sourceMappingURL=Tool.js.map

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __webpack_require__(4);
const Helper_1 = __webpack_require__(2);
const Logger_1 = __webpack_require__(1);
const fs = __webpack_require__(0);
const TargetDataReader_1 = __webpack_require__(6);
const GlobalParameters_1 = __webpack_require__(5);
const Tail = __webpack_require__(16).Tail;
class Process {
    static getUnityCommand(target) {
        let command = "";
        let args = [];
        command = `${Helper_1.Helper.GetUnityPathForTarget(target)}`;
        if (!GlobalParameters_1.GlobalParameters.Interactive) {
            args.push("-batchmode");
        }
        args.push("-logFile");
        args.push(`${process.cwd()}/${Helper_1.Helper.UnityLogFilePath}`);
        args.push("-projectPath");
        args.push(process.cwd());
        if (TargetDataReader_1.TargetDataReader.IsTest(target)) {
            args.push("-runTests");
            args.push("-testPlatform");
            args.push(`playmode`);
        }
        else {
            args.push("-executeMethod");
            args.push(`Editor.${Helper_1.Helper.BuildToolCSharpClass}.Perform`);
            args.push("-quit");
            args.push(target);
            args.push(TargetDataReader_1.TargetDataReader.GetArtifactName(target));
            args.push(`${TargetDataReader_1.TargetDataReader.IsDevelopmentBuild(target)}`);
            args.push(`${TargetDataReader_1.TargetDataReader.GetPlatform(target)}`);
        }
        Logger_1.Logger.logPrefix(`Command: `, target);
        Logger_1.Logger.logPrefix(`${command} ${args.join(" ")}`, target);
        Logger_1.Logger.logPrefix(``, target);
        return { command, args };
    }
    ExecuteUnity(target) {
        return new Promise((resolve, reject) => {
            Helper_1.Helper.AssertUnityProjectFolder();
            let command = Process.getUnityCommand(target);
            Logger_1.Logger.logPrefix(`Starting unity process.`, target);
            const child = child_process_1.spawn(command.command, command.args);
            Logger_1.Logger.logPrefix("Waiting for Unity to finish executing.", target);
            if (!GlobalParameters_1.GlobalParameters.NoLog) {
                Logger_1.Logger.logPrefix(`Log files will then be cat'ed.`, target);
            }
            child.on("exit", (code, signal) => {
                if (!GlobalParameters_1.GlobalParameters.NoLog) {
                    Logger_1.Logger.logUnity(target, fs.readFileSync(Helper_1.Helper.UnityLogFilePath).toString());
                }
                Logger_1.Logger.logPrefix(`Unity process exited with code ${code}`, target);
                if (code == 0) {
                    resolve();
                }
                else {
                    reject(`Unity exited with exit code ${code}`);
                }
            });
            child.on("error", (error) => {
                reject(`Unity process error: ${error}`);
            });
            child.on("close", (code, signal) => {
                reject(`Unity process error. code: ${code}, signal: ${signal}`);
            });
            child.on("disconnect", () => {
                reject(`Unity process disconnected`);
            });
            child.on("message", (message) => {
                reject(`Unity process message: ${message}`);
            });
        });
    }
}
exports.Process = Process;
//# sourceMappingURL=Process.js.map

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.10.0
var Tail, environment, events, fs,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

events = __webpack_require__(7);

fs = __webpack_require__(0);

environment = process.env['NODE_ENV'] || 'development';

Tail = (function(superClass) {
  extend(Tail, superClass);

  Tail.prototype.readBlock = function() {
    var block, stream;
    if (this.queue.length >= 1) {
      block = this.queue.shift();
      if (block.end > block.start) {
        stream = fs.createReadStream(this.filename, {
          start: block.start,
          end: block.end - 1,
          encoding: this.encoding
        });
        stream.on('error', (function(_this) {
          return function(error) {
            if (_this.logger) {
              _this.logger.error("Tail error: " + error);
            }
            return _this.emit('error', error);
          };
        })(this));
        stream.on('end', (function(_this) {
          return function() {
            if (_this.queue.length >= 1) {
              return _this.internalDispatcher.emit("next");
            }
          };
        })(this));
        return stream.on('data', (function(_this) {
          return function(data) {
            var chunk, i, len, parts, results;
            _this.buffer += data;
            parts = _this.buffer.split(_this.separator);
            _this.buffer = parts.pop();
            results = [];
            for (i = 0, len = parts.length; i < len; i++) {
              chunk = parts[i];
              results.push(_this.emit("line", chunk));
            }
            return results;
          };
        })(this));
      }
    }
  };

  function Tail(filename, options) {
    var pos, ref, ref1, ref2, ref3, ref4, ref5;
    this.filename = filename;
    if (options == null) {
      options = {};
    }
    this.readBlock = bind(this.readBlock, this);
    this.separator = (ref = options.separator) != null ? ref : /[\r]{0,1}\n/, this.fsWatchOptions = (ref1 = options.fsWatchOptions) != null ? ref1 : {}, this.fromBeginning = (ref2 = options.fromBeginning) != null ? ref2 : false, this.follow = (ref3 = options.follow) != null ? ref3 : true, this.logger = options.logger, this.useWatchFile = (ref4 = options.useWatchFile) != null ? ref4 : false, this.encoding = (ref5 = options.encoding) != null ? ref5 : "utf-8";
    if (this.logger) {
      this.logger.info("Tail starting...");
      this.logger.info("filename: " + this.filename);
      this.logger.info("encoding: " + this.encoding);
    }
    this.buffer = '';
    this.internalDispatcher = new events.EventEmitter();
    this.queue = [];
    this.isWatching = false;
    this.internalDispatcher.on('next', (function(_this) {
      return function() {
        return _this.readBlock();
      };
    })(this));
    if (this.fromBeginning) {
      pos = 0;
    }
    this.watch(pos);
  }

  Tail.prototype.watch = function(pos) {
    var err, error1, stats;
    if (this.isWatching) {
      return;
    }
    this.isWatching = true;
    try {
      stats = fs.statSync(this.filename);
    } catch (error1) {
      err = error1;
      if (this.logger) {
        this.logger.error("watch for " + this.filename + " failed: " + this.err);
      }
      this.emit("error", "watch for " + this.filename + " failed: " + this.err);
      return;
    }
    this.pos = pos != null ? pos : stats.size;
    if (this.logger) {
      this.logger.info("filesystem.watch present? " + (fs.watch !== void 0));
      this.logger.info("useWatchFile: " + this.useWatchFile);
    }
    if (!this.useWatchFile && fs.watch) {
      if (this.logger) {
        this.logger.info("watch strategy: watch");
      }
      return this.watcher = fs.watch(this.filename, this.fsWatchOptions, (function(_this) {
        return function(e) {
          return _this.watchEvent(e);
        };
      })(this));
    } else {
      if (this.logger) {
        this.logger.info("watch strategy: watchFile");
      }
      return fs.watchFile(this.filename, this.fsWatchOptions, (function(_this) {
        return function(curr, prev) {
          return _this.watchFileEvent(curr, prev);
        };
      })(this));
    }
  };

  Tail.prototype.watchEvent = function(e) {
    var err, error1, stats;
    if (e === 'change') {
      try {
        stats = fs.statSync(this.filename);
      } catch (error1) {
        err = error1;
        if (this.logger) {
          this.logger.error("'change' event for " + this.filename + ". " + this.err);
        }
        this.emit("error", "'change' event for " + this.filename + ". " + this.err);
        return;
      }
      if (stats.size < this.pos) {
        this.pos = stats.size;
      }
      if (stats.size > this.pos) {
        this.queue.push({
          start: this.pos,
          end: stats.size
        });
        this.pos = stats.size;
        if (this.queue.length === 1) {
          return this.internalDispatcher.emit("next");
        }
      }
    } else if (e === 'rename') {
      this.unwatch();
      if (this.follow) {
        return setTimeout(((function(_this) {
          return function() {
            return _this.watch();
          };
        })(this)), 1000);
      } else {
        if (this.logger) {
          this.logger.error("'rename' event for " + this.filename + ". File not available.");
        }
        return this.emit("error", "'rename' event for " + this.filename + ". File not available.");
      }
    }
  };

  Tail.prototype.watchFileEvent = function(curr, prev) {
    if (curr.size > prev.size) {
      this.queue.push({
        start: prev.size,
        end: curr.size
      });
      if (this.queue.length === 1) {
        return this.internalDispatcher.emit("next");
      }
    }
  };

  Tail.prototype.unwatch = function() {
    if (this.watcher) {
      this.watcher.close();
    } else {
      fs.unwatchFile(this.filename);
    }
    this.isWatching = false;
    return this.queue = [];
  };

  return Tail;

})(events.EventEmitter);

exports.Tail = Tail;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var EventEmitter = __webpack_require__(7).EventEmitter;
var spawn = __webpack_require__(4).spawn;
var path = __webpack_require__(3);
var dirname = path.dirname;
var basename = path.basename;
var fs = __webpack_require__(0);

/**
 * Expose the root command.
 */

exports = module.exports = new Command();

/**
 * Expose `Command`.
 */

exports.Command = Command;

/**
 * Expose `Option`.
 */

exports.Option = Option;

/**
 * Initialize a new `Option` with the given `flags` and `description`.
 *
 * @param {String} flags
 * @param {String} description
 * @api public
 */

function Option(flags, description) {
  this.flags = flags;
  this.required = ~flags.indexOf('<');
  this.optional = ~flags.indexOf('[');
  this.bool = !~flags.indexOf('-no-');
  flags = flags.split(/[ ,|]+/);
  if (flags.length > 1 && !/^[[<]/.test(flags[1])) this.short = flags.shift();
  this.long = flags.shift();
  this.description = description || '';
}

/**
 * Return option name.
 *
 * @return {String}
 * @api private
 */

Option.prototype.name = function() {
  return this.long
    .replace('--', '')
    .replace('no-', '');
};

/**
 * Return option name, in a camelcase format that can be used
 * as a object attribute key.
 *
 * @return {String}
 * @api private
 */

Option.prototype.attributeName = function() {
  return camelcase( this.name() );
};

/**
 * Check if `arg` matches the short or long flag.
 *
 * @param {String} arg
 * @return {Boolean}
 * @api private
 */

Option.prototype.is = function(arg) {
  return arg == this.short || arg == this.long;
};

/**
 * Initialize a new `Command`.
 *
 * @param {String} name
 * @api public
 */

function Command(name) {
  this.commands = [];
  this.options = [];
  this._execs = {};
  this._allowUnknownOption = false;
  this._args = [];
  this._name = name || '';
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Command.prototype.__proto__ = EventEmitter.prototype;

/**
 * Add command `name`.
 *
 * The `.action()` callback is invoked when the
 * command `name` is specified via __ARGV__,
 * and the remaining arguments are applied to the
 * function for access.
 *
 * When the `name` is "*" an un-matched command
 * will be passed as the first arg, followed by
 * the rest of __ARGV__ remaining.
 *
 * Examples:
 *
 *      program
 *        .version('0.0.1')
 *        .option('-C, --chdir <path>', 'change the working directory')
 *        .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
 *        .option('-T, --no-tests', 'ignore test hook')
 *
 *      program
 *        .command('setup')
 *        .description('run remote setup commands')
 *        .action(function() {
 *          console.log('setup');
 *        });
 *
 *      program
 *        .command('exec <cmd>')
 *        .description('run the given remote command')
 *        .action(function(cmd) {
 *          console.log('exec "%s"', cmd);
 *        });
 *
 *      program
 *        .command('teardown <dir> [otherDirs...]')
 *        .description('run teardown commands')
 *        .action(function(dir, otherDirs) {
 *          console.log('dir "%s"', dir);
 *          if (otherDirs) {
 *            otherDirs.forEach(function (oDir) {
 *              console.log('dir "%s"', oDir);
 *            });
 *          }
 *        });
 *
 *      program
 *        .command('*')
 *        .description('deploy the given env')
 *        .action(function(env) {
 *          console.log('deploying "%s"', env);
 *        });
 *
 *      program.parse(process.argv);
  *
 * @param {String} name
 * @param {String} [desc] for git-style sub-commands
 * @return {Command} the new command
 * @api public
 */

Command.prototype.command = function(name, desc, opts) {
  if(typeof desc === 'object' && desc !== null){
    opts = desc;
    desc = null;
  }
  opts = opts || {};
  var args = name.split(/ +/);
  var cmd = new Command(args.shift());

  if (desc) {
    cmd.description(desc);
    this.executables = true;
    this._execs[cmd._name] = true;
    if (opts.isDefault) this.defaultExecutable = cmd._name;
  }
  cmd._noHelp = !!opts.noHelp;
  this.commands.push(cmd);
  cmd.parseExpectedArgs(args);
  cmd.parent = this;

  if (desc) return this;
  return cmd;
};

/**
 * Define argument syntax for the top-level command.
 *
 * @api public
 */

Command.prototype.arguments = function (desc) {
  return this.parseExpectedArgs(desc.split(/ +/));
};

/**
 * Add an implicit `help [cmd]` subcommand
 * which invokes `--help` for the given command.
 *
 * @api private
 */

Command.prototype.addImplicitHelpCommand = function() {
  this.command('help [cmd]', 'display help for [cmd]');
};

/**
 * Parse expected `args`.
 *
 * For example `["[type]"]` becomes `[{ required: false, name: 'type' }]`.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parseExpectedArgs = function(args) {
  if (!args.length) return;
  var self = this;
  args.forEach(function(arg) {
    var argDetails = {
      required: false,
      name: '',
      variadic: false
    };

    switch (arg[0]) {
      case '<':
        argDetails.required = true;
        argDetails.name = arg.slice(1, -1);
        break;
      case '[':
        argDetails.name = arg.slice(1, -1);
        break;
    }

    if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
      argDetails.variadic = true;
      argDetails.name = argDetails.name.slice(0, -3);
    }
    if (argDetails.name) {
      self._args.push(argDetails);
    }
  });
  return this;
};

/**
 * Register callback `fn` for the command.
 *
 * Examples:
 *
 *      program
 *        .command('help')
 *        .description('display verbose help')
 *        .action(function() {
 *           // output help here
 *        });
 *
 * @param {Function} fn
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.action = function(fn) {
  var self = this;
  var listener = function(args, unknown) {
    // Parse any so-far unknown options
    args = args || [];
    unknown = unknown || [];

    var parsed = self.parseOptions(unknown);

    // Output help if necessary
    outputHelpIfNecessary(self, parsed.unknown);

    // If there are still any unknown options, then we simply
    // die, unless someone asked for help, in which case we give it
    // to them, and then we die.
    if (parsed.unknown.length > 0) {
      self.unknownOption(parsed.unknown[0]);
    }

    // Leftover arguments need to be pushed back. Fixes issue #56
    if (parsed.args.length) args = parsed.args.concat(args);

    self._args.forEach(function(arg, i) {
      if (arg.required && null == args[i]) {
        self.missingArgument(arg.name);
      } else if (arg.variadic) {
        if (i !== self._args.length - 1) {
          self.variadicArgNotLast(arg.name);
        }

        args[i] = args.splice(i);
      }
    });

    // Always append ourselves to the end of the arguments,
    // to make sure we match the number of arguments the user
    // expects
    if (self._args.length) {
      args[self._args.length] = self;
    } else {
      args.push(self);
    }

    fn.apply(self, args);
  };
  var parent = this.parent || this;
  var name = parent === this ? '*' : this._name;
  parent.on('command:' + name, listener);
  if (this._alias) parent.on('command:' + this._alias, listener);
  return this;
};

/**
 * Define option with `flags`, `description` and optional
 * coercion `fn`.
 *
 * The `flags` string should contain both the short and long flags,
 * separated by comma, a pipe or space. The following are all valid
 * all will output this way when `--help` is used.
 *
 *    "-p, --pepper"
 *    "-p|--pepper"
 *    "-p --pepper"
 *
 * Examples:
 *
 *     // simple boolean defaulting to false
 *     program.option('-p, --pepper', 'add pepper');
 *
 *     --pepper
 *     program.pepper
 *     // => Boolean
 *
 *     // simple boolean defaulting to true
 *     program.option('-C, --no-cheese', 'remove cheese');
 *
 *     program.cheese
 *     // => true
 *
 *     --no-cheese
 *     program.cheese
 *     // => false
 *
 *     // required argument
 *     program.option('-C, --chdir <path>', 'change the working directory');
 *
 *     --chdir /tmp
 *     program.chdir
 *     // => "/tmp"
 *
 *     // optional argument
 *     program.option('-c, --cheese [type]', 'add cheese [marble]');
 *
 * @param {String} flags
 * @param {String} description
 * @param {Function|*} [fn] or default
 * @param {*} [defaultValue]
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.option = function(flags, description, fn, defaultValue) {
  var self = this
    , option = new Option(flags, description)
    , oname = option.name()
    , name = option.attributeName();

  // default as 3rd arg
  if (typeof fn != 'function') {
    if (fn instanceof RegExp) {
      var regex = fn;
      fn = function(val, def) {
        var m = regex.exec(val);
        return m ? m[0] : def;
      }
    }
    else {
      defaultValue = fn;
      fn = null;
    }
  }

  // preassign default value only for --no-*, [optional], or <required>
  if (false == option.bool || option.optional || option.required) {
    // when --no-* we make sure default is true
    if (false == option.bool) defaultValue = true;
    // preassign only if we have a default
    if (undefined !== defaultValue) {
      self[name] = defaultValue;
      option.defaultValue = defaultValue;
    }
  }

  // register the option
  this.options.push(option);

  // when it's passed assign the value
  // and conditionally invoke the callback
  this.on('option:' + oname, function(val) {
    // coercion
    if (null !== val && fn) val = fn(val, undefined === self[name]
      ? defaultValue
      : self[name]);

    // unassigned or bool
    if ('boolean' == typeof self[name] || 'undefined' == typeof self[name]) {
      // if no value, bool true, and we have a default, then use it!
      if (null == val) {
        self[name] = option.bool
          ? defaultValue || true
          : false;
      } else {
        self[name] = val;
      }
    } else if (null !== val) {
      // reassign
      self[name] = val;
    }
  });

  return this;
};

/**
 * Allow unknown options on the command line.
 *
 * @param {Boolean} arg if `true` or omitted, no error will be thrown
 * for unknown options.
 * @api public
 */
Command.prototype.allowUnknownOption = function(arg) {
    this._allowUnknownOption = arguments.length === 0 || arg;
    return this;
};

/**
 * Parse `argv`, settings options and invoking commands when defined.
 *
 * @param {Array} argv
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parse = function(argv) {
  // implicit help
  if (this.executables) this.addImplicitHelpCommand();

  // store raw args
  this.rawArgs = argv;

  // guess name
  this._name = this._name || basename(argv[1], '.js');

  // github-style sub-commands with no sub-command
  if (this.executables && argv.length < 3 && !this.defaultExecutable) {
    // this user needs help
    argv.push('--help');
  }

  // process argv
  var parsed = this.parseOptions(this.normalize(argv.slice(2)));
  var args = this.args = parsed.args;

  var result = this.parseArgs(this.args, parsed.unknown);

  // executable sub-commands
  var name = result.args[0];

  var aliasCommand = null;
  // check alias of sub commands
  if (name) {
    aliasCommand = this.commands.filter(function(command) {
      return command.alias() === name;
    })[0];
  }

  if (this._execs[name] && typeof this._execs[name] != "function") {
    return this.executeSubCommand(argv, args, parsed.unknown);
  } else if (aliasCommand) {
    // is alias of a subCommand
    args[0] = aliasCommand._name;
    return this.executeSubCommand(argv, args, parsed.unknown);
  } else if (this.defaultExecutable) {
    // use the default subcommand
    args.unshift(this.defaultExecutable);
    return this.executeSubCommand(argv, args, parsed.unknown);
  }

  return result;
};

/**
 * Execute a sub-command executable.
 *
 * @param {Array} argv
 * @param {Array} args
 * @param {Array} unknown
 * @api private
 */

Command.prototype.executeSubCommand = function(argv, args, unknown) {
  args = args.concat(unknown);

  if (!args.length) this.help();
  if ('help' == args[0] && 1 == args.length) this.help();

  // <cmd> --help
  if ('help' == args[0]) {
    args[0] = args[1];
    args[1] = '--help';
  }

  // executable
  var f = argv[1];
  // name of the subcommand, link `pm-install`
  var bin = basename(f, '.js') + '-' + args[0];


  // In case of globally installed, get the base dir where executable
  //  subcommand file should be located at
  var baseDir
    , link = fs.lstatSync(f).isSymbolicLink() ? fs.readlinkSync(f) : f;

  // when symbolink is relative path
  if (link !== f && link.charAt(0) !== '/') {
    link = path.join(dirname(f), link)
  }
  baseDir = dirname(link);

  // prefer local `./<bin>` to bin in the $PATH
  var localBin = path.join(baseDir, bin);

  // whether bin file is a js script with explicit `.js` extension
  var isExplicitJS = false;
  if (exists(localBin + '.js')) {
    bin = localBin + '.js';
    isExplicitJS = true;
  } else if (exists(localBin)) {
    bin = localBin;
  }

  args = args.slice(1);

  var proc;
  if (process.platform !== 'win32') {
    if (isExplicitJS) {
      args.unshift(bin);
      // add executable arguments to spawn
      args = (process.execArgv || []).concat(args);

      proc = spawn(process.argv[0], args, { stdio: 'inherit', customFds: [0, 1, 2] });
    } else {
      proc = spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] });
    }
  } else {
    args.unshift(bin);
    proc = spawn(process.execPath, args, { stdio: 'inherit'});
  }

  var signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
  signals.forEach(function(signal) {
    process.on(signal, function(){
      if ((proc.killed === false) && (proc.exitCode === null)){
        proc.kill(signal);
      }
    });
  });
  proc.on('close', process.exit.bind(process));
  proc.on('error', function(err) {
    if (err.code == "ENOENT") {
      console.error('\n  %s(1) does not exist, try --help\n', bin);
    } else if (err.code == "EACCES") {
      console.error('\n  %s(1) not executable. try chmod or run with root\n', bin);
    }
    process.exit(1);
  });

  // Store the reference to the child process
  this.runningCommand = proc;
};

/**
 * Normalize `args`, splitting joined short flags. For example
 * the arg "-abc" is equivalent to "-a -b -c".
 * This also normalizes equal sign and splits "--abc=def" into "--abc def".
 *
 * @param {Array} args
 * @return {Array}
 * @api private
 */

Command.prototype.normalize = function(args) {
  var ret = []
    , arg
    , lastOpt
    , index;

  for (var i = 0, len = args.length; i < len; ++i) {
    arg = args[i];
    if (i > 0) {
      lastOpt = this.optionFor(args[i-1]);
    }

    if (arg === '--') {
      // Honor option terminator
      ret = ret.concat(args.slice(i));
      break;
    } else if (lastOpt && lastOpt.required) {
      ret.push(arg);
    } else if (arg.length > 1 && '-' == arg[0] && '-' != arg[1]) {
      arg.slice(1).split('').forEach(function(c) {
        ret.push('-' + c);
      });
    } else if (/^--/.test(arg) && ~(index = arg.indexOf('='))) {
      ret.push(arg.slice(0, index), arg.slice(index + 1));
    } else {
      ret.push(arg);
    }
  }

  return ret;
};

/**
 * Parse command `args`.
 *
 * When listener(s) are available those
 * callbacks are invoked, otherwise the "*"
 * event is emitted and those actions are invoked.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api private
 */

Command.prototype.parseArgs = function(args, unknown) {
  var name;

  if (args.length) {
    name = args[0];
    if (this.listeners('command:' + name).length) {
      this.emit('command:' + args.shift(), args, unknown);
    } else {
      this.emit('command:*', args);
    }
  } else {
    outputHelpIfNecessary(this, unknown);

    // If there were no args and we have unknown options,
    // then they are extraneous and we need to error.
    if (unknown.length > 0) {
      this.unknownOption(unknown[0]);
    }
  }

  return this;
};

/**
 * Return an option matching `arg` if any.
 *
 * @param {String} arg
 * @return {Option}
 * @api private
 */

Command.prototype.optionFor = function(arg) {
  for (var i = 0, len = this.options.length; i < len; ++i) {
    if (this.options[i].is(arg)) {
      return this.options[i];
    }
  }
};

/**
 * Parse options from `argv` returning `argv`
 * void of these options.
 *
 * @param {Array} argv
 * @return {Array}
 * @api public
 */

Command.prototype.parseOptions = function(argv) {
  var args = []
    , len = argv.length
    , literal
    , option
    , arg;

  var unknownOptions = [];

  // parse options
  for (var i = 0; i < len; ++i) {
    arg = argv[i];

    // literal args after --
    if (literal) {
      args.push(arg);
      continue;
    }

    if ('--' == arg) {
      literal = true;
      continue;
    }

    // find matching Option
    option = this.optionFor(arg);

    // option is defined
    if (option) {
      // requires arg
      if (option.required) {
        arg = argv[++i];
        if (null == arg) return this.optionMissingArgument(option);
        this.emit('option:' + option.name(), arg);
      // optional arg
      } else if (option.optional) {
        arg = argv[i+1];
        if (null == arg || ('-' == arg[0] && '-' != arg)) {
          arg = null;
        } else {
          ++i;
        }
        this.emit('option:' + option.name(), arg);
      // bool
      } else {
        this.emit('option:' + option.name());
      }
      continue;
    }

    // looks like an option
    if (arg.length > 1 && '-' == arg[0]) {
      unknownOptions.push(arg);

      // If the next argument looks like it might be
      // an argument for this option, we pass it on.
      // If it isn't, then it'll simply be ignored
      if (argv[i+1] && '-' != argv[i+1][0]) {
        unknownOptions.push(argv[++i]);
      }
      continue;
    }

    // arg
    args.push(arg);
  }

  return { args: args, unknown: unknownOptions };
};

/**
 * Return an object containing options as key-value pairs
 *
 * @return {Object}
 * @api public
 */
Command.prototype.opts = function() {
  var result = {}
    , len = this.options.length;

  for (var i = 0 ; i < len; i++) {
    var key = this.options[i].attributeName();
    result[key] = key === 'version' ? this._version : this[key];
  }
  return result;
};

/**
 * Argument `name` is missing.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.missingArgument = function(name) {
  console.error();
  console.error("  error: missing required argument `%s'", name);
  console.error();
  process.exit(1);
};

/**
 * `Option` is missing an argument, but received `flag` or nothing.
 *
 * @param {String} option
 * @param {String} flag
 * @api private
 */

Command.prototype.optionMissingArgument = function(option, flag) {
  console.error();
  if (flag) {
    console.error("  error: option `%s' argument missing, got `%s'", option.flags, flag);
  } else {
    console.error("  error: option `%s' argument missing", option.flags);
  }
  console.error();
  process.exit(1);
};

/**
 * Unknown option `flag`.
 *
 * @param {String} flag
 * @api private
 */

Command.prototype.unknownOption = function(flag) {
  if (this._allowUnknownOption) return;
  console.error();
  console.error("  error: unknown option `%s'", flag);
  console.error();
  process.exit(1);
};

/**
 * Variadic argument with `name` is not the last argument as required.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.variadicArgNotLast = function(name) {
  console.error();
  console.error("  error: variadic arguments must be last `%s'", name);
  console.error();
  process.exit(1);
};

/**
 * Set the program version to `str`.
 *
 * This method auto-registers the "-V, --version" flag
 * which will print the version number when passed.
 *
 * @param {String} str
 * @param {String} [flags]
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.version = function(str, flags) {
  if (0 == arguments.length) return this._version;
  this._version = str;
  flags = flags || '-V, --version';
  this.option(flags, 'output the version number');
  this.on('option:version', function() {
    process.stdout.write(str + '\n');
    process.exit(0);
  });
  return this;
};

/**
 * Set the description to `str`.
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.description = function(str) {
  if (0 === arguments.length) return this._description;
  this._description = str;
  return this;
};

/**
 * Set an alias for the command
 *
 * @param {String} alias
 * @return {String|Command}
 * @api public
 */

Command.prototype.alias = function(alias) {
  var command = this;
  if(this.commands.length !== 0) {
    command = this.commands[this.commands.length - 1]
  }

  if (arguments.length === 0) return command._alias;

  if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');

  command._alias = alias;
  return this;
};

/**
 * Set / get the command usage `str`.
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.usage = function(str) {
  var args = this._args.map(function(arg) {
    return humanReadableArgName(arg);
  });

  var usage = '[options]'
    + (this.commands.length ? ' [command]' : '')
    + (this._args.length ? ' ' + args.join(' ') : '');

  if (0 == arguments.length) return this._usage || usage;
  this._usage = str;

  return this;
};

/**
 * Get or set the name of the command
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.name = function(str) {
  if (0 === arguments.length) return this._name;
  this._name = str;
  return this;
};

/**
 * Return the largest option length.
 *
 * @return {Number}
 * @api private
 */

Command.prototype.largestOptionLength = function() {
  return this.options.reduce(function(max, option) {
    return Math.max(max, option.flags.length);
  }, 0);
};

/**
 * Return help for options.
 *
 * @return {String}
 * @api private
 */

Command.prototype.optionHelp = function() {
  var width = this.largestOptionLength();

  // Append the help information
  return this.options.map(function(option) {
      return pad(option.flags, width) + '  ' + option.description
        + ((option.bool != false && option.defaultValue !== undefined) ? ' (default: ' + option.defaultValue + ')' : '');
  }).concat([pad('-h, --help', width) + '  ' + 'output usage information'])
    .join('\n');
};

/**
 * Return command help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.commandHelp = function() {
  if (!this.commands.length) return '';

  var commands = this.commands.filter(function(cmd) {
    return !cmd._noHelp;
  }).map(function(cmd) {
    var args = cmd._args.map(function(arg) {
      return humanReadableArgName(arg);
    }).join(' ');

    return [
      cmd._name
        + (cmd._alias ? '|' + cmd._alias : '')
        + (cmd.options.length ? ' [options]' : '')
        + (args ? ' ' + args : '')
      , cmd._description
    ];
  });

  var width = commands.reduce(function(max, command) {
    return Math.max(max, command[0].length);
  }, 0);

  return [
    ''
    , '  Commands:'
    , ''
    , commands.map(function(cmd) {
      var desc = cmd[1] ? '  ' + cmd[1] : '';
      return (desc ? pad(cmd[0], width) : cmd[0]) + desc;
    }).join('\n').replace(/^/gm, '    ')
    , ''
  ].join('\n');
};

/**
 * Return program help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.helpInformation = function() {
  var desc = [];
  if (this._description) {
    desc = [
      '  ' + this._description
      , ''
    ];
  }

  var cmdName = this._name;
  if (this._alias) {
    cmdName = cmdName + '|' + this._alias;
  }
  var usage = [
    ''
    ,'  Usage: ' + cmdName + ' ' + this.usage()
    , ''
  ];

  var cmds = [];
  var commandHelp = this.commandHelp();
  if (commandHelp) cmds = [commandHelp];

  var options = [
    ''
    , '  Options:'
    , ''
    , '' + this.optionHelp().replace(/^/gm, '    ')
    , ''
  ];

  return usage
    .concat(desc)
    .concat(options)
    .concat(cmds)
    .join('\n');
};

/**
 * Output help information for this command
 *
 * @api public
 */

Command.prototype.outputHelp = function(cb) {
  if (!cb) {
    cb = function(passthru) {
      return passthru;
    }
  }
  process.stdout.write(cb(this.helpInformation()));
  this.emit('--help');
};

/**
 * Output help information and exit.
 *
 * @api public
 */

Command.prototype.help = function(cb) {
  this.outputHelp(cb);
  process.exit();
};

/**
 * Camel-case the given `flag`
 *
 * @param {String} flag
 * @return {String}
 * @api private
 */

function camelcase(flag) {
  return flag.split('-').reduce(function(str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Pad `str` to `width`.
 *
 * @param {String} str
 * @param {Number} width
 * @return {String}
 * @api private
 */

function pad(str, width) {
  var len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}

/**
 * Output help information if necessary
 *
 * @param {Command} command to output help for
 * @param {Array} array of options to search for -h or --help
 * @api private
 */

function outputHelpIfNecessary(cmd, options) {
  options = options || [];
  for (var i = 0; i < options.length; i++) {
    if (options[i] == '--help' || options[i] == '-h') {
      cmd.outputHelp();
      process.exit(0);
    }
  }
}

/**
 * Takes an argument an returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {String}
 * @api private
 */

function humanReadableArgName(arg) {
  var nameOutput = arg.name + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']'
}

// for versions before node v0.8 when there weren't `fs.existsSync`
function exists(file) {
  try {
    if (fs.statSync(file).isFile()) {
      return true;
    }
  } catch (e) {
    return false;
  }
}



/***/ })
/******/ ]);