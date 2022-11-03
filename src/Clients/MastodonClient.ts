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

    public async getTimestamp(): Promise<number> {
        const config = this.config as MastodonClient.TargetConfig;
        const statusKeywords = (config.related_status_keywords || []);
        const hasKeywords = !!statusKeywords.length;
        const limit = (hasKeywords ? '' : '?limit=1');
        const accountId = (
            this.authConfig.account_id ||
            (await this.get('accounts/verify_credentials')).id
        );
        const statuses = await this.get(`accounts/${accountId}/statuses${limit}`);

        let timestamp = new Date().getTime();
        let content: string;

        for (const status of statuses) {
            content = status.content;console.log(status);

            if (status.created_at) {
                timestamp = Date.parse(status.created_at);
            }

            if (
                hasKeywords &&
                content &&
                !Utilities.includes(content, statusKeywords)
            ) {
                console.log('continue', timestamp);
                continue;
            }

            console.log('break', timestamp);
            break;
        }

        return timestamp;
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
        const signature = config.signature || '';
        const stdout = process.stdout;

        let delay: number;

        stdout.write(`\nPosting ${items.length} item(s)`);

        for (const item of items) {

            delay = await this.post('statuses', {
                status: Utilities.assembleString(
                    (item.text || '').trim(),
                    (item.link || signature ? '\n' : '') +
                    (item.link ? `\n${item.link}` : '') +
                    (signature ? `\n${signature}` : ''),
                    500
                )
            });

            process.stdout.write('.');

            await this.delay(delay);
        }

        process.stdout.write('\n');
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
        account_id?: number
    }

    export type Config = (SourceConfig|TargetConfig);

    export interface SourceConfig extends Client.SourceConfig {
        source_type: 'mastodon';
    }

    export interface TargetConfig extends Client.TargetConfig {
        target_type: 'mastodon';
        related_status_keywords?: Array<string>;
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
