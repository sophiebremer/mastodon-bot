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
    async getItems(sinceTimestamp) {
        if (this.mode !== 'source') {
            throw new Error('Client is not in source mode');
        }
        const allItems = [];
        const config = this.config;
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
                    let text = (item.description || item.summary || item.title);
                    text = config.append_name ? config.append_name + '\n' + text : text;
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
        if (config.item_limit &&
            allItems.length > config.item_limit) {
            allItems.splice(0, allItems.length - config.item_limit);
        }
        return allItems;
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
