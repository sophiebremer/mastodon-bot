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

    protected async loadTrackerFile(): Promise<(Client.TrackerFile|undefined)> {
        const config = this.config as Client.SourceConfig;
        const trackerFile = config.tracker_file;

        if (!trackerFile) {
            return;
        }

        let fileToCheckJSON: Partial<Client.TrackerFile> = {};

        try {
            const json = (await FS.promises.readFile(trackerFile)).toString();

            fileToCheckJSON = JSON.parse(json);
        }
        catch {
            fileToCheckJSON = {};
        }

        if (typeof fileToCheckJSON.uids !== 'object') {
            fileToCheckJSON.uids = {};
        }

        return fileToCheckJSON as Client.TrackerFile;
    }

    protected async isKnownUID(
        uid: string
    ): Promise<(boolean|undefined)> {
        const fileToCheck = await this.loadTrackerFile();

        return !!fileToCheck?.uids[uid];
    }

    protected async saveTrackerFile(
        fileToCheckJSON: Client.TrackerFile
    ): Promise<(boolean|undefined)> {
        const config = this.config as Client.SourceConfig;
        const trackerFile = config.tracker_file;

        if (!trackerFile) {
            return;
        }

        await FS.promises.mkdir(Path.dirname(trackerFile), { recursive: true });

        const json = JSON.stringify(fileToCheckJSON, undefined, '    ');

        await FS.promises.writeFile(trackerFile, json);

        return true;
    }

    protected async saveUID(
        uid: string,
        flag: (0|1) = 1
    ): Promise<(boolean|undefined)> {
        let fileToCheckJSON = await this.loadTrackerFile();

        if (!fileToCheckJSON) {
            return;
        }

        fileToCheckJSON.uids[uid] = flag;

        return this.saveTrackerFile(fileToCheckJSON);
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

    export interface TrackerFile {
        uids: Record<string, (0|1)>;
    }

    export interface Item {
        link?: string;
        source_type: string;
        text?: string;
        title?: string;
        timestamp: number;
        uid: string;
    }

    export interface SourceConfig {
        source_type: string;
        limit?: number;
        tracker_file?: string;
    }

    export interface TargetConfig {
        target_type: string;
        limit?: number;
        tracker_file?: string;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Client;
