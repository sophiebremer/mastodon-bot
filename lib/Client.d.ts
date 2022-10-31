import type Transformer from "./Transformer";
export declare class Client {
    static readonly types: Record<string, typeof Client>;
    static get(type: string, ...args: Array<unknown>): Client;
    constructor(...args: Array<unknown>);
    getItems(since: Date): Array<Transformer.Item>;
    getTimestamp(): Date;
    setItems(items: Array<Transformer.Item>): void;
}
export declare namespace Client {
    interface SourceConfig {
        source_type: string;
    }
    interface TargetConfig {
        target_type: string;
    }
}
export default Client;
