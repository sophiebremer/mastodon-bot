/* *
 *
 *  Imports
 *
 * */
import Client from './Client.js';
import { MastodonAPI } from 'tsl-mastodon-api';
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
        this.mastodon = new MastodonAPI(authConfig);
    }
    /* *
     *
     *  Properties
     *
     * */
    authConfig;
    config;
    mastodon;
    /* *
     *
     *  Functions
     *
     * */
    async setItems(items) {
        if (this.mode !== 'target') {
            throw new Error('Client is not in target mode');
        }
        if (!items.length) {
            return;
        }
        const config = this.config;
        const mastodon = this.mastodon;
        const sensitive = config.sensitive;
        const signature = config.signature || '';
        const stdout = process.stdout;
        let result;
        stdout.write(`Posting ${items.length} item(s)`);
        for (const item of items) {
            result = await mastodon.post('statuses', {
                sensitive,
                status: Utilities.assembleString((item.text || '').trim(), (item.link || signature ? '\n' : '') +
                    (item.link ? `\n${item.link}` : '') +
                    (signature ? `\n${signature}` : ''), 500)
            });
            if (typeof result.json?.id === 'number') {
                stdout.write('.');
            }
            else {
                stdout.write('x');
            }
            await mastodon.delay();
        }
        stdout.write(' - done.\n');
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
