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
    static registry = {};
    /* *
     *
     *  Static Function
     *
     * */
    static get(clientConfig, authConfig) {
        const type = (clientConfig.source_type ||
            clientConfig.target_type);
        return new Client.registry[type](clientConfig, authConfig);
    }
    /* *
     *
     *  Constructor
     *
     * */
    constructor(clientConfig, authConfig) {
        this.config = clientConfig;
        this.mode = (clientConfig.target_type ?
            'target' :
            'source');
    }
    /* *
     *
     *  Properties
     *
     * */
    config;
    mode;
    /* *
     *
     *  Functions
     *
     * */
    async delay(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    async getItems() {
        throw new Error('Not implemented');
    }
    async loadFileToCheck() {
        if (this.mode !== 'source') {
            throw new Error('Client is not in source mode');
        }
        const config = this.config;
        const fileToCheck = config.file_to_check;
        if (!fileToCheck) {
            return;
        }
        let fileToCheckJSON = {};
        try {
            fileToCheckJSON = JSON.parse((await FS.promises.readFile(fileToCheck)).toString());
        }
        catch {
            fileToCheckJSON = {};
        }
        if (typeof fileToCheckJSON.last_timestamp !== 'number') {
            fileToCheckJSON.last_timestamp = (new Date().getTime() - 10 * 60000);
        }
        return fileToCheckJSON;
    }
    async loadLastTimestamp() {
        const fileToCheck = await this.loadFileToCheck();
        return fileToCheck?.last_timestamp;
    }
    async saveFileToCheck(fileToCheckJSON) {
        if (this.mode !== 'source') {
            throw new Error('Client is not in source mode');
        }
        const config = this.config;
        const fileToCheck = config.file_to_check;
        if (!fileToCheck) {
            return false;
        }
        await FS.promises.mkdir(Path.dirname(fileToCheck), {
            recursive: true
        });
        await FS.promises.writeFile(fileToCheck, JSON.stringify(fileToCheckJSON, undefined, '    '));
        return true;
    }
    async saveLastTimestamp(lastTimestamp) {
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
    async setItems(items) {
        throw new Error('Not implemented', { cause: items });
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default Client;
