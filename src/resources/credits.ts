// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Credit, and what each request did and cost.
 */
export class Credits extends APIResource {
  /**
   * Get the account's credit details
   */
  get(options?: RequestOptions): APIPromise<Credits> {
    return this._client.get('/v1/credits', options);
  }
}

export interface Credits {
  /**
   * What a new request can use: balance minus reserved.
   */
  available_usd: number;

  /**
   * Everything paid in, minus everything charged.
   */
  balance_usd: number;

  /**
   * Held by requests still running.
   */
  reserved_usd: number;
}

export declare namespace Credits {
  export { type Credits as Credits };
}
