import Mastodon from 'mastodon-api';
import * as MastodonApi from 'mastodon-api';
import Client from './Client';
export declare class MastodonClient extends Client {
    constructor(authConfig: MastodonClient.AuthConfig, targetConfig: MastodonClient.TargetConfig);
    protected mastodon: Mastodon;
}
export declare namespace MastodonClient {
    interface AuthConfig extends MastodonApi.Config {
    }
    interface TargetConfig extends Client.TargetConfig {
        target_type: 'mastodon';
        sensitive?: boolean;
        signature?: string;
    }
}
export default MastodonClient;
