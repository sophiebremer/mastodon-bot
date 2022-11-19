export declare class Client {
    static readonly registry: Record<string, typeof Client>;
    static get(clientConfig: Client.Config, authConfig?: Client.AuthConfig): Client;
    protected constructor(clientConfig: Client.Config, authConfig?: Client.AuthConfig);
    readonly config: Client.Config;
    readonly mode: ('source' | 'target');
    delay(milliseconds: number): Promise<void>;
    getItems(): Promise<Array<Client.Item>>;
    protected loadTrackerFile(): Promise<(Client.TrackerFile | undefined)>;
    protected isKnownUID(uid: string): Promise<(boolean | undefined)>;
    protected saveTrackerFile(fileToCheckJSON: Client.TrackerFile): Promise<(boolean | undefined)>;
    protected saveUID(uid: string, flag?: (0 | 1)): Promise<(boolean | undefined)>;
    setItems(items: Array<Client.Item>): Promise<void>;
}
export declare namespace Client {
    interface AuthConfig {
    }
    type Config = (SourceConfig | TargetConfig);
    interface TrackerFile {
        uids: Record<string, (0 | 1)>;
    }
    interface Item {
        link?: string;
        source_type: string;
        text?: string;
        title?: string;
        timestamp: number;
        uid: string;
    }
    interface SourceConfig {
        source_type: string;
        limit?: number;
        tracker_file?: string;
    }
    interface TargetConfig {
        target_type: string;
        limit?: number;
        tracker_file?: string;
    }
}
export default Client;
