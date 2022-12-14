/* *
 *
 *  Imports
 *
 * */

import type * as MastodonAPI from 'mastodon-api';

import Client from './Client.js';
import Mastodon = require('mastodon-api');
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

    public constructor(
        clientConfig: MastodonClient.Config,
        authConfig?: MastodonClient.AuthConfig
    ) {
        super(clientConfig);

        if (!authConfig) {
            throw new Error('Authentication missing');
        }

        this.authConfig = authConfig;
        this.config = clientConfig;
        this.mastodon = new (Mastodon as any)(authConfig);
    }

    /* *
     *
     *  Properties
     *
     * */

    private readonly authConfig: MastodonClient.AuthConfig;

    public readonly config: MastodonClient.Config;

    protected mastodon: MastodonAPI.default; // type confusion

    /* *
     *
     *  Functions
     *
     * */

    protected get(
        path: string,
        params: Record<string, any> = {}
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mastodon.get(path, params, (err, data) => (
                err ? reject(err) : resolve(data)
            ));
        });
    }

    protected post(
        path: string,
        params: Record<string, any> = {}
    ): Promise<number> {
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

    public async setItems(
        items: Array<Client.Item>
    ): Promise<void> {

        if (this.mode !== 'target') {
            throw new Error('Client is not in target mode');
        }

        if (!items.length) {
            return;
        }

        const config = this.config as MastodonClient.TargetConfig;
        const sensitive = config.sensitive;
        const signature = config.signature || '';
        const stdout = process.stdout;

        let delay: number;

        stdout.write(`Posting ${items.length} item(s)`);

        for (const item of items) {

            delay = await this.post('statuses', {
                sensitive,
                status: Utilities.assembleString(
                    (item.text || '').trim(),
                    (item.link || signature ? '\n' : '') +
                    (item.link ? `\n${item.link}` : '') +
                    (signature ? `\n${signature}` : ''),
                    500
                )
            });

            stdout.write('.');

            await this.delay(delay);
        }

        stdout.write(' - done.\n');
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

export namespace MastodonClient {

    /* *
     *
     *  Declarations
     *
     * */

    export interface AuthConfig extends MastodonAPI.Config {
        // nothing to add
    }

    export type Config = (SourceConfig|TargetConfig);

    export interface SourceConfig extends Client.SourceConfig {
        source_type: 'mastodon';
    }

    export interface TargetConfig extends Client.TargetConfig {
        target_type: 'mastodon';
        sensitive?: boolean;
        signature?: string;
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
