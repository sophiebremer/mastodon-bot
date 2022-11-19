/* *
 *
 *  Imports
 *
 * */
import Client from './Clients/Client.js';
import Utilities from './Utilities.js';
/* *
 *
 *  Class
 *
 * */
export class Transformer {
    /* *
     *
     *  Static Functions
     *
     * */
    static async run(config) {
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
    }
    /* *
     *
     *  Constructor
     *
     * */
    constructor(config, sourceClient, targetClient) {
        this.negatives = config.negatives?.slice();
        this.positives = config.positives?.slice();
        this.replacements = { ...config.replacements };
        this.sourceClient = sourceClient;
        this.targetClient = targetClient;
    }
    /* *
     *
     *  Properties
     *
     * */
    negatives;
    positives;
    replacements;
    sourceClient;
    targetClient;
    /* *
     *
     *  Functions
     *
     * */
    filter(items) {
        if (!this.negatives &&
            !this.positives &&
            !this.replacements) {
            console.log('<<<>>>');
            return items;
        }
        const filteredItems = [];
        const negatives = this.negatives || [];
        const positives = this.positives || [];
        const replacements = this.replacements || {};
        let negativesCounter;
        let positivesCounter;
        let text;
        let title;
        for (const item of items) {
            if (!item.text && !item.title) {
                filteredItems.push(item);
                continue;
            }
            negativesCounter = 0;
            positivesCounter = 0;
            text = item.text;
            title = item.title;
            for (const negative of negatives) {
                if (text && text.includes(negative) ||
                    title && title.includes(negative)) {
                    ++negativesCounter;
                }
            }
            for (const positive of positives) {
                if (text && text.includes(positive) ||
                    title && title.includes(positive)) {
                    ++positivesCounter;
                }
            }
            if (negativesCounter > positivesCounter) {
                continue;
            }
            if (text) {
                text = Utilities.replacePatterns(text, replacements);
            }
            if (title) {
                title = Utilities.replacePatterns(title, replacements);
            }
            filteredItems.push({
                ...item,
                title,
                text
            });
        }
        return filteredItems;
    }
    async transform() {
        const sourceClient = this.sourceClient;
        const targetClient = this.targetClient;
        await targetClient.setItems(this.filter(await sourceClient.getItems()));
    }
}
/* *
 *
 *  Default Export
 *
 * */
export default Transformer;
