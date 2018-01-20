import {Helper} from "./Helper"
import * as fs from "fs"
import {Logger} from "./Logger"
import * as path from "path"

export class TestConfiguration {
	public unityPath: string;

	public ParseFromObject(obj: any, ubt: UBTFile): void {
		if(obj && obj["unityPath"]) {
			this.unityPath = obj["unityPath"]
		} else {
			if(ubt.unityPath) {
				this.unityPath = ubt.unityPath;
			}
			else {
				this.unityPath = defaults.unityPath
			}
		}
	}

	public toString(): string {
		return JSON.stringify(this, null, 2)
	}
}

export class BuildConfiguration extends TestConfiguration {
	public developmentBuild: boolean;
	public artifactName: string;

	public ParseFromObject(obj: any, ubt: UBTFile): void {
		this.developmentBuild = obj["developmentBuild"]
		this.artifactName = obj["artifactName"]

		if(!this.developmentBuild) {
			if(ubt.developmentBuild) {
				this.developmentBuild = ubt.developmentBuild;
			}
			else {
				this.developmentBuild = defaults.developmentBuild
			}
		}

		if(!this.artifactName) {
			if(ubt.artifactName) {
				this.artifactName = ubt.artifactName;
			}
			else {
				this.artifactName = defaults.artifactName
			}
		}

		super.ParseFromObject(obj, ubt)
	}
}

export class Target extends BuildConfiguration {
	public platform: string;

	public ParseFromObject(obj: any, ubt: UBTFile): void {
		this.platform = obj["platform"]

		if(!this.platform) {
			this.platform = defaults.platform
		}

		super.ParseFromObject(obj, ubt);
	}

	public toString(): string {
		return JSON.stringify(this, null, 2)
	}
}

export class UBTFile extends BuildConfiguration {
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

	public targets: {[key: string]: Target}
	public test: TestConfiguration

	constructor() {
		super()
		this.targets = {}
	}

	public toString(): string {
		return JSON.stringify(this, null, 2)
	}

	public ParseFromObject(obj: any): void {
		super.ParseFromObject(obj, this);

		if(obj["targets"]) {
			Object.keys(obj["targets"]).forEach((key: string) => {
				const t = new Target()
				t.ParseFromObject(obj["targets"][key], this)
				this.targets[key] = t
			})
		}

		this.test = new TestConfiguration()
		this.test.ParseFromObject(obj["test"], this)
	}

	public GetTargetConfig(target: string): Target {
		if(!this.targets[target]) {
			return defaults
		}
		else {
			return this.targets[target];
		}
	}

	public GetTestConfig(): TestConfiguration {
		if(!this.test) {
			return defaults
		}
		else {
			return this.test;
		}
	}
}

const defaults = new Target()
Helper.RunForPlatform(() => {
	defaults.unityPath = "C:\\Program Files\\Unity\\Editor\\Unity.exe"
	defaults.platform = "android"
}, () => {
	defaults.unityPath = "/Applications/Unity/Unity.app/Contents/MacOS/Unity"
	defaults.platform = "ios"
})
defaults.developmentBuild = false
defaults.artifactName = path.basename(process.cwd())