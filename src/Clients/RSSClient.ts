/* *
 *
 *  Imports
 *
 * */

import * as XML from 'fast-xml-parser';
import fetch from 'node-fetch';
import Client from './Client.js';

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

        const config = this.config as RSSClient.SourceConfig;
        const feeds = config.feeds;
        const allItems: Array<Client.Item> = [];

        for (const feedName in feeds) {
            const response = await fetch(feeds[feedName]);
            const parser = new XML.XMLParser({
                removeNSPrefix: true
            });
            const xml = parser.parse(await response.text());

            if (!xml.rss) {
                throw new Error('RSS invalid');
            }

            const rss = xml.rss;

            let channels = rss.channel || rss.feed;
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
                    let text = (item.description || item.content);
                    text = text.toString().replace(/<>/g, '');

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
