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
    async getItems(sinceTimestamp) {
        throw new Error('Not implemented');
    }
    async getTimestamp() {
        throw new Error('Not implemented');
    }
    async setItems(items) {
        throw new Error('Not implemented');
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default Client;
