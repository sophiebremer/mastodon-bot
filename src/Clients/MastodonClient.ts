/* *
 *
 *  Imports
 *
 * */

import type * as MastodonAPI from 'mastodon-api';

import Client from './Client.js';
import Mastodon = require('mastodon-api');

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

        this.config = clientConfig;
        this.mastodon = new (Mastodon as any)(authConfig);
    }

    /* *
     *
     *  Properties
     *
     * */

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
        const account = await this.get('accounts/verify_credentials');
        return (
            account.last_status_at ?
                Date.parse(account.last_status_at) :
                new Date().getTime()
        );
    }

    protected post(
        path: string,
        params: Record<string, any> = {}
    ): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mastodon.post(path, params, (err, data) => (
                err ? reject(err) : resolve(data)
            )); 
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

        let schedule = 60000 * 6 + new Date().getTime();

        stdout.write(`\nPosting ${items.length} item(s) scheduled for ${new Date(schedule).toUTCString()}`);

        for (const item of items) {

            await this.post('statuses', {
                status: (
                    (item.text || '')
                        .trim()
                        .substring(0, 498 - (item.link || '').length - signature.length)
                    + '\n'
                    + item.link
                    + '\n'
                    + signature
                ),
                schedule_at: new Date(schedule).toISOString()
            });

            process.stdout.write('.');

            schedule += 61000;

            await this.delay(1000);
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
