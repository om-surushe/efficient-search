#!/usr/bin/env node

/**
 * Efficient Search MCP Server
 * LLM-optimized web search using Google Programmable Search Engine
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { GoogleSearchClient } from './lib/google-search-client.js';
import { ResultEnricher } from './lib/result-enricher.js';
import { SearchCache } from './lib/search-cache.js';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;
const CACHE_TTL_MINUTES = parseInt(process.env.CACHE_TTL_MINUTES || '60', 10);
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS || '10', 10);

if (!GOOGLE_API_KEY) {
  console.error('Error: GOOGLE_API_KEY environment variable is required');
  process.exit(1);
}

if (!SEARCH_ENGINE_ID) {
  console.error('Error: SEARCH_ENGINE_ID environment variable is required');
  process.exit(1);
}

// Initialize clients
const searchClient = new GoogleSearchClient({
  apiKey: GOOGLE_API_KEY,
  searchEngineId: SEARCH_ENGINE_ID,
  maxResults: MAX_RESULTS,
});

const enricher = new ResultEnricher();
const cache = new SearchCache(CACHE_TTL_MINUTES);

// Create MCP server
const server = new Server(
  {
    name: '@om-surushe/efficient-search',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'web_search',
        description: 'Search the web using Google. Returns LLM-optimized results with titles, URLs, snippets, and metadata. Results are cached for efficiency.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            num: {
              type: 'number',
              description: 'Number of results to return (1-10, default: 10)',
              minimum: 1,
              maximum: 10,
            },
            safe: {
              type: 'string',
              enum: ['off', 'medium', 'high'],
              description: 'Safe search level',
            },
            gl: {
              type: 'string',
              description: 'Geolocation (country code, e.g., "us", "in")',
            },
            lr: {
              type: 'string',
              description: 'Language restriction (e.g., "lang_en", "lang_hi")',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'clear_cache',
        description: 'Clear the search results cache',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_cache_stats',
        description: 'Get cache statistics (size, TTL, max size)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    let result;

    switch (name) {
      case 'web_search': {
        if (!args.query) {
          throw new Error('query is required');
        }

        const query = args.query as string;

        // Check cache first
        const cached = cache.get(query);
        if (cached) {
          result = cached;
          break;
        }

        // Execute search
        const response = await searchClient.search(query, {
          num: (args.num as number) || MAX_RESULTS,
          safe: args.safe as 'off' | 'medium' | 'high',
          gl: args.gl as string,
          lr: args.lr as string,
        });

        // Enrich results
        const enriched = enricher.enrichResults(query, response);

        // Cache for future queries
        cache.set(query, enriched);

        result = enriched;
        break;
      }

      case 'clear_cache':
        cache.clear();
        result = { success: true, message: 'Cache cleared' };
        break;

      case 'get_cache_stats':
        result = cache.getStats();
        break;

      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
          }),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Efficient Search MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
