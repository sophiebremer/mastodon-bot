/* *
 *
 *  Class
 *
 * */

export class Client {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly registry: Record<string, typeof Client> = {};

    /* *
     *
     *  Static Function
     *
     * */

    public static get(
        clientConfig: Client.Config,
        authConfig?: Client.AuthConfig
    ): Client {
        const type = (
            (clientConfig as Client.SourceConfig).source_type ||
            (clientConfig as Client.TargetConfig).target_type
        );

        return new Client.registry[type](clientConfig, authConfig);
    }

    /* *
     *
     *  Constructor
     *
     * */

    protected constructor(
        clientConfig: Client.Config,
        authConfig?: Client.AuthConfig
    ) {
        this.config = clientConfig;
        this.mode = (
            (clientConfig as Client.TargetConfig).target_type ?
                'target' :
                'source'
        );
    }

    /* *
     *
     *  Properties
     *
     * */

    public readonly config: Client.Config;

    public readonly mode: ('source'|'target');

    /* *
     *
     *  Functions
     *
     * */

    public async delay(
        milliseconds: number
    ): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    public async getItems(
        sinceTimestamp: number
    ): Promise<Array<Client.Item>> {
        throw new Error('Not implemented');
    }

    public async getTimestamp(): Promise<number> {
        throw new Error('Not implemented');
    }

    public async setItems(
        items: Array<Client.Item>
    ): Promise<void> {
        throw new Error('Not implemented');
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

export namespace Client {

    /* *
     *
     *  Declarations
     *
     * */

    export interface AuthConfig {
        // nothing to add
    }

    export type Config = (SourceConfig|TargetConfig);

    export interface Item {
        link?: string;
        source_type: string;
        text?: string;
        timestamp: number;
    }

    export interface SourceConfig {
        source_type: string;
    }

    export interface TargetConfig {
        target_type: string;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Client;
