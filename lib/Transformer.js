/* *
 *
 *  Imports
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
import Client from './Clients/Client.js';
/* *
 *
 *  Class
 *
 * */
export class Transformer {
    /* *
     *
     *  Constructor
     *
     * */
    constructor(config, sourceClient, targetClient) {
        var _a, _b;
        this.negatives = (_a = config.negatives) === null || _a === void 0 ? void 0 : _a.slice();
        this.positives = (_b = config.positives) === null || _b === void 0 ? void 0 : _b.slice();
        this.replacements = Object.assign({}, config.replacements);
        this.sourceClient = sourceClient;
        this.targetClient = targetClient;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    static run(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = config.auth || {};
            const promises = [];
            const transforms = config.transforms || [];
            let sourceClient;
            let sourceConfig;
            let sourceType;
            let targetClient;
            let targetConfig;
            let targetType;
            let transformer;
            for (const transform of transforms) {
                sourceConfig = transform.source;
                sourceType = sourceConfig.source_type;
                sourceClient = Client.get(sourceConfig, auth[sourceType]);
                targetConfig = transform.target;
                targetType = targetConfig.target_type;
                targetClient = Client.get(targetConfig, auth[targetType]);
                transformer = new Transformer(transform, sourceClient, targetClient);
                promises.push(transformer.transform());
            }
            return Promise.all(promises).then(() => undefined);
        });
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
            if (!item.text) {
                filteredItems.push(item);
                continue;
            }
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
        return __awaiter(this, void 0, void 0, function* () {
            const sourceClient = this.sourceClient;
            const targetClient = this.targetClient;
            yield targetClient.setItems(this.filter(yield sourceClient.getItems(yield targetClient.getTimestamp())));
        });
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default Transformer;
