import {Logger} from "./lib/Logger"
import {Helper} from "./lib/Helper"
import {Tool} from "./lib/Tool"
import {GlobalParameters} from "./lib/GlobalParameters"

const program = require('commander');

Logger.boxed(`Unity Build Tool ${Helper.getVersion()}`);


const errorHandler = (error: Error) => {
	Logger.logUBT(`Task failed: ${error}`)
	process.exit(1)
}

program
	.command('init')
	.description('Init project with ubt.json file')
	.action(async () => {
		try {
			await Tool.init()
		} catch(err) {
			errorHandler(err);
		}
	});

program
	.command('install')
	.description(`Installs build tools into Unity3D project`)
	.action(async (options: any) => {
		try {
			await Tool.install()
		} catch(err) {
			errorHandler(err);
		}
	});

program
	.command('run')
	.description(`Run all targets as described in ${Helper.ubtFileName}`)
	.option("-t, --target [target]", "Specifiy target")
	.option("-i, --interactive", "Open Unity GUI to be able to interact with modal windows.")
	.action(async (options: any) => {
		try {
			if (options["interactive"]) {
				GlobalParameters.Interactive = true;
			}
			if(options["target"]) {
				await Tool.run(options["target"])
			}
			else {
				await Tool.runAll()
			}
		} catch(err) {
			errorHandler(err);
		}
	});


program
	.command('list')
	.description(`List all targets as described in ${Helper.ubtFileName}`)
	.action((options: any) => {
		try {
			Logger.logUBT(`${Object.keys(Helper.GetTargetList()).join(", ")}.`);
		} catch(err) {
			errorHandler(err);
		}
	});


program
	.option("-l, --nolog", "Hides Unity log. Default application log will still be visible.")
	.option("-s, --silent", "Don't show any log.")
	.parse(process.argv);

if (program.nolog) {
	GlobalParameters.NoLog = true;
}

if (program.silent) {
	GlobalParameters.Silent = true;
}