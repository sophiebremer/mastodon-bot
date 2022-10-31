import Config from './Config';
import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

Yargs(hideBin(process.argv))
    .command(
        '* [config]',
        false,
        function (yargs) {
            return yargs.positional('config', {
                default: 'config.json',
                description: 'Path to config'
            });
        },
        function (argv) {
            console.log(Config.load(argv.config));
        }
    )
    .parse();
