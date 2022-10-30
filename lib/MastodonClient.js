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
/* *
 *
 *  Class
 *
 * */
class MastodonClient {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(config) {
        var _a;
        if (!((_a = config.auth) === null || _a === void 0 ? void 0 : _a.mastodon)) {
            throw new Error('Mastodon authentication not configured.');
        }
        this.mastodon = new mastodon_api_1.default(config.auth.mastodon);
    }
}
exports.MastodonClient = MastodonClient;
/* *
 *
 *  Default Export
 *
 * */
exports.default = MastodonClient;
