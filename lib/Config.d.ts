import MastodonClient from './MastodonClient';
import Transformer from './Transformer';
export interface AuthConfig {
    mastodon: MastodonClient.AuthConfig;
}
export interface Config {
    auth: AuthConfig;
    transform: Array<Transformer.Config>;
}
export declare namespace Config {
    function load(path: string): Config;
}
export default Config;
