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
        this.sourceClient = Client.get(config.source.source_type, config.source);
        this.targetClient = Client.get(config.target.target_type, config.target);
    }

    /* *
     *
     *  Properties
     *
     * */

    protected sourceClient: Client;

    protected targetClient: Client;

    /* *
     *
     *  Functions
     *
     * */

    public transform() {
        const sourceClient = this.sourceClient;
        const targetClient = this.targetClient;

        const items = sourceClient.getItems(targetClient.getTimestamp());

        targetClient.setItems(items);
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
