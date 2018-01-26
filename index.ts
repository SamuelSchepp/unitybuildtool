import {Logger} from "./lib/Logger"
import {Helper} from "./lib/Helper"
import {Tool} from "./lib/Tool"
import {GlobalParameters} from "./lib/GlobalParameters"

const program = require('commander');

Logger.boxed(`Unity Build Tool ${Helper.getVersion()}`);


program
	.command('init')
	.description('Init project with ubt.json file')
	.action(function() {
		Tool.init()
	});

program
	.command('install')
	.description(`Installs build tools into Unity3D project`)
	.action((options: any) => {
		Tool.install()
	});

program
	.command('run')
	.description(`Run all targets as described in ${Helper.ubtFileName}`)
	.option("-t, --target [target]", "Specifiy target")
	.option("-i, --interactive", "Open Unity GUI to be able to interact with modal windows.")
	.action((options: any) => {
		Promise.resolve()
			.then(() => {
				if (options["interactive"]) {
					GlobalParameters.Interactive = true;
				}
				if(options["target"]) {
					return Tool.run(options["target"])
				}
				else {
					return Tool.runAll()
				}
			})
			.catch((error) => {
				Logger.logUBT(`Run failed: ${error}`)
				process.exit(1)
			})
	});


program
	.command('list')
	.description(`List all targets as described in ${Helper.ubtFileName}`)
	.action((options: any) => {
		Promise.resolve()
			.then(() => {
				Logger.logUBT(`${Object.keys(Helper.GetTargetList()).join(", ")}.`);
			})
			.catch((error) => {
				Logger.logUBT(`List failed: ${error}`)
				process.exit(1)
			})
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