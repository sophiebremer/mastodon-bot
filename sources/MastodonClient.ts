/* *
 *
 *  Imports
 *
 * */

import Config from './Config';
import Mastodon from 'mastodon-api';

/* *
 *
 *  Class
 *
 * */

export class MastodonClient {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        config: Config
    ) {
        if (!config.auth?.mastodon) {
            throw new Error('Mastodon authentication not configured.');
        }

        this.mastodon = new Mastodon(config.auth.mastodon);
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
 *  Default Export
 *
 * */

export default MastodonClient;
