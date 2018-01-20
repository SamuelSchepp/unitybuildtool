#!/usr/bin/env node

import {Logger} from "./lib/Logger"
import {Helper} from "./lib/Helper"
import {Tool} from "./lib/Tool"
import {UBTFile} from "./lib/ubt.json"

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
	.action((options: any) => {
		Promise.resolve()
			.then(() => {
				if(options["target"]) {
					return Tool.run(options["target"])
				}
				else {
					return Tool.runAll()
				}
			})
			.catch((error) => {
				Logger.logUBT(`Run failed`)
				process.exit(1)
			})
	});


program
	.command('load')
	.action((options: any) => {
		UBTFile.GetInstance();
	});

program.parse(process.argv);
