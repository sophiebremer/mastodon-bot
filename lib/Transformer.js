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
        var _a, _b;
        this.negatives = (_a = config.negatives) === null || _a === void 0 ? void 0 : _a.slice();
        this.positives = (_b = config.positives) === null || _b === void 0 ? void 0 : _b.slice();
        this.replacements = Object.assign({}, config.replacements);
        this.sourceClient = Client_1.default.get(config.source.source_type, config.source);
        this.targetClient = Client_1.default.get(config.target.target_type, config.target);
    }
    /* *
     *
     *  Functions
     *
     * */
    filter(items) {
        if (!this.negatives &&
            !this.positives &&
            !this.replacements) {
            return items;
        }
        const filteredItems = [];
        const negatives = this.negatives || [];
        const positives = this.positives || [];
        const replacements = this.replacements || {};
        let negativesCounter;
        let positivesCounter;
        let text;
        for (const item of items) {
            negativesCounter = 0;
            positivesCounter = 0;
            text = item.text;
            for (const negative of negatives) {
                if (text.includes(negative)) {
                    ++negativesCounter;
                }
            }
            for (const positive of positives) {
                if (text.includes(positive)) {
                    ++positivesCounter;
                }
            }
            if (negativesCounter > positivesCounter) {
                continue;
            }
            for (const pattern in replacements) {
                text = text.split(pattern).join(replacements[pattern]);
            }
            filteredItems.push(Object.assign(Object.assign({}, item), { text }));
        }
        return filteredItems;
    }
    transform() {
        const sourceClient = this.sourceClient;
        const targetClient = this.targetClient;
        targetClient.setItems(this.filter(sourceClient.getItems(targetClient.getTimestamp())));
    }
}
exports.Transformer = Transformer;
/* *
 *
 *  Default Export
 *
 * */
exports.default = Transformer;
