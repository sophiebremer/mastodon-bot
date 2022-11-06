Mastodon Bot
============

This bot can filter and post RSS items to a Mastodon account.



Configuration
-------------

The Bot gets set up by a JSON configuration file, which contain 2 sections.



### `auth`

In the `auth` section does the bot load the access tokens, which allows
it to post new RSS items.



#### `auth: mastodon`

The `mastodon` section contains the authentication information for the Mastodon
account to use. The authentication must be set up on the Development page of the
Mastodon account settings.

* `access_token`: The access token to the Mastodon account. The account should at
  least allow `write:statuses`.
* `api_url`: The URL to the Mastodon server of the account, followed by
  `/api/v1/`.
* `timeout_ms`: An alternative timeout to wait for a JSON response from the
  Mastodon server.
* `trusted_cert_fingerprints`: This will expect specific certificates instead of
  the general ones of the operating system.



### `transform`

In the `transform` section does the bot load the single source to target
relations.



#### `transform: source`

The `source` section contains the configuration to find new items to post.

* `source_type`: This setting is required and defines the type of source. Only
  `rss` is supported right now.



### `transform: target`


The `target` section contains the configuration to post new items.

* `target_type`: This setting is required and defines the type of target. Only
  `mastodon` is supported right now.



Example: config.json
--------------------

```json
{
    "auth": {
        "mastodon": {
            // "timeout_ms": 60000;
            // "trusted_cert_fingerprints": ["XXXX"],
            "access_token": "XXXX",
            "api_url": "https://mastodon.example/api/v1/"
        }
    },
    "transforms": [
        {
            "source": {
                "source_type": "rss",
                // "append_name": true,
                // "check_updated_time": true,
                // "item_limit": 10,
                // "link_replacements": { "/\\?.*$/": "" },
                // "minutes_to_check": 10,
                "feeds": {
                    "RSS": "https://rss.example/feed.rss"
                }
            },
            "target": {
                "target_type": "mastodon",
                // "sensitive": false,
                "signature": "#rssbot"
            }
        }
    ]
}
```
