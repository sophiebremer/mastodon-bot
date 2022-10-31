import Client from './Client';
export declare class Transformer {
    constructor(config: Transformer.Config);
    protected sourceClient: Client;
    protected targetClient: Client;
    transform(): void;
}
export declare namespace Transformer {
    interface Config {
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
