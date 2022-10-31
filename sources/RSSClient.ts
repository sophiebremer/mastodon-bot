/* *
 *
 *  Imports
 *
 * */

import fetch from 'node-fetch';
import Client from './Client';

/* *
 *
 *  Class
 *
 * */

export class RSSClient extends Client {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        config: RSSClient.SourceConfig
    ) {
        super(config);
    }

}

/* *
 *
 *  Class Namespace
 *
 * */

export namespace RSSClient {

    /* *
     *
     *  Declarations
     *
     * */

    export interface SourceConfig extends Client.SourceConfig {
        source_type: 'rss';
        feeds: Record<string, string>;
    }
    
}

/* *
 *
 *  Registry
 *
 * */

Client.types.rss = RSSClient;

/* *
 *
 *  Default Export
 *
 * */

export default RSSClient;
