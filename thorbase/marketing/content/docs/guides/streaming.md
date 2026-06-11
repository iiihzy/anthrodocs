---
title: "Understanding SSE Streaming"
group: "Guides"
order: 4
description: "Learn how TokenGO uses Server-Sent Events for streaming chat completions."
---

## What is SSE?

**Server-Sent Events (SSE)** is a standard allowing servers to push data to clients over a single HTTP connection. TokenGO uses SSE to stream chat completions token-by-token, giving users a real-time typing experience similar to ChatGPT.

## How It Works

1. Client sends a `POST /v1/chat/completions` with `stream: true`
2. Server responds with `Content-Type: text/event-stream`
3. Server pushes `data: {...}` chunks, each containing a single token
4. Stream ends with `data: [DONE]`

## Example Response

```
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"delta":{"content":"Hello"}}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"delta":{"content":" world"}}]}

data: [DONE]
```

## Handling Client-Side

```javascript
async function streamChat(prompt) {
  const response = await fetch('/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }], stream: true })
  })

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '))
    for (const line of lines) {
      if (line === 'data: [DONE]') return fullText
      const data = JSON.parse(line.slice(6))
      const token = data.choices?.[0]?.delta?.content || ''
      fullText += token
      console.log(token) // Render token in real-time
    }
  }
  return fullText
}
```

## Common Issues

- **Missing `stream: true`**: Forgetting to set `stream: true` returns a single JSON response
- **Incomplete chunks**: Always check `done` before processing
- **Encoding**: Ensure UTF-8 decoding to handle special characters correctly