// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Parse documents, synchronously (up to 50 pages) or as async jobs (up to 500 pages).
 */
export class Parse extends APIResource {
  /**
   * `mode: "sync"` (the default) parses the document in this request and returns 200
   * with every page, up to the model's `max_sync_pages`. `mode: "async"`, which
   * needs `cache: true`, returns 202 and parses up to 500 pages as a job;
   * `GET /v1/parse/{id}?expand=markdown` has the results. At most 5 async requests
   * run at once per account, and at most 300 requests a minute.
   *
   * Admission holds the most the request could cost; it's released, less the actual
   * charge, when the request finishes. Failed pages are free.
   *
   * @example
   * ```ts
   * const parseRecord = await client.parse.create({
   *   document: { url: 'url' },
   *   model: 'google/gemini-3-flash',
   * });
   * ```
   */
  create(body: ParseCreateParams, options?: RequestOptions): APIPromise<ParseRecord> {
    return this._client.post('/v1/parse', { body, ...options });
  }

  /**
   * Deletes the results stored with `cache: true`, so they're also no longer served
   * from the cache. A running job stops before its next chunk. Pages already parsed
   * are still charged. The request's status and cost stay available.
   *
   * @example
   * ```ts
   * const parse = await client.parse.delete(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<ParseDeleteResponse> {
    return this._client.delete(path`/v1/parse/${id}`, options);
  }

  /**
   * Works for any request. While it runs, `pages` is empty and `pages_done` counts
   * progress. Then it returns every page, unless the expanded results are over 4 MB:
   * then `has_more` is true, and you ask again with `cursor` set to `next_cursor`.
   *
   * Markdown and layout are opt-in, with `expand`, and only requests sent with
   * `cache: true` store them, for 24 hours after they finish. Without `expand`, this
   * never returns document text.
   *
   * @example
   * ```ts
   * const parseRecord = await client.parse.get(
   *   '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
   * );
   * ```
   */
  get(
    id: string,
    query: ParseGetParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ParseRecord> {
    return this._client.get(path`/v1/parse/${id}`, { query, ...options });
  }
}

export interface ParseRecord {
  /**
   * For `GET /v1/parse/{id}`.
   */
  id: string;

  /**
   * Null until the request settles.
   */
  charge_usd: number | null;

  created_at: string;

  /**
   * Why a rejected or failed request ended, as an error code.
   */
  error_code: string | null;

  has_more: boolean;

  /**
   * The request's `mode`.
   */
  mode: 'sync' | 'async';

  model: string;

  model_version: string;

  /**
   * Pass as `cursor` to get the next pages.
   */
  next_cursor: number | null;

  page_count: number;

  pages: Array<ParseRecord.OkPage | ParseRecord.ErrorPage>;

  pages_done: number;

  price_version: string;

  /**
   * When the stored results are, or were, deleted. Null while processing or when
   * nothing was stored (like setting `cache: false`).
   */
  results_expire_at: string;

  /**
   * `expired`: the request's hold ran out before it settled, so it's free.
   * `rejected`: refused before it started (see `error_code`), and free.
   */
  status: 'processing' | 'completed' | 'partial' | 'failed' | 'expired' | 'rejected';

  /**
   * Null until the request settles.
   */
  usage: ParseRecord.Usage;
}

export namespace ParseRecord {
  export interface OkPage {
    /**
     * Served from the result cache, free.
     */
    cached: boolean;

    charge_usd: number;

    page: number;

    status: 'ok';

    usage: OkPage.Usage;

    /**
     * For requests sent with `layout: true`: in the POST response, or from GET with
     * `expand=layout`.
     */
    layout?: OkPage.PageLayoutOk | OkPage.PageLayoutError;

    /**
     * Always in the POST response. From `GET /v1/parse/{id}`, with `expand=markdown`
     * only.
     */
    markdown?: string;
  }

  export namespace OkPage {
    export interface Usage {
      input_tokens: number;

      output_tokens: number;
    }

    export interface PageLayoutOk {
      /**
       * The markdown's elements in reading order, then pictures it doesn't mention.
       */
      elements: Array<PageLayoutOk.Element>;

      height: number;

      status: 'ok';

      /**
       * Points for a PDF page, pixels for an image.
       */
      width: number;
    }

    export namespace PageLayoutOk {
      export interface Element {
        /**
         * In reading order. Empty when the element couldn't be placed; more than one when
         * it's printed in pieces, such as a paragraph that continues in the next column.
         */
        boxes: Array<Element.Box>;

        confidence: number;

        /**
         * First and last line of the page markdown, 0-based and inclusive, splitting on
         * "\n" only. Null for a picture the markdown doesn't mention.
         */
        lines: Array<unknown> | null;

        type:
          | 'title'
          | 'section_header'
          | 'text'
          | 'list_item'
          | 'table'
          | 'picture'
          | 'chart'
          | 'formula'
          | 'caption'
          | 'footnote'
          | 'page_header'
          | 'page_footer'
          | 'code'
          | 'form'
          | 'key_value';
      }

