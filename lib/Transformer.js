"use strict";
/* *
 *
 *  Imports
 *
 * */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transformer = void 0;
const Client_1 = __importDefault(require("./Client"));
/* *
 *
 *  Class
 *
 * */
class Transformer {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(config) {
        this.sourceClient = Client_1.default.get(config.source.source_type, config.source);
        this.targetClient = Client_1.default.get(config.target.target_type, config.target);
    }
    /* *
     *
     *  Functions
     *
     * */
    transform() {
        const sourceClient = this.sourceClient;
        const targetClient = this.targetClient;
        const items = sourceClient.getItems(targetClient.getTimestamp());
        targetClient.setItems(items);
    }
}
exports.Transformer = Transformer;
/* *
 *
 *  Default Export
 *
 * */
exports.default = Transformer;
