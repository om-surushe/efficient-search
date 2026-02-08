/**
 * Type definitions for Efficient Search MCP
 */

export interface SearchConfig {
  apiKey: string;
  searchEngineId: string;
  baseUrl?: string;
  maxResults?: number;
}

/**
 * Raw Google PSE API response
 */
export interface GoogleSearchResponse {
  kind: string;
  url: {
    type: string;
    template: string;
  };
  queries: {
    request: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
    }>;
    nextPage?: Array<{
      title: string;
      totalResults: string;
      searchTerms: string;
      count: number;
      startIndex: number;
    }>;
  };
  searchInformation: {
    searchTime: number;
    formattedSearchTime: string;
    totalResults: string;
    formattedTotalResults: string;
  };
  items?: GoogleSearchItem[];
}

export interface GoogleSearchItem {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
  pagemap?: {
    metatags?: Array<Record<string, string>>;
    cse_thumbnail?: Array<{
      src: string;
      width: string;
      height: string;
    }>;
    cse_image?: Array<{
      src: string;
    }>;
  };
}

/**
 * LLM-optimized search result
 */
export interface EnrichedSearchResult {
  title: string;
  url: string;
  snippet: string;
  displayUrl: string;
  relevance: number; // 0-1 score
  metadata?: {
    description?: string;
    author?: string;
    publishedDate?: string;
    thumbnail?: string;
    siteName?: string;
  };
}

export interface SearchResults {
  query: string;
  totalResults: number;
  searchTime: number;
  results: EnrichedSearchResult[];
  summary: string; // LLM-friendly summary
  cached: boolean;
}

export interface CacheEntry {
  query: string;
  results: SearchResults;
  timestamp: number;
  expiresAt: number;
}
