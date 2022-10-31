
/* *
 *
 *  Imports
 *
 * */

import type Transformer from "./Transformer";

/* *
 *
 *  Class
 *
 * */

export class Client {

    /* *
     *
     *  Static Properties
     *
     * */

    public static readonly types: Record<string, typeof Client> = {};

    /* *
     *
     *  Static Function
     *
     * */

    public static get(
        type: string,
        ...args: Array<unknown>
    ): Client {
        return new Client.types[type](...args);
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        ...args: Array<unknown>
    ) {
        // nothing to do
    }

    /* *
     *
     *  Functions
     *
     * */

    public getItems(since: Date): Array<Transformer.Item> {
        throw new Error('Not implemented');
    }

    public getTimestamp(): Date {
        throw new Error('Not implemented');
    }

    public setItems(items: Array<Transformer.Item>): void {
        throw new Error('Not implemented');
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

export namespace Client {

    /* *
     *
     *  Declarations
     *
     * */

    export interface SourceConfig {
        source_type: string;
    }

    export interface TargetConfig {
        target_type: string;
    }


}

/* *
 *
 *  Default Export
 *
 * */

export default Client;
