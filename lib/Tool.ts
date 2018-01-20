import {Logger} from "./Logger"
import {Target, UBTFile} from "./ubt.json"
import {Helper} from "./Helper"
import * as fs from "fs"
import {exec} from "child_process"
import {Process} from "./Process"

const { spawn } = require('child_process');

export class Tool {
	public static init() {
		var obj = new UBTFile()
		obj.ParseFromObject({})
		obj.targets["ios_experimental"] = new Target()
		obj.targets["ios_experimental"].platform = "ios"
		obj.targets["ios_experimental"].unityPath = "/Applications/Unity 2017.3.0f3/Unity.app/Contents/MacOS/Unity"
		obj.targets["ios_experimental"].developmentBuild = true
		obj.targets["android"] = new Target()
		obj.targets["android"].platform = "android"

		Logger.logUBT(`Initializing ${Helper.ubtFileName} @ ${process.cwd()}`)

		const data = JSON.stringify(obj, null, 2)

		fs.writeFileSync(Helper.ubtFileName, data)

		Logger.logUBT(data)
	}

	public static buildAll(): Promise<void> {
		return Promise.resolve()
			.then(() => {
				Logger.logUBT("Building all targets")
				Logger.logUBT(UBTFile.GetInstance().toString())
				return Object.keys(UBTFile.GetInstance().targets).reduce((p, fn) => p.then(() => this.build(fn)), Promise.resolve())
			})
			.then(() => {
				Logger.logUBT("Done building all targets")
			})
	}

	public static build(target: string): Promise<void> {
		return Promise.resolve()
			.then(() => {
				Logger.boxed(target)
				Logger.logPrefix(`Building target ${target}`, target)
				Logger.logPrefix(`config: ${UBTFile.GetInstance().GetTargetConfig(target).toString()}`, target);

				Helper.CreateLogFile();
				Helper.CopyUnityBuildScript();

				return new Process().ExecuteUnityBuild(target)
			})
			.then(() => {
				Logger.logPrefix(`Done building target ${target}`, target)
			})
			.catch((error) => {
				Logger.logError(`Target ${target} failed: ${error}`)
				return Promise.reject(error)
			})
	}

	public static test(): Promise<void> {
		return Promise.resolve()
			.then(() => {
				Logger.boxed(`Testing`)
				Logger.logPrefix(`config: ${UBTFile.GetInstance().GetTestConfig().toString()}`, `test`);

				Helper.CreateLogFile();

				return new Process().ExecuteUnityTest()
			})
			.then(() => {
				Logger.logPrefix(`Test done`, `test`)
			})
			.catch((error) => {
				Logger.logError(`Test failed: ${error}`)
				return Promise.reject(error)
			})
	}

	public static default() {
		Logger.logUBT("Nothing to do.")
	}
}