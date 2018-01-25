import {Logger} from "./Logger"
import {Helper} from "./Helper"
import * as fs from "fs"
import {exec, spawnSync} from "child_process"
import {Process} from "./Process"
import * as path from "path"

const { spawn } = require('child_process');

export class Tool {
	public static init() {
		Helper.AssertUnityProjectFolder()

		Logger.logUBT(`Initializing ${Helper.ubtFileName} @ ${process.cwd()}`)

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
		}, null, 2)

		fs.writeFileSync(Helper.ubtFileName, data)

		Logger.logUBT(data)
	}

	public static runAll(): Promise<void> {
		return Promise.resolve()
			.then(() => {
				Logger.logUBT("Running all targets")

				const allTargetsList = Object.keys(Helper.GetTargetList());
				Logger.logUBT(`Targets found: ${allTargetsList.join(", ")}.`)

				return allTargetsList.reduce((p: any, fn: any) => p.then(() => this.run(fn)), Promise.resolve())
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
				Logger.logPrefix(`config: ${JSON.stringify(Helper.GetTargetData(target), null, 2)}`, target);

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