import {Logger} from "./lib/Logger"
import {Helper} from "./lib/Helper"
import {Tool} from "./lib/Tool"

const program = require('commander');

Logger.boxed(`Unity Build Tool ${Helper.getVersion()}`);

program
	.command('init')
	.description('Init project with ubt.json file')
	.action(function() {
		Tool.init()
	});

program
	.command('build')
	.option("-t, --target [target]", "Specifiy target")
	.action((options: any) => {
		Promise.resolve()
			.then(() => {
				if(options["target"]) {
					return Tool.build(options["target"])
				}
				else {
					return Tool.buildAll()
				}
			})
			.catch((error) => {
				Logger.logUBT(`Build failed`)
				process.exit(1)
			})
	});

program.parse(process.argv);
