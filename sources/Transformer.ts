/* *
 *
 *  Imports
 *
 * */

import Client from './Client';

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

    public constructor(
        config: Transformer.Config
    ) {
        this.negatives = config.negatives?.slice();
        this.positives = config.positives?.slice();
        this.replacements = { ...config.replacements };
        this.sourceClient = Client.get(config.source.source_type, config.source);
        this.targetClient = Client.get(config.target.target_type, config.target);
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
        items: Array<Transformer.Item>
    ): Array<Transformer.Item> {

        if (
            !this.negatives &&
            !this.positives &&
            !this.replacements
        ) {
            return items;
        }

        const filteredItems: Array<Transformer.Item> = [];
        const negatives = this.negatives || [];
        const positives = this.positives || [];
        const replacements = this.replacements || {};

        let negativesCounter: number;
        let positivesCounter: number;
        let text: string;

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

            filteredItems.push({
                ...item,
                text
            });
        }

        return filteredItems;
    }

    public transform() {
        const sourceClient = this.sourceClient;
        const targetClient = this.targetClient;

        targetClient.setItems(
            this.filter(
                sourceClient.getItems(targetClient.getTimestamp())
            )
        );
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

    export interface Item {
        source_type: string;
        text: string;
        time: Date;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Transformer;
