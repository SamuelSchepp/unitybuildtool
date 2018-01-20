import {exec, spawn, spawnSync} from "child_process"
import {Target, UBTFile} from "./ubt.json"
import {Helper} from "./Helper"
import {Logger} from "./Logger"
import * as fs from "fs"
const Tail = require('tail').Tail;

export class Process {
	private tail: any;

	private static getUnityCommand(target: string): {command: string, args: string[]} {
		let command: string = ""
		let args: string[] = []

		command = `${UBTFile.GetInstance().GetTarget(target).GetUnityPath()}`;
		args.push("-batchmode")

		args.push("-logFile")
		args.push(`${process.cwd()}/${Helper.UnityLogFilePath}`)

		args.push("-projectPath")
		args.push(process.cwd())

		if(UBTFile.GetInstance().GetTarget(target).GetTest()) {
			args.push("-runTests")
			args.push("-testPlatform")
			args.push(`playmode`)
		}
		else {
			args.push("-executeMethod")
			args.push(`Editor.${Helper.BuildToolCSharpClass}.Perform`)

			args.push("-quit")

			args.push(UBTFile.GetInstance().GetTarget(target).GetArtifactName())
			args.push(`${UBTFile.GetInstance().GetTarget(target).GetDevelopmentBuild()}`)
			args.push(`${UBTFile.GetInstance().GetTarget(target).GetPlatform()}`)
		}



		Logger.logPrefix(`Command: `, target);
		Logger.logPrefix(command, target);
		args.forEach(arg => Logger.logPrefix(arg, target))
		Logger.logPrefix(``, target);

		return {command, args};
	}

	public ExecuteUnity(target: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			let command = Process.getUnityCommand(target)
			Logger.logPrefix("Starting unity process", target)
			const child = spawn(command.command, command.args);

			this.tail = new Tail(Helper.UnityLogFilePath);

			this.tail.on("line", function(data: string) {
				Logger.logUnity(target, data)
			});

			this.tail.on("error", function(error: Error) {
				this.shutdown();
				reject(error);
			});

			child.on("exit", (code, signal) => {
				Logger.logPrefix(`Unity process exited with code ${code}`, target);
				this.shutdown();
				if(code == 0) {
					resolve();
				}
				else {
					reject(new Error(`Unity exited with exit code ${code}`))
				}
			})
			child.on("error", (error) => {
				Logger.logPrefix(`Unity process error`, target);
				this.shutdown();
				reject(error);
			})
		});
	}


	public shutdown() {
		if(this.tail) {
			this.tail.unwatch();
		}
	}
}