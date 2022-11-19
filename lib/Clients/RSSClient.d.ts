import Client from './Client.js';
export declare class RSSClient extends Client {
    getItems(): Promise<Array<Client.Item>>;
}
export declare namespace RSSClient {
    type Config = (SourceConfig | TargetConfig);
    interface SourceConfig extends Client.SourceConfig {
        source_type: 'rss';
        check_updated_time?: boolean;
        feed: string;
        link_replacements?: Record<string, string>;
    }
    interface TargetConfig extends Client.TargetConfig {
        target_type: 'rss';
    }
}
export default RSSClient;
