Mastodon Bot
============

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
                // "sensitive": false,
                "target_type": "mastodon",
                "signature": "#rssbot"
            }
        }
    ]
}
```
