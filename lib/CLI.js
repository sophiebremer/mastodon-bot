"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("./Config"));
const yargs_1 = __importDefault(require("yargs/yargs"));
const helpers_1 = require("yargs/helpers");
(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command('mastodon-bot [config]', 'run the bot', yargs => yargs
    .positional('config', {
    describe: 'config to use',
    default: 'config.json'
}), argv => {
    console.log(Config_1.default.load(argv.config || 'config.json'));
})
    .parse();
