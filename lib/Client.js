"use strict";
/* *
 *
 *  Imports
 *
 * */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
/* *
 *
 *  Class
 *
 * */
class Client {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(...args) {
        // nothing to do
    }
    /* *
     *
     *  Static Function
     *
     * */
    static get(type, ...args) {
        return new Client.types[type](...args);
    }
    /* *
     *
     *  Functions
     *
     * */
    getItems(date) {
        throw new Error('Not implemented');
    }
    getTimestamp() {
        throw new Error('Not implemented');
    }
    setItems(items) {
        throw new Error('Not implemented');
    }
}
exports.Client = Client;
/* *
 *
 *  Static Properties
 *
 * */
Client.types = {};
/* *
 *
 *  Default Export
 *
 * */
exports.default = Client;
