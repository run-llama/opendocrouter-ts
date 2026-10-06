// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Upload documents too large to send inline.
 */
export class Uploads extends APIResource {
  /**
   * For documents over 4 MB. PUT the file to `upload_url` (up to 50 MB), then send
   * `document: {upload_id}` to `POST /v1/parse`. An upload can be used once, and
   * expires 60 minutes after it's created. An account can have 100 unused uploads at
   * once.
   */
  create(options?: RequestOptions): APIPromise<Upload> {
    return this._client.post('/v1/uploads', options);
  }
}

export interface Upload {
  expires_at: string;

  max_bytes: number;

  upload_id: string;

  /**
   * PUT the file here.
   */
  upload_url: string;
}

export declare namespace Uploads {
  export { type Upload as Upload };
}
