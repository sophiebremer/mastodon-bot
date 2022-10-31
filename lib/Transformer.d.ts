import Client from './Client';
export declare class Transformer {
    constructor(config: Transformer.Config);
    protected negatives?: Array<string>;
    protected positives?: Array<string>;
    protected replacements?: Record<string, string>;
    protected sourceClient: Client;
    protected targetClient: Client;
    protected filter(items: Array<Transformer.Item>): Array<Transformer.Item>;
    transform(): void;
}
export declare namespace Transformer {
    interface Config {
        negatives?: Array<string>;
        positives?: Array<string>;
        replacements?: Record<string, string>;
        source: Client.SourceConfig;
        target: Client.TargetConfig;
    }
    interface Item {
        source_type: string;
        text: string;
        time: Date;
    }
}
export default Transformer;
