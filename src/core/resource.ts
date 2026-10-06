// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { OpenDocRouter } from '../client';

export abstract class APIResource {
  protected _client: OpenDocRouter;

  constructor(client: OpenDocRouter) {
    this._client = client;
  }
}
