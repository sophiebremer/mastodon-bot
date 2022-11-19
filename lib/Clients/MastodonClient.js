/* *
 *
 *  Imports
 *
 * */
import * as Mastodon from 'tsl-mastodon-api';
import Client from './Client.js';
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
        this.mastodon = new Mastodon.API(authConfig);
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
        const limit = config.limit;
        const mastodon = this.mastodon;
        const sensitive = config.sensitive;
        const signature = (config.signature || '');
        let counter = 0;
        let result;
        for (const item of items) {
            if (await this.isKnownUID(item.uid)) {
                continue;
            }
            result = await mastodon.postNewStatus(item.title && sensitive ?
                {
                    sensitive,
                    spoiler_text: item.title,
                    status: Utilities.assembleString((item.text || '').trim(), (item.link || signature ? '\n' : '') +
                        (item.link ? `\n${item.link}` : '') +
                        (signature ? `\n${signature}` : ''), 500)
                } :
                {
                    sensitive,
                    status: Utilities.assembleString((item.title ? `${item.title}\n\n` : '') +
                        (item.text || '').trim(), (item.link || signature ? '\n' : '') +
                        (item.link ? `\n${item.link}` : '') +
                        (signature ? `\n${signature}` : ''), 500)
                });
            await this.saveUID(item.uid, typeof result.json?.id === 'string' ? 1 : 0);
            if (limit && ++counter >= limit) {
                break;
            }
            await mastodon.delay();
        }
        console.log(`Posted ${counter || items.length} item(s)`);
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
