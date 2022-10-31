/* *
 *
 *  Imports
 *
 * */

import * as FS from 'fs';
import MastodonClient from './MastodonClient';
import Transformer from './Transformer';

/* *
 *
 *  Declarations
 *
 * */

export interface AuthConfig {
    mastodon: MastodonClient.AuthConfig;
}

export interface Config {
    auth: AuthConfig;
    transform: Array<Transformer.Config>;
}

/* *
 *
 *  Namespace
 *
 * */

export namespace Config {

    /* *
     *
     *  Functions
     *
     * */

    export function load(
        path: string
    ): Config {
        const config = JSON.parse(FS.readFileSync(path).toString());

        if (!config || config instanceof Array) {
            throw new Error('Missing config with keys and values.');
        }

        return config as Config;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Config;
