import Client from './Client';
export declare class RSSClient extends Client {
    constructor(config: RSSClient.SourceConfig);
}
export declare namespace RSSClient {
    interface SourceConfig extends Client.SourceConfig {
        source_type: 'rss';
        feeds: Record<string, string>;
    }
}
export default RSSClient;
