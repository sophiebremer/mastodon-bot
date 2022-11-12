/* *
 *
 *  Imports
 *
 * */

import Client from './Client.js';
import {
    MastodonAPI,
    MastodonStatus
} from 'tsl-mastodon-api';
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
        this.mastodon = new MastodonAPI(authConfig);
    }

    /* *
     *
     *  Properties
     *
     * */

    private readonly authConfig: MastodonClient.AuthConfig;

    public readonly config: MastodonClient.Config;

    protected mastodon: MastodonAPI;

    /* *
     *
     *  Functions
     *
     * */

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
        const mastodon = this.mastodon;
        const sensitive = config.sensitive;
        const signature = config.signature || '';
        const stdout = process.stdout;

        let result: MastodonAPI.Success<MastodonStatus>;

        stdout.write(`Posting ${items.length} item(s)`);

        for (const item of items) {

            result = await mastodon.post('statuses', {
                sensitive,
                status: Utilities.assembleString(
                    (item.text || '').trim(),
                    (item.link || signature ? '\n' : '') +
                    (item.link ? `\n${item.link}` : '') +
                    (signature ? `\n${signature}` : ''),
                    500
                )
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
