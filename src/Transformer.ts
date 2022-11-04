/* *
 *
 *  Imports
 *
 * */

import Client from './Clients/Client.js';
import Config from './Config.js';
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

    public static async run(
        config: Config
    ): Promise<void> {
        const auth = config.auth || {};
        const promises: Array<Promise<void>> = [];
        const transforms = config.transforms || [];

        let sourceClient: Client;
        let sourceConfig: Client.SourceConfig;
        let sourceType: string;

        let targetClient: Client;
        let targetConfig: Client.TargetConfig;
        let targetType: string;

        let transformer: Transformer;

        for (const transform of transforms) {

            sourceConfig = transform.source;
            sourceType = sourceConfig.source_type;
            sourceClient = Client.get(sourceConfig, auth[sourceType]);

            targetConfig = transform.target;
            targetType = targetConfig.target_type;
            targetClient = Client.get(targetConfig, auth[targetType]);

            transformer = new Transformer(
                transform,
                sourceClient,
                targetClient
            );

            promises.push(transformer.transform());
        }

        return Promise.all(promises).then(() => undefined);
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        config: Transformer.Config,
        sourceClient: Client,
        targetClient: Client
    ) {
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

    protected negatives?: Array<string>;

    protected positives?: Array<string>;

    protected replacements?: Record<string, string>;

    protected sourceClient: Client;

    protected targetClient: Client;

    /* *
     *
     *  Functions
     *
     * */

    protected filter(
        items: Array<Client.Item>
    ): Array<Client.Item> {

        if (
            !this.negatives &&
            !this.positives &&
            !this.replacements
        ) {
            return items;
        }

        const filteredItems: Array<Client.Item> = [];
        const negatives = this.negatives || [];
        const positives = this.positives || [];
        const replacements = this.replacements || {};

        let negativesCounter: number;
        let positivesCounter: number;
        let text: string;

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

            Utilities.replacePatterns(text, replacements);

            filteredItems.push({
                ...item,
                text
            });
        }

        return filteredItems;
    }

    public async transform() {
        const sourceClient = this.sourceClient;
        const targetClient = this.targetClient;

        await targetClient.setItems(this.filter(await sourceClient.getItems()));
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

export namespace Transformer {

    /* *
     *
     *  Declarations
     *
     * */

    export interface Config {
        negatives?: Array<string>;
        positives?: Array<string>;
        replacements?: Record<string, string>;
        source: Client.SourceConfig;
        target: Client.TargetConfig;    
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Transformer;
