import type Client from './Clients/Client.js';
import type MastodonClient from './Clients/MastodonClient.js';
import type Transformer from './Transformer.js';
export interface AuthConfig {
    [key: string]: Client.AuthConfig;
    mastodon: MastodonClient.AuthConfig;
}
export interface Config {
    auth: AuthConfig;
    transforms: Array<Transformer.Config>;
}
export declare namespace Config {
    function load(path: string): Config;
}
export default Config;
