import * as os from "os"
import * as fs from "fs"

export class Helper {

	public static getVersion(): string {
		let pck = require("../package.json");
		return pck["version"];
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
		fs.copyFileSync(
			`${__dirname}/../media/${Helper.BuildToolCSharpClass}.cs`,
			`Assets/Editor/${Helper.BuildToolCSharpClass}.cs`)
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

	public static readonly ubtFilePath = "./ubt.json";
	public static readonly BuildToolCSharpClass = "UnityBuildTool";
	public static readonly UnityLogFilePath = "./unity_log.txt";
}