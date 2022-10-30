import * as Mastodon from 'mastodon-api';
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
export declare type SourceConfig = RSSSourceConfig;
export declare type TargetConfig = MastodonTargetConfig;
export interface TransformConfig {
    replacements?: Record<string, string>;
    source: SourceConfig;
    target: TargetConfig;
}
export declare namespace Config {
    function load(path: string): Config;
}
export default Config;
