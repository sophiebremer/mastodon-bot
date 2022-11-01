import * as Bot from './index.js';
import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
Yargs(hideBin(process.argv))
    .command('* [config]', false, function (yargs) {
    return yargs.positional('config', {
        default: 'config.json',
        description: 'Path to config'
    });
}, function (argv) {
    Bot.Transformer.run(Bot.Config.load(argv.config));
})
    .parse();
