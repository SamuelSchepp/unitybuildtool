import {GlobalParameters} from "./GlobalParameters"

export class Logger {
	public static logUBT(msg: string): void {
		this.logPrefix(msg, "UBT")
	}

	public static logUnity(target: string, msg: string): void {
		this.logPrefix(msg, `Unity3D ${target}`)
	}

	public static logError(msg: string): void {
		this.logPrefix(msg, "ERROR")
	}

	public static logPrefix(msg: string, prefix: string): void {
		if(GlobalParameters.Silent) {
			return;
		}

		const date = new Date();

		msg.split("\n").forEach(line => {
			console.log(`[${prefix}] ${line}`)
		})
	}

	public static boxed(msg: string): void {
		if(GlobalParameters.Silent) {
			return;
		}

		var lines: string = "";
		for(let i = 0; i < msg.length; i++) {
			lines += "─"
		}

		console.log(`┌─${lines}─┐`);
		console.log(`│ ${msg} │`);
		console.log(`└─${lines}─┘`);
	}
}