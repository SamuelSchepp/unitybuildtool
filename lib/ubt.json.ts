import {Helper} from "./Helper"
import * as fs from "fs"
import {Logger} from "./Logger"

export class UBTFile {
	private static instance: UBTFile;
	public static GetInstance(): UBTFile {
		if(!UBTFile.instance) {
			UBTFile.instance = UBTFile.load()
		}
		return UBTFile.instance
	}

	public targets: {[key: string]: Target} = {}

	public toString(): string {
		return JSON.stringify(this, null, 2)
	}

	private static load(): UBTFile {
		var data = fs.readFileSync(Helper.ubtFilePath).toString();
		var obj = JSON.parse(data)

		var inst = new UBTFile()
		Object.keys(obj["targets"]).forEach((key: string) => {
			inst.targets[key] = Target.FromObj(obj["targets"][key])
		})
		if(!inst.targets) {
			inst.targets = {}
		}

		Logger.logUBT(inst.toString())

		return inst;
	}

}

export class Target {
	public unityPath: string;
	public platform: string;

	public static FromObj(obj: any) {
		const target = new Target()
		target.unityPath = obj["unityPath"]
		target.platform = obj["platform"]
		return target
	}

	public toString(): string {
		return JSON.stringify(this, null, 2)
	}
}