import * as Mastodon from 'tsl-mastodon-api';
import Client from './Client.js';
export declare class MastodonClient extends Client {
    constructor(clientConfig: MastodonClient.Config, authConfig?: MastodonClient.AuthConfig);
    private readonly authConfig;
    readonly config: MastodonClient.Config;
    protected mastodon: Mastodon.API;
    setItems(items: Array<Client.Item>): Promise<void>;
}
export declare namespace MastodonClient {
    interface AuthConfig extends Mastodon.API.Config {
    }
    type Config = (SourceConfig | TargetConfig);
    interface SourceConfig extends Client.SourceConfig {
        source_type: 'mastodon';
    }
    interface TargetConfig extends Client.TargetConfig {
        target_type: 'mastodon';
        sensitive?: boolean;
        signature?: string;
    }
}
export default MastodonClient;
