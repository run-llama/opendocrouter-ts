// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Parse documents, synchronously or as async jobs.
 */
export class Parse extends APIResource {
  /**
   * `mode: "sync"` (the default) parses the document in this request and returns 200
   * with every page, up to the model's `max_sync_pages`. `mode: "async"` returns 202
   * and parses up to 500 pages as a job; `GET /v1/parse/{id}?expand=markdown` has
   * the results. At most 5 async requests run at once per account, and at most 300
   * requests a minute.
   *
   * Admission holds the most the request could cost; it's released, less the actual
   * charge, when the request finishes. Failed pages are free.
   *
   * @example
   * ```ts
   * const parse = await client.parse.create({
   *   document: { url: 'url' },
   *   model: 'google/gemini-3-flash',
   * });
   * ```
   */
  create(body: ParseCreateParams, options?: RequestOptions): APIPromise<ParseCreateResponse> {
    return this._client.post('/v1/parse', { body, ...options });
  }

  /**
   * A running job stops before its next chunk. Pages already parsed are still
   * charged. The request's status and cost stay available. A sync request stored
   * nothing, so this does nothing.
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
   * Markdown and layout are opt-in, with `expand`, and only async requests store
   * them, for 24 hours after they finish. Without it, this never returns document
   * text.
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
   * The request's `mode`. `async` markdown is stored for `expand=markdown`; `sync`
   * markdown is only in the POST response.
   */
  mode: 'sync' | 'async';

  model: string;

  model_version: string;

  /**
   * Pass as `cursor` to get the next pages.
   */
  next_cursor: number | null;

  page_count: number;

  /**
   * Empty while processing.
   */
  pages: Array<ParseRecord.RecordOkPage | ParseRecord.RecordErrorPage>;

  pages_done: number;

  price_version: string;

  /**
   * When an async request's stored results are, or were, deleted. Null for sync
   * requests, and while processing.
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

  /**
   * In the 202 response only.
   */
  poll_url?: string;
}

export namespace ParseRecord {
  export interface RecordOkPage {
    /**
     * Served from the result cache, free.
     */
    cached: boolean;

    charge_usd: number;

    page: number;

    status: 'ok';

    usage: RecordOkPage.Usage;

    /**
     * With `expand=layout`, for requests sent with `layout: true`.
     */
    layout?: unknown;

    /**
     * With `expand=markdown` only.
     */
    markdown?: string;
  }

  export namespace RecordOkPage {
    export interface Usage {
      input_tokens: number;

      output_tokens: number;
    }
  }

  export interface RecordErrorPage {
    charge_usd: 0;

    error: RecordErrorPage.Error;

    page: number;

    status: 'error';
  }

  export namespace RecordErrorPage {
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
       * With `expand=markdown`, the page's own message. Otherwise the code's standard
       * description.
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

export interface ParseCreateResponse {
  /**
   * For `GET /v1/parse/{id}`.
   */
  id: string;

  charge_usd: number;

  model: string;

  model_version: string;

  /**
   * There's no joined markdown, to stay under the response size limit: join
   * `pages[].markdown` yourself.
   */
  pages: Array<ParseCreateResponse.OkPage | ParseCreateResponse.ErrorPage>;

  price_version: string;

  status: 'completed' | 'partial' | 'failed';

  usage: ParseCreateResponse.Usage;
}

export namespace ParseCreateResponse {
  export interface OkPage {
    /**
     * Served from the result cache, free.
     */
    cached: boolean;

    charge_usd: number;

    markdown: string;

    page: number;

    status: 'ok';

    usage: OkPage.Usage;

    /**
     * With `layout: true` only.
     */
    layout?: OkPage.PageLayoutOk | OkPage.PageLayoutError;
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

      message: string;

      /**
       * The provider's own reason when it gave one, e.g. `RECITATION`, `SAFETY`,
       * `refusal`, `max_tokens` or `repetition`.
       */
      reason?: string;
    }
  }

  export interface Usage {
    input_tokens: number;

    output_tokens: number;
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
   * Keep ok pages for 24 hours and serve identical pages of the same document from
   * them for free. Defaults to false.
   */
  cache?: boolean;

  /**
   * Add each ok page's `layout`: its elements, the markdown lines each one spans and
   * where it's printed. Adds $0.20 per million tokens to pages whose layout comes
   * back. Defaults to false.
   */
  layout?: boolean;

  /**
   * `sync` parses the document in this request and returns 200 with every page, up
   * to the model's `max_sync_pages`. `async` returns 202 with a `poll_url` and
   * parses it as a job, up to 500 pages. Defaults to `sync`.
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
     * From `POST /v1/uploads`.
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
   * with `layout: true`), and `markdown,layout` both. Async requests only.
   */
  expand?: string;
}

export declare namespace Parse {
  export {
    type ParseRecord as ParseRecord,
    type ParseCreateResponse as ParseCreateResponse,
    type ParseDeleteResponse as ParseDeleteResponse,
    type ParseCreateParams as ParseCreateParams,
    type ParseGetParams as ParseGetParams,
  };
}
