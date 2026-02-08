/**
 * Result enrichment - convert raw Google results to LLM-friendly format
 */

import type {
  GoogleSearchResponse,
  GoogleSearchItem,
  EnrichedSearchResult,
  SearchResults,
} from '../types/index.js';

export class ResultEnricher {
  /**
   * Enrich Google search results for LLM consumption
   */
  enrichResults(query: string, response: GoogleSearchResponse, cached: boolean = false): SearchResults {
    const items = response.items || [];
    const enrichedResults = items.map((item, index) => this.enrichSingleResult(item, index, items.length));

    const totalResults = parseInt(response.searchInformation.totalResults, 10);
    const searchTime = response.searchInformation.searchTime;

    return {
      query,
      totalResults,
      searchTime,
      results: enrichedResults,
      summary: this.generateSummary(query, enrichedResults, totalResults),
      cached,
    };
  }

  /**
   * Enrich a single search result
   */
  private enrichSingleResult(
    item: GoogleSearchItem,
    index: number,
    total: number
  ): EnrichedSearchResult {
    // Calculate relevance score (simple position-based for now)
    const relevance = 1 - (index / total);

    // Extract metadata from pagemap
    const metatags = item.pagemap?.metatags?.[0] || {};
    const thumbnail = item.pagemap?.cse_thumbnail?.[0]?.src || item.pagemap?.cse_image?.[0]?.src;

    return {
      title: this.cleanTitle(item.title),
      url: item.link,
      snippet: this.cleanSnippet(item.snippet),
      displayUrl: item.displayLink,
      relevance,
      metadata: {
        description: metatags['og:description'] || metatags['description'],
        author: metatags['author'] || metatags['article:author'],
        publishedDate: metatags['article:published_time'] || metatags['datePublished'],
        thumbnail,
        siteName: metatags['og:site_name'] || item.displayLink,
      },
    };
  }

  /**
   * Clean title text (remove HTML entities, excess whitespace)
   */
  private cleanTitle(title: string): string {
    return title
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Clean snippet text
   */
  private cleanSnippet(snippet: string): string {
    return snippet
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\.\.\.$/, '')
      .trim();
  }

  /**
   * Generate LLM-friendly summary of search results
   */
  private generateSummary(query: string, results: EnrichedSearchResult[], totalResults: number): string {
    if (results.length === 0) {
      return `No results found for "${query}"`;
    }

    const topResult = results[0];
    const count = results.length;

    let summary = `Found ${totalResults.toLocaleString()} results for "${query}". `;
    summary += `Showing top ${count}. `;
    summary += `Most relevant: ${topResult.title} (${topResult.displayUrl})`;

    return summary;
  }
}
