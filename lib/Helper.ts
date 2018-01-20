import * as os from "os"
import * as fs from "fs"
import {Logger} from "./Logger"
import {UnityBuildTool} from "./UnityBuildTool.cs"
import * as path from "path"

declare var __VERSION__: string;

export class Helper {

	public static getVersion(): string {
		return __VERSION__;
	}

	public static RunForPlatform(windows: () => void, mac: () => void): void {
		if(this.IsWindows()) {
			windows();
		}
		else if(this.IsMac()) {
			mac();
		}
		else {
			throw Error("Unknwon platform: " + os.platform())
		}
	}

	public static CopyUnityBuildScript(): void {
		const p = path.resolve(`Assets`, `Editor`)
		if(!fs.existsSync(p)) {
			fs.mkdirSync(p);
		}

		const dest = path.resolve(p, `${Helper.BuildToolCSharpClass}.cs`)
		Logger.logUBT(`Writing -> ${dest}`)
		fs.writeFileSync(dest, UnityBuildTool.Base64, {encoding: "base64"});
	}

	public static CreateLogFile(): void {
		fs.writeFileSync(Helper.UnityLogFilePath, "")
	}

	private static IsWindows(): boolean {
		return os.platform() === "win32"
	}

	private static IsMac(): boolean {
		return os.platform() === "darwin"
	}

	public static EmptyOrUndefinded(obj: any): boolean {
		return (!obj || obj == undefined || obj == null || obj == "" || (obj.trim && obj.trim() == ""))
	}

	public static readonly ubtFileName = "ubt.json";
	public static readonly BuildToolCSharpClass = "UnityBuildTool";
	public static readonly UnityLogFilePath = "./unity_log.txt";
}