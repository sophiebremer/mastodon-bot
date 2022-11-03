/* *
 *
 *  Imports
 *
 * */
import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
import Client from './Client.js';
const Mastodon = __require("mastodon-api");
import Utilities from '../Utilities.js';
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
        this.authConfig = authConfig;
        this.config = clientConfig;
        this.mastodon = new Mastodon(authConfig);
    }
    /* *
     *
     *  Properties
     *
     * */
    authConfig;
    config;
    mastodon; // type confusion
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
    async getTimestamp(latestTimestampKeywords = []) {
        const keywords = !!latestTimestampKeywords.length;
        const limit = keywords ? '' : '?limit=1';
        const accountId = (this.authConfig.account_id ||
            (await this.get('accounts/verify_credentials')).id);
        const statuses = await this.get(`accounts/${accountId}/statuses${limit}`);
        let text;
        for (const status of statuses) {
            text = status.status;
            if (keywords &&
                text &&
                !Utilities.includes(text, latestTimestampKeywords)) {
                continue;
            }
            if (status.created_at) {
                return Date.parse(status.created_at);
            }
        }
        return new Date().getTime();
    }
    post(path, params = {}) {
        return new Promise((resolve, reject) => {
            this.mastodon.post(path, params, (err, data, response) => {
                if (err) {
                    return reject(err);
                }
                const rateLimit = parseInt('0' + response.headers['x-ratelimit-remaining'], 10);
                if (rateLimit) {
                    resolve(300000 / rateLimit);
                }
                else {
                    resolve(6000);
                }
            });
        });
    }
    async setItems(items) {
        if (this.mode !== 'target') {
            throw new Error('Client is not in target mode');
        }
        if (!items.length) {
            return;
        }
        const config = this.config;
        const signature = config.signature || '';
        const stdout = process.stdout;
        let delay;
        stdout.write(`\nPosting ${items.length} item(s)`);
        for (const item of items) {
            delay = await this.post('statuses', {
                status: Utilities.assembleString((item.text || '').trim(), (item.link || signature ? '\n' : '') +
                    (item.link ? `\n${item.link}` : '') +
                    (signature ? `\n${signature}` : ''), 500)
            });
            process.stdout.write('.');
            await this.delay(delay);
        }
        process.stdout.write('\n');
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
