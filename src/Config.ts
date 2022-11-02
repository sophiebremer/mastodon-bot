/* *
 *
 *  Imports
 *
 * */

import type Client from './Clients/Client.js';
import type MastodonClient from './Clients/MastodonClient.js';
import type Transformer from './Transformer.js';

import * as FS from 'fs';

/* *
 *
 *  Declarations
 *
 * */

export interface AuthConfig {
    [key: string]: Client.AuthConfig; 
    mastodon: MastodonClient.AuthConfig;
}

export interface Config {
    auth: AuthConfig;
    transforms: Array<Transformer.Config>;
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

    export function save(
        path: string,
        config: Config
    ): void {
        FS.writeFileSync(path, JSON.stringify(config, undefined, '    '));
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Config;
