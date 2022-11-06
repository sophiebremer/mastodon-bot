Mastodon Bot
============

This bot can filter and post RSS items to a Mastodon account.

config.json
-----------

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
