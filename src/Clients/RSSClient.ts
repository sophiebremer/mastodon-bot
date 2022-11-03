/* *
 *
 *  Imports
 *
 * */

import * as XML from 'fast-xml-parser';
import fetch from 'node-fetch';
import Client from './Client.js';
import Utilities from '../Utilities.js';

/* *
 *
 *  Class
 *
 * */

export class RSSClient extends Client {

    /* *
     *
     *  Functions
     *
     * */

    public async getItems(
        sinceTimestamp: number
    ): Promise<Array<Client.Item>> {

        if (this.mode !== 'source') {
            throw new Error('Client is not in source mode');
        }

        const allItems: Array<Client.Item> = [];
        const config = this.config as RSSClient.SourceConfig;
        const feeds = config.feeds;
        const stdout = process.stdout;

        stdout.write(`\nSearch for new items since ${new Date(sinceTimestamp).toUTCString()}\n`);

        for (const feedName in feeds) {
            const response = await fetch(feeds[feedName]);
            const parser = new XML.XMLParser({
                attributeNamePrefix: '$_',
                ignoreAttributes: false,
                removeNSPrefix: true,
            });
            const xml = parser.parse(await response.text());

            if (!xml.rss && !xml.feed) {
                throw new Error('RSS invalid');
            }

            let channels = xml.rss?.channel || xml.feed;
            channels = channels instanceof Array ? channels : [channels];

            for (const channel of channels) {
                let items = channel.item || channel.entry;
                items = items instanceof Array ? items : [items];

                for (const item of items) {
                    const timestamp = Date.parse(item.pubDate || item.published);

                    if (timestamp < sinceTimestamp) {
                        continue;
                    }

                    let link = (item.link instanceof Array ? item.link[0] : item.link);
                    link = typeof link === 'string' ? link : link.$_href;
                    link = config.link_query ? link : link.split('?')[0];
                    link = config.link_hash ? link : link.split('#')[0];

                    let text = Utilities.trimSpaces(
                        item.description || item.summary || '',
                        true
                    );
                    text = (
                        item.title && text ?
                            Utilities.trimSpaces(item.title, true) + '\n\n' + text :
                            Utilities.trimSpaces(item.title || '', true) || text
                    );
                    text = (
                        config.append_name && feedName ?
                            Utilities.trimSpaces(feedName, true) + ': ' + text :
                            text
                    );

                    allItems.push({
                        link,
                        source_type: 'rss',
                        text,
                        timestamp
                    });
                }
            }
        }

        allItems.sort((a, b) => a.timestamp - b.timestamp);

        if (
            config.item_limit &&
            allItems.length > config.item_limit
        ) {
            allItems.splice(0, allItems.length - config.item_limit);
        }

        return allItems;
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

    export type Config = (SourceConfig|TargetConfig);

    export interface SourceConfig extends Client.SourceConfig {
        source_type: 'rss';
        append_name?: boolean;
        item_limit?: number;
        link_hash?: boolean;
        link_query?: boolean;
        feeds: Record<string, string>;
    }

    export interface TargetConfig extends Client.TargetConfig {
        target_type: 'rss';
    }
    
}

/* *
 *
 *  Registry
 *
 * */

Client.registry.rss = RSSClient;

/* *
 *
 *  Default Export
 *
 * */

export default RSSClient;
