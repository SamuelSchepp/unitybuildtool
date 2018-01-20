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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
        const date = new Date();
        msg.split("\n").forEach(line => {
            console.log(`[${prefix}] ${line}`);
        });
    }
    static boxed(msg) {
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
const os = __webpack_require__(8);
const fs = __webpack_require__(0);
const Logger_1 = __webpack_require__(1);
const UnityBuildTool_cs_1 = __webpack_require__(9);
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
        const dest = `Assets/Editor/${Helper.BuildToolCSharpClass}.cs`;
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
    static EmptyOrUndefinded(obj) {
        return (!obj || obj == undefined || obj == null || obj == "" || (obj.trim && obj.trim() == ""));
    }
}
Helper.ubtFileName = "ubt.json";
Helper.BuildToolCSharpClass = "UnityBuildTool";
Helper.UnityLogFilePath = "./unity_log.txt";
exports.Helper = Helper;
//# sourceMappingURL=Helper.js.map

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Helper_1 = __webpack_require__(2);
const fs = __webpack_require__(0);
const path = __webpack_require__(5);
class Target {
    ParseFromObject(obj) {
        if (obj) {
            this.platform = obj["platform"];
            this.developmentBuild = obj["developmentBuild"];
            this.artifactName = obj["artifactName"];
            this.unityPath = obj["unityPath"];
            this.test = obj["test"];
        }
    }
    toString() {
        return JSON.stringify(this, null, 2);
    }
    GetPlatform() {
        if (Helper_1.Helper.EmptyOrUndefinded(this.platform)) {
            throw Error(`No platform set.`);
        }
        return this.platform;
    }
    GetDevelopmentBuild() {
        if (Helper_1.Helper.EmptyOrUndefinded(this.developmentBuild)) {
            return false;
        }
        return this.developmentBuild;
    }
    GetArtifactName() {
        if (Helper_1.Helper.EmptyOrUndefinded(this.artifactName)) {
            return path.basename(process.cwd());
        }
        return this.artifactName;
    }
    GetUnityPath() {
        if (Helper_1.Helper.EmptyOrUndefinded(this.unityPath)) {
            throw Error(`No unityPath set.`);
        }
        return this.unityPath;
    }
    GetTest() {
        if (Helper_1.Helper.EmptyOrUndefinded(this.test)) {
            return false;
        }
        return this.test;
    }
}
exports.Target = Target;
class UBTFile {
    static GetInstance() {
        if (!UBTFile.instance) {
            var data = fs.readFileSync(Helper_1.Helper.ubtFileName).toString();
            var obj = JSON.parse(data);
            UBTFile.instance = new UBTFile();
            UBTFile.instance.ParseFromObject(obj);
        }
        return UBTFile.instance;
    }
    constructor() {
        this.targets = {};
    }
    toString() {
        return JSON.stringify(this, null, 2);
    }
    ParseFromObject(obj) {
        if (obj && obj["targets"]) {
            Object.keys(obj["targets"]).forEach((key) => {
                const t = new Target();
                t.ParseFromObject(obj["targets"][key]);
                this.targets[key] = t;
            });
        }
    }
    GetTarget(target) {
        if (this.targets[target]) {
            return this.targets[target];
        }
        else {
            throw Error(`Target ${target} not found.`);
        }
    }
    GetAlltargets() {
        return Object.keys(this.targets);
    }
}
exports.UBTFile = UBTFile;
//# sourceMappingURL=ubt.json.js.map

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __webpack_require__(1);
const Helper_1 = __webpack_require__(2);
const Tool_1 = __webpack_require__(10);
const ubt_json_1 = __webpack_require__(3);
const program = __webpack_require__(13);
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
    .action((options) => {
    Promise.resolve()
        .then(() => {
        if (options["target"]) {
            return Tool_1.Tool.run(options["target"]);
        }
        else {
            return Tool_1.Tool.runAll();
        }
    })
        .catch((error) => {
        Logger_1.Logger.logUBT(`Run failed: ${error.message}`);
        process.exit(1);
    });
});
program
    .command('load')
    .action((options) => {
    ubt_json_1.UBTFile.GetInstance();
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class UnityBuildTool {
}
UnityBuildTool.Base64 = "dXNpbmcgU3lzdGVtOw0KdXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7DQp1c2luZyBTeXN0ZW0uRGlhZ25vc3RpY3M7DQp1c2luZyBTeXN0ZW0uTGlucTsNCnVzaW5nIFN5c3RlbS5OZXQuTmV0d29ya0luZm9ybWF0aW9uOw0KdXNpbmcgVW5pdHlFZGl0b3I7DQp1c2luZyBVbml0eUVuZ2luZTsNCg0KbmFtZXNwYWNlIEVkaXRvcg0Kew0KCXB1YmxpYyBzdGF0aWMgY2xhc3MgVW5pdHlCdWlsZFRvb2wgew0KDQoJCXByaXZhdGUgc3RhdGljIERpY3Rpb25hcnk8c3RyaW5nLCBCdWlsZFRhcmdldEdyb3VwPiBUYXJnZXRHcm91cHMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIEJ1aWxkVGFyZ2V0R3JvdXA+KCkgew0KCQkJeyJpb3MiLCBCdWlsZFRhcmdldEdyb3VwLmlPU30sDQoJCQl7ImFuZHJvaWQiLCBCdWlsZFRhcmdldEdyb3VwLkFuZHJvaWR9LA0KCQkJeyJ3aW5kb3dzIiwgQnVpbGRUYXJnZXRHcm91cC5TdGFuZGFsb25lfSwNCgkJCXsibWFjIiwgQnVpbGRUYXJnZXRHcm91cC5TdGFuZGFsb25lfSwNCgkJCXsid2ViZ2wiLCBCdWlsZFRhcmdldEdyb3VwLldlYkdMfQ0KCQl9Ow0KDQoJCXByaXZhdGUgc3RhdGljIERpY3Rpb25hcnk8c3RyaW5nLCBCdWlsZFRhcmdldD4gVGFyZ2V0cyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgQnVpbGRUYXJnZXQ+KCkgew0KCQkJeyJpb3MiLCBCdWlsZFRhcmdldC5pT1N9LA0KCQkJeyJhbmRyb2lkIiwgQnVpbGRUYXJnZXQuQW5kcm9pZH0sDQoJCQl7IndpbmRvd3MiLCBCdWlsZFRhcmdldC5TdGFuZGFsb25lV2luZG93czY0fSwNCgkJCXsid2ViZ2wiLCBCdWlsZFRhcmdldC5XZWJHTH0sDQoJCQkjaWYgVU5JVFlfMjAxN18yIHx8IFVOSVRZXzIwMTdfMQ0KCQkJeyJtYWMiLCBCdWlsZFRhcmdldC5TdGFuZGFsb25lT1NYVW5pdmVyc2FsfQ0KCQkJI2Vsc2UNCgkJCXsibWFjIiwgQnVpbGRUYXJnZXQuU3RhbmRhbG9uZU9TWH0NCgkJCSNlbmRpZg0KCQl9Ow0KDQoJCXByaXZhdGUgc3RhdGljIHN0cmluZ1tdIEdldFNjZW5lUGF0aHMoKSB7DQoJCQlyZXR1cm4gRWRpdG9yQnVpbGRTZXR0aW5ncy5zY2VuZXMuU2VsZWN0KChzY2VuZSkgPT4gc2NlbmUucGF0aCkuVG9BcnJheSgpOw0KCQl9DQoNCgkJcHJpdmF0ZSBzdGF0aWMgdm9pZCBQZXJmb3JtQnVpbGQoc3RyaW5nIGFydGlmYWN0TmFtZSwgc3RyaW5nIHBsYXRmb3JtLCBib29sIGRldmVsb3BtZW50QnVpbGQpIHsNCgkJCXZhciBvcHRpb25zID0gQnVpbGRPcHRpb25zLk5vbmU7DQoJCQlpZiAoZGV2ZWxvcG1lbnRCdWlsZCkgew0KCQkJCW9wdGlvbnMgPSBvcHRpb25zIHwgQnVpbGRPcHRpb25zLkRldmVsb3BtZW50Ow0KCQkJfQ0KDQoJCQlQbGF5ZXJTZXR0aW5ncy5BbmRyb2lkLmtleWFsaWFzTmFtZSA9ICIiOw0KCQkJUGxheWVyU2V0dGluZ3MuQW5kcm9pZC5rZXlzdG9yZU5hbWUgPSAiIjsNCg0KCQkJRWRpdG9yVXNlckJ1aWxkU2V0dGluZ3MuZGV2ZWxvcG1lbnQgPSBkZXZlbG9wbWVudEJ1aWxkOw0KCQkJRWRpdG9yVXNlckJ1aWxkU2V0dGluZ3MuU3dpdGNoQWN0aXZlQnVpbGRUYXJnZXQoVGFyZ2V0R3JvdXBzW3BsYXRmb3JtXSwgVGFyZ2V0c1twbGF0Zm9ybV0pOw0KDQoJCQlpZiAocGxhdGZvcm0gPT0gImFuZHJvaWQiKSB7DQoJCQkJYXJ0aWZhY3ROYW1lID0gYXJ0aWZhY3ROYW1lICsgIi5hcGsiOw0KCQkJfQ0KCQkJaWYgKHBsYXRmb3JtID09ICJ3aW5kb3dzIikgew0KCQkJCWFydGlmYWN0TmFtZSA9IGFydGlmYWN0TmFtZSArICIuZXhlIjsNCgkJCX0NCg0KCQkJQnVpbGRQaXBlbGluZS5CdWlsZFBsYXllcihHZXRTY2VuZVBhdGhzKCksICJidWlsZC8iICsgcGxhdGZvcm0gKyAiLyIgKyBhcnRpZmFjdE5hbWUsIFRhcmdldHNbcGxhdGZvcm1dLCBvcHRpb25zKTsNCgkJfQ0KDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBQZXJmb3JtKCkgew0KCQkJaWYgKCFUYXJnZXRHcm91cHMuQ29udGFpbnNLZXkoUmVhZFBsYXRmb3JtKCkpIHx8ICFUYXJnZXRzLkNvbnRhaW5zS2V5KFJlYWRQbGF0Zm9ybSgpKSkgew0KCQkJCXRocm93IG5ldyBFeGNlcHRpb24oIlBsYXRmb3JtICIgKyBSZWFkUGxhdGZvcm0oKSArICIgbm90IHN1cHBvcnRlZCIpOw0KCQkJfQ0KCQkJZWxzZSB7DQoJCQkJUGVyZm9ybUJ1aWxkKFJlYWRBcnRpZmFjdE5hbWUoKSwgUmVhZFBsYXRmb3JtKCksIFJlYWREZXZlbG9wbWVudEJ1aWxkKCkpOw0KCQkJfQ0KCQl9DQoNCgkJcHJpdmF0ZSBzdGF0aWMgc3RyaW5nIFJlYWRQbGF0Zm9ybSgpIHsNCgkJCXZhciBhcmdzID0gRW52aXJvbm1lbnQuR2V0Q29tbWFuZExpbmVBcmdzKCk7DQoJCQlyZXR1cm4gYXJnc1thcmdzLkxlbmd0aCAtIDFdOw0KCQl9DQoNCgkJcHJpdmF0ZSBzdGF0aWMgYm9vbCBSZWFkRGV2ZWxvcG1lbnRCdWlsZCgpIHsNCgkJCXZhciBhcmdzID0gRW52aXJvbm1lbnQuR2V0Q29tbWFuZExpbmVBcmdzKCk7DQoJCQl2YXIgZGV2QnVpbGQgPSBhcmdzW2FyZ3MuTGVuZ3RoIC0gMl07DQoJCQlyZXR1cm4gZGV2QnVpbGQuRXF1YWxzKCJ0cnVlIik7DQoJCX0NCg0KCQlwcml2YXRlIHN0YXRpYyBzdHJpbmcgUmVhZEFydGlmYWN0TmFtZSgpIHsNCgkJCXZhciBhcmdzID0gRW52aXJvbm1lbnQuR2V0Q29tbWFuZExpbmVBcmdzKCk7DQoJCQlyZXR1cm4gYXJnc1thcmdzLkxlbmd0aCAtIDNdOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9CdWlsZCBNYWMiLCBmYWxzZSwgMTAxKV0NCgkJcHVibGljIHN0YXRpYyB2b2lkIEJ1aWxkTWFjKCkgew0KCQkJUGVyZm9ybUJ1aWxkKCJzdGFuZGFsb25lIiwgIm1hYyIsIHRydWUpOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9CdWlsZCBXaW5kb3dzIiwgZmFsc2UsIDEwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBCdWlsZFdpbmRvd3MoKSB7DQoJCQlQZXJmb3JtQnVpbGQoInN0YW5kYWxvbmUiLCAid2luZG93cyIsIHRydWUpOw0KCQl9DQoNCgkJW01lbnVJdGVtKCJVbml0eUJ1aWxkVG9vbC9CdWlsZCBXZWJHTCIsIGZhbHNlLCAxMDEpXQ0KCQlwdWJsaWMgc3RhdGljIHZvaWQgQnVpbGRXZWJHTCgpIHsNCgkJCVBlcmZvcm1CdWlsZCgid2ViIiwgIndlYmdsIiwgdHJ1ZSk7DQoJCX0NCg0KCQlbTWVudUl0ZW0oIlVuaXR5QnVpbGRUb29sL0J1aWxkIGlPUyIsIGZhbHNlLCAxMDEpXQ0KCQlwdWJsaWMgc3RhdGljIHZvaWQgQnVpbGRJT1MoKSB7DQoJCQlQZXJmb3JtQnVpbGQoImlwaG9uZSIsICJpb3MiLCB0cnVlKTsNCgkJfQ0KDQoJCVtNZW51SXRlbSgiVW5pdHlCdWlsZFRvb2wvQnVpbGQgQW5kcm9pZCIsIGZhbHNlLCAxMDEpXQ0KCQlwdWJsaWMgc3RhdGljIHZvaWQgQnVpbGRBbmRyb2lkKCkgew0KCQkJUGVyZm9ybUJ1aWxkKCJhbmRyb2lkIiwgImFuZHJvaWQiLCB0cnVlKTsNCgkJfQ0KDQoJCVtNZW51SXRlbSgiVW5pdHlCdWlsZFRvb2wvQ2xlYW4iLCBmYWxzZSwgMTAwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBDbGVhbigpIHsNCgkJCUZpbGVVdGlsLkRlbGV0ZUZpbGVPckRpcmVjdG9yeSgiYnVpbGQiKTsNCgkJfQ0KCQ0KCQlbTWVudUl0ZW0oIlVuaXR5QnVpbGRUb29sL0NyZWF0ZSBTb2x1dGlvbiIsIGZhbHNlLCAxMDAwMSldDQoJCXB1YmxpYyBzdGF0aWMgdm9pZCBDcmVhdGVTb2x1dGlvbigpIHsNCgkJCUVkaXRvckFwcGxpY2F0aW9uLkV4ZWN1dGVNZW51SXRlbSgiQXNzZXRzL09wZW4gQyMgUHJvamVjdCIpOw0KCQl9DQoJfQ0KfQ==";
exports.UnityBuildTool = UnityBuildTool;
//# sourceMappingURL=UnityBuildTool.cs.js.map

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __webpack_require__(1);
const ubt_json_1 = __webpack_require__(3);
const Helper_1 = __webpack_require__(2);
const fs = __webpack_require__(0);
const Process_1 = __webpack_require__(11);
const { spawn } = __webpack_require__(4);
class Tool {
    static init() {
        var obj = new ubt_json_1.UBTFile();
        obj.ParseFromObject({
            targets: {
                mac_dev: {
                    platform: "mac",
                    artifactName: "mac_dev",
                    developmentBuild: true,
                    unityPath: "/Applications/Unity 2017.2.0f3/Unity.app/Contents/MacOS/Unity"
                },
                test: {
                    test: true,
                    unityPath: "/Applications/Unity 2017.2.0f3/Unity.app/Contents/MacOS/Unity"
                }
            }
        });
        Logger_1.Logger.logUBT(`Initializing ${Helper_1.Helper.ubtFileName} @ ${process.cwd()}`);
        const data = JSON.stringify(obj, null, 2);
        fs.writeFileSync(Helper_1.Helper.ubtFileName, data);
        Logger_1.Logger.logUBT(data);
    }
    static runAll() {
        return Promise.resolve()
            .then(() => {
            Logger_1.Logger.logUBT("Running all targets");
            Logger_1.Logger.logUBT(ubt_json_1.UBTFile.GetInstance().toString());
            return ubt_json_1.UBTFile.GetInstance().GetAlltargets().reduce((p, fn) => p.then(() => this.run(fn)), Promise.resolve());
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
            Logger_1.Logger.logPrefix(`config: ${ubt_json_1.UBTFile.GetInstance().GetTarget(target).toString()}`, target);
            Helper_1.Helper.CreateLogFile();
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __webpack_require__(4);
const ubt_json_1 = __webpack_require__(3);
const Helper_1 = __webpack_require__(2);
const Logger_1 = __webpack_require__(1);
const Tail = __webpack_require__(12).Tail;
class Process {
    static getUnityCommand(target) {
        let command = "";
        let args = [];
        command = `${ubt_json_1.UBTFile.GetInstance().GetTarget(target).GetUnityPath()}`;
        args.push("-batchmode");
        args.push("-logFile");
        args.push(`${process.cwd()}/${Helper_1.Helper.UnityLogFilePath}`);
        args.push("-projectPath");
        args.push(process.cwd());
        if (ubt_json_1.UBTFile.GetInstance().GetTarget(target).GetTest()) {
            args.push("-runTests");
            args.push("-testPlatform");
            args.push(`playmode`);
        }
        else {
            args.push("-executeMethod");
            args.push(`Editor.${Helper_1.Helper.BuildToolCSharpClass}.Perform`);
            args.push("-quit");
            args.push(ubt_json_1.UBTFile.GetInstance().GetTarget(target).GetArtifactName());
            args.push(`${ubt_json_1.UBTFile.GetInstance().GetTarget(target).GetDevelopmentBuild()}`);
            args.push(`${ubt_json_1.UBTFile.GetInstance().GetTarget(target).GetPlatform()}`);
        }
        Logger_1.Logger.logPrefix(`Command: `, target);
        Logger_1.Logger.logPrefix(command, target);
        args.forEach(arg => Logger_1.Logger.logPrefix(arg, target));
        Logger_1.Logger.logPrefix(``, target);
        return { command, args };
    }
    ExecuteUnity(target) {
        return new Promise((resolve, reject) => {
            let command = Process.getUnityCommand(target);
            Logger_1.Logger.logPrefix("Starting unity process", target);
            const child = child_process_1.spawn(command.command, command.args);
            this.tail = new Tail(Helper_1.Helper.UnityLogFilePath);
            this.tail.on("line", function (data) {
                Logger_1.Logger.logUnity(target, data);
            });
            this.tail.on("error", function (error) {
                this.shutdown();
                reject(error);
            });
            child.on("exit", (code, signal) => {
                Logger_1.Logger.logPrefix(`Unity process exited with code ${code}`, target);
                this.shutdown();
                if (code == 0) {
                    resolve();
                }
                else {
                    reject(new Error(`Unity exited with exit code ${code}`));
                }
            });
            child.on("error", (error) => {
                Logger_1.Logger.logPrefix(`Unity process error`, target);
                this.shutdown();
                reject(error);
            });
        });
    }
    shutdown() {
        if (this.tail) {
            this.tail.unwatch();
        }
    }
}
exports.Process = Process;
//# sourceMappingURL=Process.js.map

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.10.0
var Tail, environment, events, fs,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

events = __webpack_require__(6);

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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var EventEmitter = __webpack_require__(6).EventEmitter;
var spawn = __webpack_require__(4).spawn;
var path = __webpack_require__(5);
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