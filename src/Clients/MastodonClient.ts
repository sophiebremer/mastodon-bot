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
        this.mastodon = new Mastodon.API(authConfig);
    }

    /* *
     *
     *  Properties
     *
     * */

    private readonly authConfig: MastodonClient.AuthConfig;

    public readonly config: MastodonClient.Config;

    protected mastodon: Mastodon.API;

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
        const limit = config.limit;
        const mastodon = this.mastodon;
        const sensitive = config.sensitive;
        const signature = (config.signature || '');

        let counter = 0;
        let result: Mastodon.API.Success<Mastodon.JSON.Status>;

        for (const item of items) {

            if (await this.isKnownUID(item.uid)) {
                continue;
            }

            if (limit && counter >= limit) {
                break;
            }

            counter++;

            result = await mastodon.postNewStatus(
                item.title && sensitive ?
                    {
                        sensitive,
                        spoiler_text: item.title,
                        status: Utilities.assembleString(
                            (item.text || '').trim(),
                            (item.link || signature ? '\n' : '') +
                            (item.link ? `\n${item.link}` : '') +
                            (signature ? `\n${signature}` : ''),
                            500
                        )
                    } :
                    {
                        sensitive,
                        status: Utilities.assembleString(
                            (item.title ? `${item.title}\n\n` : '') +
                            (item.text || '').trim(),
                            (item.link || signature ? '\n' : '') +
                            (item.link ? `\n${item.link}` : '') +
                            (signature ? `\n${signature}` : ''),
                            500
                        )
                    }
            );

            await this.saveUID(item.uid, 1); // (typeof result.json?.id === 'string' ? 1 : 0));

            await mastodon.delay();
        }

        console.log(`Posted ${counter || items.length} item(s)`);
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

    export interface AuthConfig extends Mastodon.API.Config {
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