      export namespace Element {
        /**
         * Fractions of the page width and height, from the top left.
         */
        export interface Box {
          h: number;

          w: number;

          x: number;

          y: number;

          /**
           * Clockwise degrees about the box's centre, for text printed at an angle. x, y, w
           * and h are then the unrotated box.
           */
          r?: number;
        }
      }
    }

    /**
     * The page's markdown is still there; layout isn't charged.
     */
    export interface PageLayoutError {
      error: PageLayoutError.Error;

      status: 'error';
    }

    export namespace PageLayoutError {
      export interface Error {
        code: 'provider_error' | 'timeout' | 'unreadable_page' | 'at_capacity';

        message: string;
      }
    }
  }

  export interface ErrorPage {
    charge_usd: 0;

    error: ErrorPage.Error;

    page: number;

    status: 'error';
  }

  export namespace ErrorPage {
    export interface Error {
      /**
       * - `provider_error`: The provider returned an error.
       * - `rate_limited`: The provider rate-limited the page.
       * - `timeout`: The page didn't finish before the deadline.
       * - `output_truncated`: The output hit the token limit.
       * - `content_filtered`: The provider blocked the output, or the model declined.
       * - `repetitive_output`: The model got stuck repeating the same text.
       * - `invalid_output`: The model answered without transcribing the page.
       * - `empty_output`: The model returned no text.
       * - `at_capacity`: No provider capacity before the deadline.
       * - `unreadable_page`: The PDF opened, but this page couldn't be split or
       *   rendered.
       * - `response_too_large`: The page didn't fit in the response. Request it on its
       *   own with pages.
       * - `not_processed`: The async job ended before this page ran.
       */
      code:
        | 'provider_error'
        | 'rate_limited'
        | 'timeout'
        | 'output_truncated'
        | 'content_filtered'
        | 'repetitive_output'
        | 'invalid_output'
        | 'empty_output'
        | 'at_capacity'
        | 'unreadable_page'
        | 'response_too_large'
        | 'not_processed';

      /**
       * The page's own message in the POST response, or from GET with `expand=markdown`.
       * Otherwise the code's standard description.
       */
      message: string;

      /**
       * The provider's own reason when it gave one, e.g. `RECITATION`, `SAFETY`,
       * `refusal`, `max_tokens` or `repetition`.
       */
      reason?: string;
    }
  }

  /**
   * Null until the request settles.
   */
  export interface Usage {
    input_tokens: number;

    output_tokens: number;

    [k: string]: unknown;
  }
}

export interface ParseDeleteResponse {
  id: string;

  deleted: true;
}

export interface ParseCreateParams {
  /**
   * A URL, inline base64 data, or an upload.
   */
  document:
    | ParseCreateParams.URLDocument
    | ParseCreateParams.InlineDocument
    | ParseCreateParams.UploadDocument;

  /**
   * A model `id` from `GET /v1/models`.
   */
  model: string;

  /**
   * Store the results, encrypted, for 24 hours: `GET /v1/parse/{id}?expand=markdown`
   * reads them and `DELETE /v1/parse/{id}` deletes them sooner. Pages your account
   * already has stored for the same document, model and `layout` are served from
   * them, free. Required for `async`. Defaults to false.
   */
  cache?: boolean;

  /**
   * Add each ok page's `layout`: its elements, the markdown lines each one spans and
   * where it's printed. Adds $0.20 per million tokens to pages whose layout comes
   * back. Defaults to false.
   */
  layout?: boolean;

  /**
   * `sync` parses the document in this request and returns 200 with results for
   * every page, up to the model's `max_sync_pages`. `async` returns 202 parses it as
   * a job pollable on `GET /v1/parse/<id>`, up to 500 pages. It needs `cache: true`.
   * Defaults to `sync`.
   */
  mode?: 'sync' | 'async';

  /**
   * 1-based pages and ranges. Defaults to every page. At most the model's
   * `max_sync_pages` in sync mode, 500 in async mode.
   */
  pages?: string;
}

export namespace ParseCreateParams {
  export interface URLDocument {
    /**
     * A public URL to fetch, up to 50 MB.
     */
    url: string;
  }

  export interface InlineDocument {
    /**
     * The file, base64-encoded.
     */
    data: string;

    mime_type: 'application/pdf' | 'image/png' | 'image/jpeg';
  }

  export interface UploadDocument {
    /**
     * An ID obtained from `POST /v1/uploads`.
     */
    upload_id: string;
  }
}

export interface ParseGetParams {
  /**
   * The `next_cursor` of the previous response.
   */
  cursor?: number;

  /**
   * `markdown` adds each ok page's markdown, `layout` its layout (for requests sent
   * with `layout: true`), and `markdown,layout` both. For requests sent with
   * `cache: true`.
   */
  expand?: string;
}

export declare namespace Parse {
  export {
    type ParseRecord as ParseRecord,
    type ParseDeleteResponse as ParseDeleteResponse,
    type ParseCreateParams as ParseCreateParams,
    type ParseGetParams as ParseGetParams,
  };
}
