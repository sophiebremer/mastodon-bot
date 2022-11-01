Mastodon Bot
============

config.json
-----------

```json
{
    "auth": {
        "mastodon": {
            "access_token": "XXXX",
            "api_url": "https://mastodon.social/api/v1/"
        }
    },
    "transforms": [
        {
            "source": {
                "source_type": "rss",
                "feeds": {
                    "RSS": "https://rss.example/feed.rss"
                }
            },
            "target": {
                "target_type": "mastodon",
                "signature": "#rssbot"
            }
        }
    ]
}
```
