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
        const json = FS
            .readFileSync(path)
            .toString()
            .replace(/^\s*\/\/.*$/gm, '');
        const config = JSON.parse(json);

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
