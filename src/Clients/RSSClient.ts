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

    public async getItems(): Promise<Array<Client.Item>> {

        if (this.mode !== 'source') {
            throw new Error('Client is not in source mode');
        }

        const allItems: Array<Client.Item> = [];
        const config = this.config as RSSClient.SourceConfig;
        const checkUpdated = !!config.check_updated_time;
        const feeds = config.feeds;
        const sinceTimestamp = (
            await this.loadLastTimestamp() ||
            (new Date().getTime() - (config.minutes_to_check || 10) * 60000)
        );
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
                    const timestamp = (
                        checkUpdated ?
                            Date.parse(item.updated || item.pubDate || item.published) :
                            Date.parse(item.pubDate || item.published)
                    );

                    if (timestamp < sinceTimestamp) {
                        continue;
                    }

                    let link: (string|undefined) = (
                        item.link instanceof Array ? item.link[0] :
                        typeof item.link === 'object' ? item.link.$_href :
                        item.link
                    );

                    if (link && config.link_replacements) {
                        link = Utilities.replacePatterns(link, config.link_replacements);
                    }

                    let text: (string|undefined) = (item.description || item.summary);

                    if (text) {
                        text = Utilities.trimSpaces(text, true)
                    }

                    if (config.append_name && feedName && text) {
                        text = Utilities.trimSpaces(feedName, true) + ': ' + text;
                    }

                    let title: (string|undefined) = (
                        item.title && Utilities.trimSpaces(item.title, true)
                    );

                    allItems.push({
                        source_type: 'rss',
                        link,
                        text,
                        title,
                        timestamp
                    });

                    stdout.write('.');
                }
            }

            stdout.write(' - done.\n');
        }

        allItems.sort((a, b) => a.timestamp - b.timestamp);

        if (
            config.item_limit &&
            allItems.length > config.item_limit
        ) {
            allItems.splice(0, allItems.length - config.item_limit);
        }

        await this.saveLastTimestamp(
            allItems.length ?
                allItems[allItems.length - 1].timestamp :
                sinceTimestamp
        );

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
        check_updated_time?: boolean;
        feeds: Record<string, string>;
        item_limit?: number;
        link_replacements?: Record<string, string>;
        minutes_to_check?: number;
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
