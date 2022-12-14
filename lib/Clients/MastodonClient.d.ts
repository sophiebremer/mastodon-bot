import type * as MastodonAPI from 'mastodon-api';
import Client from './Client.js';
export declare class MastodonClient extends Client {
    constructor(clientConfig: MastodonClient.Config, authConfig?: MastodonClient.AuthConfig);
    private readonly authConfig;
    readonly config: MastodonClient.Config;
    protected mastodon: MastodonAPI.default;
    protected get(path: string, params?: Record<string, any>): Promise<any>;
    protected post(path: string, params?: Record<string, any>): Promise<number>;
    setItems(items: Array<Client.Item>): Promise<void>;
}
export declare namespace MastodonClient {
    interface AuthConfig extends MastodonAPI.Config {
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
