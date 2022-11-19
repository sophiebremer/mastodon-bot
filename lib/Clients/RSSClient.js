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
        const checkUpdated = !!config.check_updated_time;
        const limit = config.limit;
        const linkReplacements = config.link_replacements;
        const parser = new XML.XMLParser({
            ignoreAttributes: false,
            removeNSPrefix: true,
        });
        const response = await fetch(config.feed);
        const xml = parser.parse(await response.text());
        if (!xml.rss && !xml.feed) {
            throw new Error('RSS invalid');
        }
        let channels = xml.rss?.channel || xml.feed;
        channels = channels instanceof Array ? channels : [channels];
        let counter = 0;
        for (const channel of channels) {
            let items = channel.item || channel.entry;
            items = items instanceof Array ? items : [items];
            for (const item of items) {
                const timestamp = (checkUpdated ?
                    Date.parse(item.updated || item.pubDate || item.published) :
                    Date.parse(item.pubDate || item.published));
                let link = (item.link instanceof Array ? item.link[0] :
                    Utilities.attributeOrText(item.link, 'href'));
                if (link && linkReplacements) {
                    link = Utilities.replacePatterns(link, linkReplacements);
                }
                let text = (item.description || item.summary);
                if (text) {
                    text = Utilities.trimSpaces(Utilities.removeXML(text), true);
                }
                let title = (item.title &&
                    Utilities.trimSpaces(Utilities.removeXML(item.title), true));
                let uid = Utilities.trimSpaces((Utilities.attributeOrText(item.guid) ||
                    Utilities.attributeOrText(item.id) ||
                    `rss:${timestamp}`), true);
                if (!await this.isKnownUID(uid)) {
                    allItems.push({
                        source_type: 'rss',
                        link,
                        text,
                        title,
                        timestamp,
                        uid
                    });
                    await this.saveUID(uid);
                    if (limit && ++counter >= limit) {
                        break;
                    }
                }
            }
        }
        allItems.sort((a, b) => a.timestamp - b.timestamp);
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
