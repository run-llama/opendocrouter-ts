// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import OpenDocRouter from '@llamaindex/opendocrouter';

const client = new OpenDocRouter({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource parse', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.parse.create({
      document: { url: 'url' },
      model: 'google/gemini-3-flash',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.parse.create({
      document: { url: 'url' },
      model: 'google/gemini-3-flash',
      cache: true,
      layout: true,
      mode: 'sync',
      pages: '1-3,7',
    });
  });

  // Mock server tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.parse.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('get', async () => {
    const responsePromise = client.parse.get('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('get: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.parse.get(
        '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        { cursor: 0, expand: 'markdown,layout' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(OpenDocRouter.NotFoundError);
  });
});
