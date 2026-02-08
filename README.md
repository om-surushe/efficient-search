# Efficient Search

[![npm version](https://img.shields.io/npm/v/@om-surushe/efficient-search.svg)](https://www.npmjs.com/package/@om-surushe/efficient-search)
[![npm downloads](https://img.shields.io/npm/dm/@om-surushe/efficient-search.svg)](https://www.npmjs.com/package/@om-surushe/efficient-search)
[![CI](https://github.com/om-surushe/efficient-search/actions/workflows/ci.yml/badge.svg)](https://github.com/om-surushe/efficient-search/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.0+-f472b6.svg)](https://bun.sh/)

**Part of the Efficient MCP series - Web search optimized for LLMs with intelligent caching and rich context.**

> **🎉 Now Published!** Install with `bunx @om-surushe/efficient-search`

## Quick Start

```bash
# Install globally
npm install -g @om-surushe/efficient-search

# Or run directly
bunx @om-surushe/efficient-search
```

**Get your Google PSE credentials:**
1. Create a Programmable Search Engine: https://programmablesearchengine.google.com/
2. Get API key: https://console.cloud.google.com/apis/credentials
3. Copy Search Engine ID from PSE dashboard

**Add to your MCP client config:**
```json
{
  "mcpServers": {
    "efficient-search": {
      "command": "bunx",
      "args": ["@om-surushe/efficient-search"],
      "env": {
        "GOOGLE_API_KEY": "your_api_key_here",
        "SEARCH_ENGINE_ID": "your_search_engine_id"
      }
    }
  }
}
```

## What Makes This Different?

**Traditional Google Search API:**
```json
{
  "title": "Example Page",
  "link": "https://example.com",
  "snippet": "Some text..."
}
```
→ LLM has to extract metadata, clean HTML entities, rank results = **More tokens, slower**

**Efficient Search MCP:**
```json
{
  "title": "Example Page",
  "url": "https://example.com",
  "snippet": "Clean, formatted text",
  "displayUrl": "example.com",
  "relevance": 0.95,
  "metadata": {
    "description": "Full page description",
    "author": "Author name",
    "publishedDate": "2024-01-01",
    "thumbnail": "https://...",
    "siteName": "Example"
  },
  "summary": "Found 1,234 results. Most relevant: ..."
}
```
→ Everything pre-processed. LLM just reads and responds. = **Faster, efficient, cached**

## Features

- 🔍 **Clean, structured results** - No HTML entities, formatted for LLM consumption
- 🧠 **Rich metadata extraction** - Author, publish date, thumbnails, descriptions
- ⚡ **Smart caching** - 60min default TTL, configurable
- 🎯 **Relevance scoring** - Pre-calculated relevance for each result
- 📊 **LLM-friendly summaries** - "Found X results, most relevant: ..."
- 🌍 **Geolocation & language** - Filter by country and language
- 🔒 **Safe search** - Configurable safety levels
- 🚀 **Built with Bun** - Fast, modern TypeScript runtime

## Available Tools

| Tool | Description |
|------|-------------|
| `web_search` | Search the web with LLM-optimized results |
| `clear_cache` | Clear cached search results |
| `get_cache_stats` | View cache size, TTL, and hit rate |

## Configuration

Environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_API_KEY` | ✅ | - | Google Cloud API key |
| `SEARCH_ENGINE_ID` | ✅ | - | Programmable Search Engine ID |
| `CACHE_TTL_MINUTES` | ❌ | 60 | Cache time-to-live in minutes |
| `MAX_RESULTS` | ❌ | 10 | Maximum results per query |

## Usage Examples

### Basic Search
```typescript
web_search({ query: "typescript best practices" })
```

### Advanced Search with Filters
```typescript
web_search({
  query: "machine learning papers",
  num: 5,
  gl: "us",
  lr: "lang_en",
  safe: "high"
})
```

### Response Format
```json
{
  "query": "typescript best practices",
  "totalResults": 12400000,
  "searchTime": 0.45,
  "cached": false,
  "summary": "Found 12,400,000 results. Most relevant: ...",
  "results": [
    {
      "title": "TypeScript Best Practices Guide",
      "url": "https://example.com/guide",
      "snippet": "Clean, formatted snippet...",
      "displayUrl": "example.com",
      "relevance": 1.0,
      "metadata": {
        "description": "Comprehensive guide...",
        "author": "John Doe",
        "publishedDate": "2024-01-15"
      }
    }
  ]
}
```

## Tech Stack

- **Runtime**: [Bun](https://bun.sh/) - Fast JavaScript runtime
- **Language**: TypeScript 5.3+
- **Protocol**: [Model Context Protocol](https://github.com/modelcontextprotocol) (MCP)
- **API**: [Google Programmable Search Engine](https://programmablesearchengine.google.com/)

## Development

```bash
# Install dependencies
npm install

# Run in dev mode
bun run dev

# Build
bun run build

# Type check
bun run typecheck

# Lint
bun run lint
```

## Part of Efficient MCP Series

- [@om-surushe/efficient-ticktick](https://www.npmjs.com/package/@om-surushe/efficient-ticktick) - LLM-optimized TickTick task management
- **@om-surushe/efficient-search** - LLM-optimized web search (this package)
- More coming soon...

All packages focus on:
- **Token efficiency** - Pre-processed, rich context
- **LLM-first design** - Built for AI consumption
- **Professional quality** - Production-ready, tested, documented

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**Om Surushe**
- GitHub: [@om-surushe](https://github.com/om-surushe)
- LinkedIn: [om-surushe](https://linkedin.com/in/om-surushe)
- npm: [@om-surushe](https://www.npmjs.com/~om-surushe)

---

**Made with ❤️ and Bun for AI assistants**
