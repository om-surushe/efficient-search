/**
 * Tests for search functionality
 */

import { describe, test, expect } from 'bun:test';
import { ResultEnricher } from '../src/lib/result-enricher.js';
import { SearchCache } from '../src/lib/search-cache.js';
import type { GoogleSearchResponse } from '../src/types/index.js';

describe('ResultEnricher', () => {
  const enricher = new ResultEnricher();

  test('should enrich search results with metadata', () => {
    const mockResponse: GoogleSearchResponse = {
      kind: 'customsearch#search',
      url: { type: 'application/json', template: '' },
      queries: {
        request: [{
          title: 'Test',
          totalResults: '100',
          searchTerms: 'test',
          count: 1,
          startIndex: 1,
        }],
      },
      searchInformation: {
        searchTime: 0.5,
        formattedSearchTime: '0.50',
        totalResults: '100',
        formattedTotalResults: '100',
      },
      items: [
        {
          kind: 'customsearch#result',
          title: 'Test &amp; Example',
          htmlTitle: '<b>Test</b> &amp; Example',
          link: 'https://example.com',
          displayLink: 'example.com',
          snippet: 'This is a test&nbsp;snippet...',
          htmlSnippet: 'This is a <b>test</b>&nbsp;snippet...',
          formattedUrl: 'https://example.com',
          htmlFormattedUrl: 'https://example.com',
          pagemap: {
            metatags: [{
              'og:description': 'Test description',
              'author': 'John Doe',
            }],
          },
        },
      ],
    };

    const result = enricher.enrichResults('test', mockResponse);

    expect(result.query).toBe('test');
    expect(result.totalResults).toBe(100);
    expect(result.results).toHaveLength(1);
    expect(result.results[0].title).toBe('Test & Example');
    expect(result.results[0].snippet).toBe('This is a test snippet');
    expect(result.results[0].relevance).toBe(1.0);
    expect(result.results[0].metadata?.description).toBe('Test description');
    expect(result.results[0].metadata?.author).toBe('John Doe');
  });

  test('should generate summary', () => {
    const mockResponse: GoogleSearchResponse = {
      kind: 'customsearch#search',
      url: { type: 'application/json', template: '' },
      queries: {
        request: [{
          title: 'Test',
          totalResults: '1000',
          searchTerms: 'test query',
          count: 2,
          startIndex: 1,
        }],
      },
      searchInformation: {
        searchTime: 0.3,
        formattedSearchTime: '0.30',
        totalResults: '1000',
        formattedTotalResults: '1,000',
      },
      items: [
        {
          kind: 'customsearch#result',
          title: 'First Result',
          htmlTitle: 'First Result',
          link: 'https://example.com',
          displayLink: 'example.com',
          snippet: 'Snippet',
          htmlSnippet: 'Snippet',
          formattedUrl: 'https://example.com',
          htmlFormattedUrl: 'https://example.com',
        },
      ],
    };

    const result = enricher.enrichResults('test query', mockResponse);

    expect(result.summary).toContain('1,000 results');
    expect(result.summary).toContain('test query');
    expect(result.summary).toContain('First Result');
  });
});

describe('SearchCache', () => {
  test('should cache and retrieve results', () => {
    const cache = new SearchCache(60);
    
    const mockResults = {
      query: 'test',
      totalResults: 100,
      searchTime: 0.5,
      results: [],
      summary: 'Test summary',
      cached: false,
    };

    cache.set('test', mockResults);
    const cached = cache.get('test');

    expect(cached).not.toBeNull();
    expect(cached?.query).toBe('test');
    expect(cached?.cached).toBe(true);
  });

  test('should normalize queries', () => {
    const cache = new SearchCache(60);
    
    const mockResults = {
      query: 'test',
      totalResults: 100,
      searchTime: 0.5,
      results: [],
      summary: 'Test summary',
      cached: false,
    };

    cache.set('TEST  QUERY', mockResults);
    const cached = cache.get('test query');

    expect(cached).not.toBeNull();
    expect(cached?.query).toBe('test');
  });

  test('should respect TTL', async () => {
    const cache = new SearchCache(0.001); // 0.001 minutes = 60ms
    
    const mockResults = {
      query: 'test',
      totalResults: 100,
      searchTime: 0.5,
      results: [],
      summary: 'Test summary',
      cached: false,
    };

    cache.set('test', mockResults);
    
    // Wait for TTL to expire
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const cached = cache.get('test');
    expect(cached).toBeNull();
  });

  test('should evict oldest entry when full', () => {
    const cache = new SearchCache(60, 2);
    
    const mockResults = {
      query: 'test',
      totalResults: 100,
      searchTime: 0.5,
      results: [],
      summary: 'Test summary',
      cached: false,
    };

    cache.set('query1', mockResults);
    cache.set('query2', mockResults);
    cache.set('query3', mockResults); // Should evict query1

    expect(cache.get('query1')).toBeNull();
    expect(cache.get('query2')).not.toBeNull();
    expect(cache.get('query3')).not.toBeNull();
  });

  test('should provide cache stats', () => {
    const cache = new SearchCache(30, 50);
    
    const stats = cache.getStats();
    
    expect(stats.ttlMinutes).toBe(30);
    expect(stats.maxSize).toBe(50);
    expect(stats.size).toBe(0);
  });
});
