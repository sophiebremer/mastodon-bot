/* *
 *
 *  Imports
 *
 * */
import * as Bot from './index.js';
/* *
 *
 *  Constants
 *
 * */
const HELP = `
mastodon-bot <config>

Argument:
  <config>    : Path to config

Options:
  --help, -h  : This help
`;
/* *
 *
 *  Functions
 *
 * */
async function main() {
    const argv = process.argv.slice(2);
    const config = argv.slice(-1)[0] || 'config.json';
    if (argv.includes('-h') ||
        argv.includes('--help')) {
        console.log(HELP);
        process.exit(1);
        return;
    }
    try {
        await Bot.Transformer.run(Bot.Config.load(config));
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
/* *
 *
 *  Default Function
 *
 * */
main();
