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
exports.MastodonClient = void 0;
const mastodon_api_1 = __importDefault(require("mastodon-api"));
const Client_1 = __importDefault(require("./Client"));
/* *
 *
 *  Class
 *
 * */
class MastodonClient extends Client_1.default {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(authConfig, targetConfig) {
        super();
        this.mastodon = new mastodon_api_1.default(authConfig);
    }
}
exports.MastodonClient = MastodonClient;
/* *
 *
 *  Registry
 *
 * */
Client_1.default.types.mastodon = MastodonClient;
/* *
 *
 *  Default Export
 *
 * */
exports.default = MastodonClient;
