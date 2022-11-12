export declare class Client {
    static readonly registry: Record<string, typeof Client>;
    static get(clientConfig: Client.Config, authConfig?: Client.AuthConfig): Client;
    protected constructor(clientConfig: Client.Config, authConfig?: Client.AuthConfig);
    readonly config: Client.Config;
    readonly mode: ('source' | 'target');
    delay(milliseconds: number): Promise<void>;
    getItems(): Promise<Array<Client.Item>>;
    protected loadFileToCheck(): Promise<(Client.FileToCheck | undefined)>;
    protected loadLastTimestamp(): Promise<(number | undefined)>;
    protected saveFileToCheck(fileToCheckJSON: Client.FileToCheck): Promise<boolean>;
    protected saveLastTimestamp(lastTimestamp: number): Promise<boolean>;
    setItems(items: Array<Client.Item>): Promise<void>;
}
export declare namespace Client {
    interface AuthConfig {
    }
    type Config = (SourceConfig | TargetConfig);
    interface FileToCheck {
        last_timestamp: number;
    }
    interface Item {
        link?: string;
        source_type: string;
        text?: string;
        title?: string;
        timestamp: number;
    }
    interface SourceConfig {
        source_type: string;
        file_to_check?: string;
    }
    interface TargetConfig {
        target_type: string;
    }
}
export default Client;
