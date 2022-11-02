import Client from './Client.js';
export declare class RSSClient extends Client {
    getItems(sinceTimestamp: number): Promise<Array<Client.Item>>;
}
export declare namespace RSSClient {
    type Config = (SourceConfig | TargetConfig);
    interface SourceConfig extends Client.SourceConfig {
        source_type: 'rss';
        append_name?: boolean;
        item_limit?: number;
        feeds: Record<string, string>;
    }
    interface TargetConfig extends Client.TargetConfig {
        target_type: 'rss';
    }
}
export default RSSClient;
