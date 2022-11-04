import Client from './Client.js';
export declare class RSSClient extends Client {
    getItems(): Promise<Array<Client.Item>>;
}
export declare namespace RSSClient {
    type Config = (SourceConfig | TargetConfig);
    interface SourceConfig extends Client.SourceConfig {
        source_type: 'rss';
        append_name?: boolean;
        feeds: Record<string, string>;
        item_limit?: number;
        link_replacements?: Record<string, string>;
        minutesToCheck?: number;
    }
    interface TargetConfig extends Client.TargetConfig {
        target_type: 'rss';
    }
}
export default RSSClient;
