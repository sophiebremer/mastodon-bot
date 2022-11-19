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
    async loadTrackerFile() {
        const config = this.config;
        const trackerFile = config.tracker_file;
        if (!trackerFile) {
            return;
        }
        let fileToCheckJSON = {};
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
        return fileToCheckJSON;
    }
    async isKnownUID(uid) {
        const fileToCheck = await this.loadTrackerFile();
        return !!fileToCheck?.uids[uid];
    }
    async saveTrackerFile(fileToCheckJSON) {
        const config = this.config;
        const trackerFile = config.tracker_file;
        if (!trackerFile) {
            return;
        }
        await FS.promises.mkdir(Path.dirname(trackerFile), { recursive: true });
        const json = JSON.stringify(fileToCheckJSON, undefined, '    ');
        await FS.promises.writeFile(trackerFile, json);
        return true;
    }
    async saveUID(uid, flag = 1) {
        let fileToCheckJSON = await this.loadTrackerFile();
        if (!fileToCheckJSON) {
            return;
        }
        fileToCheckJSON.uids[uid] = flag;
        return this.saveTrackerFile(fileToCheckJSON);
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
