/**
 * Simple in-memory cache for search results
 */

import type { CacheEntry, SearchResults } from '../types/index.js';

export class SearchCache {
  private cache: Map<string, CacheEntry>;
  private ttlMs: number;
  private maxSize: number;

  constructor(ttlMinutes: number = 60, maxSize: number = 100) {
    this.cache = new Map();
    this.ttlMs = ttlMinutes * 60 * 1000;
    this.maxSize = maxSize;
  }

  /**
   * Get cached results for a query
   */
  get(query: string): SearchResults | null {
    const normalized = this.normalizeQuery(query);
    const entry = this.cache.get(normalized);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(normalized);
      return null;
    }

    return { ...entry.results, cached: true };
  }

  /**
   * Cache search results
   */
  set(query: string, results: SearchResults): void {
    const normalized = this.normalizeQuery(query);

    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const entry: CacheEntry = {
      query: normalized,
      results,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.ttlMs,
    };

    this.cache.set(normalized, entry);
  }

  /**
   * Clear all cached results
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; ttlMinutes: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttlMinutes: this.ttlMs / (60 * 1000),
    };
  }

  /**
   * Normalize query for cache key (lowercase, trim, remove excess spaces)
   */
  private normalizeQuery(query: string): string {
    return query.toLowerCase().trim().replace(/\s+/g, ' ');
  }
}
