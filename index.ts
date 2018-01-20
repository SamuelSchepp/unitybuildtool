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
	.command('build')
	.description(`Build as described in ${Helper.ubtFileName}`)
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

program
	.command('test')
	.description(`Run Unity3D playmode tests`)
	.action((options: any) => {
		Tool.test()
			.catch((error) => {
				Logger.logUBT(`Test failed`)
				process.exit(1)
			})
	});

program
	.command('load')
	.action((options: any) => {
		UBTFile.GetInstance();
	});

program.parse(process.argv);
