/**
 * Google Programmable Search Engine client
 */

import type { SearchConfig, GoogleSearchResponse } from '../types/index.js';

export class GoogleSearchClient {
  private config: SearchConfig;
  private baseUrl: string;

  constructor(config: SearchConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://www.googleapis.com/customsearch/v1';
  }

  /**
   * Execute a search query
   */
  async search(query: string, options?: {
    start?: number;
    num?: number;
    safe?: 'off' | 'medium' | 'high';
    lr?: string; // Language restriction
    gl?: string; // Geolocation
  }): Promise<GoogleSearchResponse> {
    const params = new URLSearchParams({
      key: this.config.apiKey,
      cx: this.config.searchEngineId,
      q: query,
      num: String(options?.num || this.config.maxResults || 10),
    });

    if (options?.start) params.append('start', String(options.start));
    if (options?.safe) params.append('safe', options.safe);
    if (options?.lr) params.append('lr', options.lr);
    if (options?.gl) params.append('gl', options.gl);

    const url = `${this.baseUrl}?${params}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: response.statusText } }));
        const errorMsg = (errorData as { error?: { message?: string } }).error?.message || response.statusText;
        throw new Error(`Google Search API error: ${errorMsg}`);
      }

      return await response.json() as GoogleSearchResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to execute search: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get search suggestions (if available)
   */
  async getSuggestions(_query: string): Promise<string[]> {
    // Google PSE doesn't provide autocomplete API
    // Return empty array for now, could integrate with another service
    return [];
  }
}
