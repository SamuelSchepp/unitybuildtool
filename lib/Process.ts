import {exec, spawn, spawnSync} from "child_process"
import {Helper} from "./Helper"
import {Logger} from "./Logger"
import * as fs from "fs"
import {TargetDataReader} from "./TargetDataReader"
import {GlobalParameters} from "./GlobalParameters"
const Tail = require('tail').Tail;

export class Process {
	private tail: any;

	private static getUnityCommand(target: string): { command: string, args: string[] } {
		let command: string = ""
		let args: string[] = []

		command = `${Helper.GetUnityPathForTarget(target)}`;
		args.push("-batchmode")

		args.push("-logFile")
		args.push(`${process.cwd()}/${Helper.UnityLogFilePath}`)

		args.push("-projectPath")
		args.push(process.cwd())

		if (TargetDataReader.IsTest(target)) {
			args.push("-runTests")
			args.push("-testPlatform")
			args.push(`playmode`)
		}
		else {
			args.push("-executeMethod")
			args.push(`Editor.${Helper.BuildToolCSharpClass}.Perform`)

			args.push("-quit")

			args.push(target)
			args.push(TargetDataReader.GetArtifactName(target))
			args.push(`${TargetDataReader.IsDevelopmentBuild(target)}`)
			args.push(`${TargetDataReader.GetPlatform(target)}`)
		}

		Logger.logPrefix(`Command: `, target);
		Logger.logPrefix(`${command} ${args.join(" ")}`, target);
		Logger.logPrefix(``, target);

		return {command, args};
	}

	public ExecuteUnity(target: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			Helper.AssertUnityProjectFolder()

			let command = Process.getUnityCommand(target)
			Logger.logPrefix(`Starting unity process.`, target)

			const child = spawn(command.command, command.args);

			Logger.logPrefix("Waiting for Unity to finish executing.", target)

			if (!GlobalParameters.NoLog) {
				Logger.logPrefix(`Log files will then be cat'ed.`, target);
			}

			child.on("exit", (code, signal) => {
				if (!GlobalParameters.NoLog) {
					Logger.logUnity(target, fs.readFileSync(Helper.UnityLogFilePath).toString())
				}

				Logger.logPrefix(`Unity process exited with code ${code}`, target);

				if (code == 0) {
					resolve();
				}
				else {
					reject(`Unity exited with exit code ${code}`);
				}
			})

			child.on("error", (error) => {
				reject(`Unity process error: ${error}`);
			})

			child.on("close", (code, signal) => {
				reject(`Unity process error. code: ${code}, signal: ${signal}`);
			})

			child.on("disconnect", () => {
				reject(`Unity process disconnected`);
			})

			child.on("message", (message) => {
				reject(`Unity process message: ${message}`);
			})
		})
	}
}