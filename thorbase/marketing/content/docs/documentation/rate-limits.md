---
title: "API Rate Limits"
group: "Documentation"
order: 3
description: "Understand TokenGO API rate limits and best practices for handling them."
---

## Overview

TokenGO uses rate limiting to ensure fair access to our APIs for all customers. Rate limits are applied **per API key per minute**, with different tiers based on your plan.

## Default Rate Limits

| Plan | Rate Limit |
|------|-----------|
| Free | 60 RPM |
| Pro | 300 RPM |
| Enterprise | Custom |

## Understanding Headers

Every API response includes rate limit headers:

- `X-RateLimit-Limit`: Maximum requests per minute
- `X-RateLimit-Remaining`: Requests remaining in the current window
- `X-RateLimit-Reset`: Unix timestamp when the window resets
- `Retry-After`: Seconds to wait before retrying (only on 429 responses)

## Handling Rate Limits

When you exceed your rate limit, the API returns a **429 Too Many Requests** response. Implement exponential backoff to gracefully handle this.

### Example: Exponential Backoff

```python
import time
import requests

def api_call_with_retry(url, headers, max_retries=3):
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers)
        if response.status_code != 429:
            return response
        wait = 2 ** attempt
        time.sleep(wait)
    raise Exception("Max retries exceeded")
```

## Best Practices

- Cache responses whenever possible to reduce API calls
- Preemptively check `X-RateLimit-Remaining` to avoid hitting limits
- Contact [enterprise@tokengo.com](mailto:enterprise@tokengo.com) for custom limits