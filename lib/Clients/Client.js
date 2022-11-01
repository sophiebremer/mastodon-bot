/* *
 *
 *  Class
 *
 * */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Client {
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
     *  Functions
     *
     * */
    delay(milliseconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        });
    }
    getItems(sinceTimestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    getTimestamp() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
    setItems(items) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Not implemented');
        });
    }
}
/* *
 *
 *  Static Properties
 *
 * */
Client.registry = {};
/* *
 *
 *  Default Export
 *
 * */
export default Client;
