import {isBoolean, isString} from "util"
import {Helper} from "./Helper"

export class TargetDataReader {
	private static ReadField(field: string, target: string, validator: (i: any) => boolean, defaultValue: any = undefined): any {
		let targetData = Helper.GetTargetData(target);

		if (!Object.keys(targetData).includes(field)) {
			if(defaultValue == undefined) {
				throw Error(`Property ${field} of target ${target} not set.`)
			} else {
				return defaultValue
			}
		}

		const value = targetData[field]

		if(!validator(value)) {
			throw Error(`Property ${field} has wrong data type.`)
		}

		return value;
	}

	public static IsTest(target: string): boolean {
		return this.ReadField("test", target, isBoolean, false);
	}

	public static IsSolution(target: string): boolean {
		return this.ReadField("solution", target, isBoolean, false);
	}

	public static IsDevelopmentBuild(target: string): boolean {
		return this.ReadField("developmentBuild", target, isBoolean, false);
	}

	public static GetArtifactName(target: string): string {
		return this.ReadField("artifactName", target, isString);
	}

	public static GetUnityVersion(target: string): string {
		return this.ReadField("unityVersion", target, isString);
	}

	public static GetPlatform(target: string): string {
		return this.ReadField("platform", target, isString);
	}
}