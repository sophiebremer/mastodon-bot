Mastodon Bot
============

This bot can filter and post RSS items to a Mastodon account.

config.json
-----------

```json
{
    "auth": {
        "mastodon": {
            // "account_id": "XXXX",
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
                // "link_hash": false,
                // "link_query": false,
                "feeds": {
                    "RSS": "https://rss.example/feed.rss"
                },
                "item_limit": 10
            },
            "target": {
                "target_type": "mastodon",
                // "related_status_keywords": [ "search.example" ],
                // "sensitive": false,
                "signature": "#rssbot"
            }
        }
    ]
}
```
