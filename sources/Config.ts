/* *
 *
 *  Imports
 *
 * */

import * as FS from 'fs';
import * as Mastodon from 'mastodon-api';

/* *
 *
 *  Declarations
 *
 * */

export interface AuthConfig {
    mastodon: Mastodon.Config;
}

export interface Config {
    auth: AuthConfig;
    transform: Array<TransformConfig>;
}

export interface MastodonTargetConfig {
    type: 'mastodon';
    signature?: string;
}

export interface RSSSourceConfig {
    type: 'rss';
    feeds: Record<string, string>;
}

export type SourceConfig = RSSSourceConfig;

export type TargetConfig = MastodonTargetConfig;

export interface TransformConfig {
    replacements?: Record<string, string>;
    source: SourceConfig;
    target: TargetConfig;
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
