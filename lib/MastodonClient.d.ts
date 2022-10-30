import Config from './Config';
import Mastodon from 'mastodon-api';
export declare class MastodonClient {
    constructor(config: Config);
    protected mastodon: Mastodon;
}
export default MastodonClient;
