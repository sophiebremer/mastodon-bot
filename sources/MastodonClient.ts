/* *
 *
 *  Imports
 *
 * */

import Mastodon from 'mastodon-api';
import * as MastodonApi from 'mastodon-api';
import Client from './Client';

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
        authConfig: MastodonClient.AuthConfig,
        targetConfig: MastodonClient.TargetConfig
    ) {
        super();
        this.mastodon = new Mastodon(authConfig);

    }

    /* *
     *
     *  Properties
     *
     * */

    protected mastodon: Mastodon;

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

    export interface AuthConfig extends MastodonApi.Config {
        // nothing to add
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

Client.types.mastodon = MastodonClient;

/* *
 *
 *  Default Export
 *
 * */

export default MastodonClient;
