import Config from './Config';
import Yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

Yargs(hideBin(process.argv))
    .command(
        'mastodon-bot [config]',
        'run the bot',
        yargs => yargs
            .positional('config', {
                describe: 'config to use',
                default: 'config.json'
            }),
        argv => {
            console.log(Config.load(argv.config || 'config.json'));
        }
    )
    .parse();
