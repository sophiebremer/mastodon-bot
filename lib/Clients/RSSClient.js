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
    async getItems() {
        if (this.mode !== 'source') {
            throw new Error('Client is not in source mode');
        }
        const allItems = [];
        const config = this.config;
        const feeds = config.feeds;
        const sinceTimestamp = (new Date().getTime() - (config.minutesToCheck || 10) * 60000);
        const stdout = process.stdout;
        stdout.write(`Searching for new items since ${new Date(sinceTimestamp).toUTCString()}\n`);
        for (const feedName in feeds) {
            stdout.write(`Checking ${feedName}`);
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
                    link = typeof link === 'object' ? link.$_href : link;
                    link = Utilities.replacePatterns(link, (config.link_replacements || {}));
                    let text = Utilities.trimSpaces(item.description || item.summary || '', true);
                    text = (item.title && text ?
                        Utilities.trimSpaces(item.title, true) + '\n\n' + text :
                        Utilities.trimSpaces(item.title || '', true) || text);
                    text = (config.append_name && feedName ?
                        Utilities.trimSpaces(feedName, true) + ': ' + text :
                        text);
                    allItems.push({
                        link,
                        source_type: 'rss',
                        text,
                        timestamp
                    });
                    stdout.write('.');
                }
            }
            stdout.write(' - done.\n');
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
