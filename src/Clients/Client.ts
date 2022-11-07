/* *
 *
 *  Imports
 *
 * */

import * as FS from 'fs';
import * as Path from 'path';

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

    public async getItems(): Promise<Array<Client.Item>> {
        throw new Error('Not implemented');
    }

    protected async loadFileToCheck(): Promise<(Client.FileToCheck|undefined)> {

        if (this.mode !== 'source') {
            throw new Error('Client is not in source mode');
        }

        const config = this.config as Client.SourceConfig;
        const fileToCheck = config.file_to_check;

        if (!fileToCheck) {
            return;
        }

        let fileToCheckJSON: Partial<Client.FileToCheck> = {};
        
        try {
            fileToCheckJSON = JSON.parse(
                (await FS.promises.readFile(fileToCheck)).toString()
            );
        }
        catch {
            fileToCheckJSON = {};
        }

        if (typeof fileToCheckJSON.last_timestamp !== 'number') {
            fileToCheckJSON.last_timestamp = (new Date().getTime() - 10 * 60000);
        }

        return fileToCheckJSON as Client.FileToCheck;
    }

    protected async loadLastTimestamp(): Promise<(number|undefined)> {
        const fileToCheck = await this.loadFileToCheck();

        return fileToCheck?.last_timestamp;
    }

    protected async saveFileToCheck(
        fileToCheckJSON: Client.FileToCheck
    ): Promise<boolean> {

        if (this.mode !== 'source') {
            throw new Error('Client is not in source mode');
        }

        const config = this.config as Client.SourceConfig;
        const fileToCheck = config.file_to_check;

        if (!fileToCheck) {
            return false;
        }

        await FS.promises.mkdir(
            Path.dirname(fileToCheck),
            {
                recursive: true
            }
        );

        await FS.promises.writeFile(
            fileToCheck,
            JSON.stringify(fileToCheckJSON, undefined, '    ')
        );

        return true;
    }

    protected async saveLastTimestamp(
        lastTimestamp: number
    ): Promise<boolean> {
        let fileToCheckJSON = await this.loadFileToCheck();

        if (fileToCheckJSON) {

            if (lastTimestamp === fileToCheckJSON.last_timestamp) {
                return true;
            }

            fileToCheckJSON.last_timestamp = lastTimestamp;
        }
        else {
            fileToCheckJSON = {
                last_timestamp: lastTimestamp
            };
        }

        return this.saveFileToCheck(fileToCheckJSON);
    }

    public async setItems(
        items: Array<Client.Item>
    ): Promise<void> {
        throw new Error('Not implemented', { cause: items });
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

    export interface FileToCheck {
        last_timestamp: number;
    }

    export interface Item {
        link?: string;
        source_type: string;
        text?: string;
        timestamp: number;
    }

    export interface SourceConfig {
        source_type: string;
        file_to_check?: string;
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
