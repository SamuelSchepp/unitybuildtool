import {Logger} from "./Logger"
import {Helper} from "./Helper"
import * as fs from "fs"
import {exec, spawnSync} from "child_process"
import {Process} from "./Process"
import * as path from "path"
import {TargetDataReader} from "./TargetDataReader"

const { spawn } = require('child_process');

export class Tool {
	public static async init(): Promise<void> {
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

	public static async runAll(): Promise<void> {
		Logger.logUBT("Running all targets")

		const allTargetsList = Object.keys(Helper.GetTargetList());
		Logger.logUBT(`Targets found: ${allTargetsList.join(", ")}.`)

		await allTargetsList.reduce((p: any, fn: any) => p.then(() => this.run(fn)), Promise.resolve())
		Logger.logUBT("Done building all targets")
	}

	public static async run(target: string): Promise<void> {
		Logger.boxed(target)
		Logger.logPrefix(`Running target ${target}`, target)
		Logger.logPrefix(`config: ${JSON.stringify(Helper.GetTargetData(target), null, 2)}`, target);

		Helper.CreateLogFile();

		let outputPath = Helper.GetOutputPath(target);
		Logger.logPrefix(`Removing ${outputPath}`, target)
		if(fs.existsSync(outputPath)) {
			spawnSync(`rm`, ["-r", outputPath])
		}

		await new Process().ExecuteUnity(target)

		if(!TargetDataReader.IsSolution(target)) {
			if (!fs.existsSync(Helper.GetOutputPath(target))) {
				throw Error(`Unity exited without error but the build artifact does not exist.`);
			}
		}

		Logger.logPrefix(`Done running target ${target}`, target);
	}

	public static async install(): Promise<void> {
		Helper.CopyUnityBuildScript()
		Logger.logUBT("Done install.")
	}

	public static default() {
		Logger.logUBT("Nothing to do.")
	}
}