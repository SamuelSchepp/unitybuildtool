import {Helper} from "./Helper"
import * as fs from "fs"
import {Logger} from "./Logger"
import * as path from "path"

export class Target {
	private platform: string;
	private developmentBuild: boolean;
	private artifactName: string;
	private unityPath: string;
	private test: boolean;

	public ParseFromObject(obj: any): void {
		if(obj) {
			this.platform = obj["platform"]
			this.developmentBuild = obj["developmentBuild"]
			this.artifactName = obj["artifactName"]
			this.unityPath = obj["unityPath"]
			this.test = obj["test"]
		}
	}

	public toString(): string {
		return JSON.stringify(this, null, 2)
	}

	public GetPlatform(): string {
		if(Helper.EmptyOrUndefinded(this.platform)) {
			throw Error(`No platform set.`)
		}
		return this.platform
	}

	public GetDevelopmentBuild(): boolean {
		if(Helper.EmptyOrUndefinded(this.developmentBuild)) {
			return false
		}
		return this.developmentBuild
	}

	public GetArtifactName(): string {
		if(Helper.EmptyOrUndefinded(this.artifactName)) {
			return path.basename(process.cwd())
		}
		return this.artifactName
	}

	public GetUnityPath(): string {
		if(Helper.EmptyOrUndefinded(this.unityPath)) {
			throw Error(`No unityPath set.`)
		}
		return this.unityPath
	}

	public GetTest(): boolean {
		if(Helper.EmptyOrUndefinded(this.test)) {
			return false
		}
		return this.test
	}
}

export class UBTFile {
	private static instance: UBTFile;
	public static GetInstance(): UBTFile {
		if(!UBTFile.instance) {
			var data = fs.readFileSync(Helper.ubtFileName).toString();
			var obj = JSON.parse(data)
			UBTFile.instance = new UBTFile()
			UBTFile.instance.ParseFromObject(obj)
		}
		return UBTFile.instance
	}

	private targets: {[key: string]: Target}

	constructor() {
		this.targets = {}
	}

	public toString(): string {
		return JSON.stringify(this, null, 2)
	}

	public ParseFromObject(obj: any): void {
		if(obj && obj["targets"]) {
			Object.keys(obj["targets"]).forEach((key: string) => {
				const t = new Target()
				t.ParseFromObject(obj["targets"][key])
				this.targets[key] = t
			})
		}
	}

	public GetTarget(target: string): Target {
		if(this.targets[target]) {
			return this.targets[target]
		}
		else {
			throw Error(`Target ${target} not found.`)
		}
	}

	public GetAlltargets(): string[] {
		return Object.keys(this.targets)
	}
}
