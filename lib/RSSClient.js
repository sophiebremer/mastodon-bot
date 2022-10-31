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
exports.RSSClient = void 0;
const Client_1 = __importDefault(require("./Client"));
/* *
 *
 *  Class
 *
 * */
class RSSClient extends Client_1.default {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(config) {
        super(config);
    }
}
exports.RSSClient = RSSClient;
/* *
 *
 *  Registry
 *
 * */
Client_1.default.types.rss = RSSClient;
/* *
 *
 *  Default Export
 *
 * */
exports.default = RSSClient;
