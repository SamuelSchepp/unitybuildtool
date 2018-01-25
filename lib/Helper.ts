import * as os from "os"
import * as fs from "fs"
import {Logger} from "./Logger"
import {UnityBuildTool} from "./UnityBuildTool.cs"
import * as path from "path"
import {isArray, isBoolean, isString} from "util"
const AppDirectory = require('appdirectory')

declare var __VERSION__: string;

export class Helper {

	private static UBTJson: any = undefined;

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
		this.AssertUnityProjectFolder()

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

	public static GetUnityPathForVersion(versionID: string): string {
		const obj = this.GetUnityHubEditorsData();

		if(!Object.keys(obj).includes(versionID)) {
			throw Error(`Unity version ${versionID} not installed in Unity Hub.`)
		}

		let p = ""
		try {
			p = obj[versionID][`location`]
		}
		catch(err) {
			throw Error(`Unity Hub database is not readable (new Unity Hub version?).`)
		}

		if(p == undefined) {
			throw Error("Unity Hub database is not readable (new Unity Hub version?).")
		}

		this.RunForPlatform(() => {}, () => {
			p = path.resolve(p, "Contents", "MacOS", "Unity")
		})

		return p;
	}

	public static GetUnityHubEditorsData(): any {
		const dirs = new AppDirectory('UnityHub')
		const p = path.resolve(dirs.userData(), `editors.json`)

		if(!fs.existsSync(p)) {
			throw Error(`Unity Hub database does not exist. (${p})`)
		}

		try {
			return JSON.parse(fs.readFileSync(p).toString());
		} catch(err) {
			throw Error(`Couldn't parse Unity Hub database (${err})`)
		}
	}

	public static GetTargetData(target: string): any {
		let targets = Object.keys(this.GetTargetList());
		if(!targets.includes(target)) {
			throw Error(`Target ${target} not found. Found targets are: ${targets.join(", ")}`)
		}

		return this.GetTargetList()[target];
	}

	public static GetTargetList(): any {
		if(!Object.keys(Helper.GetUBTJson()).includes(`targets`)) {
			throw Error(`No target definitions found. Add the top-level property "targets" to ${Helper.ubtFileName}`)
		}

		return Helper.GetUBTJson()[`targets`];
	}

	public static GetUBTJson(): any {
		if (Helper.UBTJson == undefined) {
			if (!fs.existsSync(Helper.ubtFileName)) {
				throw Error(`File ${Helper.ubtFileName} not found in working directory.`)
			}

			try {
				Helper.UBTJson = JSON.parse(fs.readFileSync(Helper.ubtFileName).toString());
			}
			catch (err) {
				throw Error(`Couldn't read ${Helper.ubtFileName} (${err})`)
			}
		}

		return Helper.UBTJson;
	}

	public static AssertUnityProjectFolder(): void {
		if(!fs.existsSync(`Assets`)) {
			throw Error(`The current folder is not the root of a Unity project (no assets folder).`)
		}
	}


	public static readonly ubtFileName = "ubt.json";
	public static readonly BuildToolCSharpClass = "UnityBuildTool";
	public static readonly UnityLogFilePath = "./unity_log.txt";
}