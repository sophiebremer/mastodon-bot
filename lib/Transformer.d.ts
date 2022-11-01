import Client from './Clients/Client.js';
import Config from './Config.js';
export declare class Transformer {
    static run(config: Config): Promise<void>;
    constructor(config: Transformer.Config, sourceClient: Client, targetClient: Client);
    protected negatives?: Array<string>;
    protected positives?: Array<string>;
    protected replacements?: Record<string, string>;
    protected sourceClient: Client;
    protected targetClient: Client;
    protected filter(items: Array<Client.Item>): Array<Client.Item>;
    transform(): Promise<void>;
}
export declare namespace Transformer {
    interface Config {
        negatives?: Array<string>;
        positives?: Array<string>;
        replacements?: Record<string, string>;
        source: Client.SourceConfig;
        target: Client.TargetConfig;
    }
}
export default Transformer;
