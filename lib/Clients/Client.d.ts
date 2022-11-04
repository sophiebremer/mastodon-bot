export declare class Client {
    static readonly registry: Record<string, typeof Client>;
    static get(clientConfig: Client.Config, authConfig?: Client.AuthConfig): Client;
    protected constructor(clientConfig: Client.Config, authConfig?: Client.AuthConfig);
    readonly config: Client.Config;
    readonly mode: ('source' | 'target');
    delay(milliseconds: number): Promise<void>;
    getItems(): Promise<Array<Client.Item>>;
    setItems(items: Array<Client.Item>): Promise<void>;
}
export declare namespace Client {
    interface AuthConfig {
    }
    type Config = (SourceConfig | TargetConfig);
    interface Item {
        link?: string;
        source_type: string;
        text?: string;
        timestamp: number;
    }
    interface SourceConfig {
        source_type: string;
    }
    interface TargetConfig {
        target_type: string;
    }
}
export default Client;
