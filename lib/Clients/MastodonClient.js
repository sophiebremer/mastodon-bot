/* *
 *
 *  Imports
 *
 * */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
import Client from './Client.js';
const Mastodon = __require("mastodon-api");
/* *
 *
 *  Class
 *
 * */
export class MastodonClient extends Client {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(clientConfig, authConfig) {
        super(clientConfig);
        if (!authConfig) {
            throw new Error('Authentication missing');
        }
        this.config = clientConfig;
        this.mastodon = new Mastodon(authConfig);
    }
    /* *
     *
     *  Functions
     *
     * */
    get(path, params = {}) {
        return new Promise((resolve, reject) => {
            this.mastodon.get(path, params, (err, data) => (err ? reject(err) : resolve(data)));
        });
    }
    getTimestamp() {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.get('accounts/verify_credentials');
            return (account.last_status_at ?
                Date.parse(account.last_status_at) :
                new Date().getTime());
        });
    }
    post(path, params = {}) {
        return new Promise((resolve, reject) => {
            this.mastodon.post(path, params, (err, data) => (err ? reject(err) : resolve(data)));
        });
    }
    setItems(items) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mode !== 'target') {
                throw new Error('Client is not in target mode');
            }
            if (!items.length) {
                return;
            }
            const config = this.config;
            const signature = config.signature || '';
            const stdout = process.stdout;
            let schedule = 60000 * 6 + new Date().getTime();
            stdout.write(`\nPosting ${items.length} item(s) scheduled for ${new Date(schedule).toUTCString()}`);
            for (const item of items) {
                yield this.post('statuses', {
                    status: ((item.text || '')
                        .trim()
                        .substring(0, 498 - (item.link || '').length - signature.length)
                        + '\n'
                        + item.link
                        + '\n'
                        + signature),
                    schedule_at: new Date(schedule).toISOString()
                });
                process.stdout.write('.');
                schedule += 61000;
                yield this.delay(1000);
            }
            process.stdout.write('\n');
        });
    }
}
/* *
 *
 *  Registry
 *
 * */
Client.registry.mastodon = MastodonClient;
/* *
 *
 *  Default Export
 *
 * */
export default MastodonClient;
