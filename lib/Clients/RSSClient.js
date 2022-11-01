/* *
 *
 *  Imports
 *
 * */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    getItems(sinceTimestamp) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mode !== 'source') {
                throw new Error('Client is not in source mode');
            }
            const config = this.config;
            const feeds = config.feeds;
            const allItems = [];
            for (const feedName in feeds) {
                const response = yield fetch(feeds[feedName]);
                const parser = new XML.XMLParser({
                    removeNSPrefix: true
                });
                const xml = parser.parse(yield response.text());
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
        });
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
