import {Logger} from "./Logger"
import {Target, UBTFile} from "./ubt.json"
import {Helper} from "./Helper"
import * as fs from "fs"
import {exec, spawnSync} from "child_process"
import {Process} from "./Process"
import * as path from "path"

const { spawn } = require('child_process');

export class Tool {
	public static init() {
		var obj = new UBTFile()
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
		})

		Logger.logUBT(`Initializing ${Helper.ubtFileName} @ ${process.cwd()}`)

		const data = JSON.stringify(obj, null, 2)

		fs.writeFileSync(Helper.ubtFileName, data)

		Logger.logUBT(data)
	}

	public static runAll(): Promise<void> {
		return Promise.resolve()
			.then(() => {
				Logger.logUBT("Running all targets")
				Logger.logUBT(UBTFile.GetInstance().toString())
				return UBTFile.GetInstance().GetAlltargets().reduce((p, fn) => p.then(() => this.run(fn)), Promise.resolve())
			})
			.then(() => {
				Logger.logUBT("Done building all targets")
			})
	}

	public static run(target: string): Promise<void> {
		return Promise.resolve()
			.then(() => {
				Logger.boxed(target)
				Logger.logPrefix(`Running target ${target}`, target)
				Logger.logPrefix(`config: ${UBTFile.GetInstance().GetTarget(target).toString()}`, target);

				Helper.CreateLogFile();

				let outputPath = path.resolve(`build`, target);
				Logger.logPrefix(`Removing ${outputPath}`, target)
				if(fs.existsSync(outputPath)) {
					spawnSync(`rm`, ["-r", outputPath])
				}

				return new Process().ExecuteUnity(target)
			})
			.then(() => {
				Logger.logPrefix(`Done running target ${target}`, target)
			})
	}

	public static install() {
		Helper.CopyUnityBuildScript()
		Logger.logUBT("Done install.")
	}

	public static default() {
		Logger.logUBT("Nothing to do.")
	}
}