// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Models extends APIResource {
  /**
   * List models and their prices
   */
  list(options?: RequestOptions): APIPromise<ModelListResponse> {
    return this._client.get('/v1/models', { ...options, __security: {} });
  }
}

export interface ModelListResponse {
  data: Array<ModelListResponse.Data>;

  price_version: string;
}

export namespace ModelListResponse {
  export interface Data {
    id: string;

    /**
     * What a typical page costs at these prices: the mean tokens per page this version
     * used on ParseBench. An estimate; your pages may differ. Null until benchmarked.
     */
    avg_charge_per_page_usd: number | null;

    /**
     * True for models on GPUs we start on demand. After the model sits idle, a request
     * waits up to 45 seconds for one to start, or fails with `model_starting` if it
     * takes longer, without being charged.
     */
    cold_starts: boolean;

    /**
     * The most one page can be charged, which is what a request holds per page.
     */
    max_charge_per_page_usd: number;

    /**
     * Most pages a `mode: "sync"` request can take.
     */
    max_sync_pages: number;

    name: string;

    /**
     * How long one page takes on this version, from its most recent successful pages
     * (up to 200, within 30 days). Pages in a request run in parallel. Null until
     * enough pages are measured.
     */
    page_latency: Data.PageLatency;

    /**
     * ParseBench scores for this version. Null while benchmarking.
     */
    parsebench: Data.Parsebench;

    price_per_million_tokens: Data.PricePerMillionTokens;

    /**
     * Changes whenever output behavior can change.
     */
    version: string;
  }

  export namespace Data {
    /**
     * How long one page takes on this version, from its most recent successful pages
     * (up to 200, within 30 days). Pages in a request run in parallel. Null until
     * enough pages are measured.
     */
    export interface PageLatency {
      p50_seconds: number;

      p90_seconds: number;

      pages_measured: number;
    }

    /**
     * ParseBench scores for this version. Null while benchmarking.
     */
    export interface Parsebench {
      charts: number;

      content_faithfulness: number;

      /**
       * Mean of the five category scores.
       */
      score: number;

      semantic_formatting: number;

      tables: number;

      /**
       * How well `layout: true` places each element on the page.
       */
      visual_grounding: number;
    }

    export interface PricePerMillionTokens {
      cached_input: number;

      input: number;

      output: number;
    }
  }
}

export declare namespace Models {
  export { type ModelListResponse as ModelListResponse };
}
