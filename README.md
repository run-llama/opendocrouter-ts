# OpenDocRouter TypeScript API Library

This library provides convenient access to the OpenDocRouter REST API from server-side TypeScript or JavaScript.

The REST API documentation can be found on [OpenDocRouter](<[https://developers.llamaindex.ai/](https://www.opendocrouter.ai/docs)>). The full API of this library can be found in [api.md](api.md).

## Installation

```sh
npm install git+https://github.com/run-llama/opendocrouter-typescript.git
```

> [!NOTE]
> This package is distributed only from this Git repository. It is not published to npm.

## Usage

The full API of this library can be found in [api.md](api.md).

<!-- prettier-ignore -->
```js
import OpenDocRouter from '@llamaindex/opendocrouter';

const client = new OpenDocRouter({
  apiKey: process.env['OPEN_DOC_ROUTER_API_KEY'], // This is the default and can be omitted
});

const parseResult = await client.parse.create({
  document: { url: 'https://arxiv.org/pdf/1706.03762' },
  model: 'google/gemini-3-flash',
});

console.log(parseResult.id);
```

### Request & Response types

This library includes TypeScript definitions for all request params and response fields. You may import and use them like so:

<!-- prettier-ignore -->
```ts
import OpenDocRouter from '@llamaindex/opendocrouter';

const client = new OpenDocRouter({
  apiKey: process.env['OPEN_DOC_ROUTER_API_KEY'], // This is the default and can be omitted
});

const parseRecord: OpenDocRouter.ParseRecord = await client.parse.get(
  '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
);
```

Documentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.

## Handling errors

When the library is unable to connect to the API,
or if the API returns a non-success status code (i.e., 4xx or 5xx response),
a subclass of `APIError` will be thrown:

<!-- prettier-ignore -->
```ts
const parseRecord = await client.parse
  .get('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e')
  .catch(async (err) => {
    if (err instanceof OpenDocRouter.APIError) {
      console.log(err.status); // 400
      console.log(err.name); // BadRequestError
      console.log(err.headers); // {server: 'nginx', ...}
    } else {
      throw err;
    }
  });
```

Error codes are as follows:

| Status Code | Error Type                 |
| ----------- | -------------------------- |
| 400         | `BadRequestError`          |
| 401         | `AuthenticationError`      |
| 403         | `PermissionDeniedError`    |
| 404         | `NotFoundError`            |
| 409         | `ConflictError`            |
| 422         | `UnprocessableEntityError` |
| 429         | `RateLimitError`           |
| >=500       | `InternalServerError`      |
| N/A         | `APIConnectionError`       |

### Retries

Certain errors will be automatically retried 2 times by default, with a short exponential backoff.
Connection errors (for example, due to a network connectivity problem), 408 Request Timeout, 409 Conflict,
429 Rate Limit, and >=500 Internal errors will all be retried by default.

You can use the `maxRetries` option to configure or disable this:

<!-- prettier-ignore -->
```js
// Configure the default for all requests:
const client = new OpenDocRouter({
  maxRetries: 0, // default is 2
});

// Or, configure per-request:
await client.parse.get('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
  maxRetries: 5,
});
```

### Timeouts

Requests time out after 1 minute by default. You can configure this with a `timeout` option:

<!-- prettier-ignore -->
```ts
// Configure the default for all requests:
const client = new OpenDocRouter({
  timeout: 20 * 1000, // 20 seconds (default is 1 minute)
});

// Override per-request:
await client.parse.get('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
  timeout: 5 * 1000,
});
```

On timeout, an `APIConnectionTimeoutError` is thrown.

Note that requests which time out will be [retried twice by default](#retries).

## Advanced Usage

### Accessing raw Response data (e.g., headers)

The "raw" `Response` returned by `fetch()` can be accessed through the `.asResponse()` method on the `APIPromise` type that all methods return.
This method returns as soon as the headers for a successful response are received and does not consume the response body, so you are free to write custom parsing or streaming logic.

You can also use the `.withResponse()` method to get the raw `Response` along with the parsed data.
Unlike `.asResponse()` this method consumes the body, returning once it is parsed.

<!-- prettier-ignore -->
```ts
const client = new OpenDocRouter();

const response = await client.parse.get('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e').asResponse();
console.log(response.headers.get('X-My-Header'));
console.log(response.statusText); // access the underlying Response object

const { data: parseRecord, response: raw } = await client.parse
  .get('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e')
  .withResponse();
console.log(raw.headers.get('X-My-Header'));
console.log(parseRecord.id);
```

### Logging

> [!IMPORTANT]
> All log messages are intended for debugging only. The format and content of log messages
> may change between releases.

#### Log levels

The log level can be configured in two ways:

1. Via the `OPEN_DOC_ROUTER_LOG` environment variable
2. Using the `logLevel` client option (overrides the environment variable if set)

```ts
import OpenDocRouter from '@llamaindex/opendocrouter';

const client = new OpenDocRouter({
  logLevel: 'debug', // Show all log messages
});
```

Available log levels, from most to least verbose:

- `'debug'` - Show debug messages, info, warnings, and errors
- `'info'` - Show info messages, warnings, and errors
- `'warn'` - Show warnings and errors (default)
- `'error'` - Show only errors
- `'off'` - Disable all logging

At the `'debug'` level, all HTTP requests and responses are logged, including headers and bodies.
Some authentication-related headers are redacted, but sensitive data in request and response bodies
may still be visible.

#### Custom logger

By default, this library logs to `globalThis.console`. You can also provide a custom logger.
Most logging libraries are supported, including [pino](https://www.npmjs.com/package/pino), [winston](https://www.npmjs.com/package/winston), [bunyan](https://www.npmjs.com/package/bunyan), [consola](https://www.npmjs.com/package/consola), [signale](https://www.npmjs.com/package/signale), and [@std/log](https://jsr.io/@std/log). If your logger doesn't work, please open an issue.

When providing a custom logger, the `logLevel` option still controls which messages are emitted, messages
below the configured level will not be sent to your logger.

```ts
import OpenDocRouter from '@llamaindex/opendocrouter';
import pino from 'pino';

const logger = pino();

const client = new OpenDocRouter({
  logger: logger.child({ name: 'OpenDocRouter' }),
  logLevel: 'debug', // Send all messages to pino, allowing it to filter
});
```

### Fetch options

If you want to set custom `fetch` options without overriding the `fetch` function, you can provide a `fetchOptions` object when instantiating the client or making a request. (Request-specific options override client options.)

```ts
import OpenDocRouter from '@llamaindex/opendocrouter';

const client = new OpenDocRouter({
  fetchOptions: {
    // `RequestInit` options
  },
});
```

## Versioning

This package is distributed only from this Git repository. It is not published to npm, has no release
tags, and produces no changelog — installing from the default branch always tracks the latest commit.
To pin a specific revision, install from a commit SHA:

    npm install git+https://github.com/run-llama/opendocrouter-typescript.git#<commit-sha>

Backwards-incompatible changes can land on the default branch, so pin a SHA if you need a stable surface.

### Determining the installed revision

The package version is a fixed placeholder (`0.0.1`) and never changes, so it cannot tell you which
revision you are running. Because the library is installed from Git, read the commit from your
project's lockfile instead: the `@llamaindex/opendocrouter` entry records the resolved commit SHA
in its `resolved` field (`package-lock.json`) or `resolved` line (`yarn.lock`). Quote that SHA when
filing an issue.

We are keen for your feedback; please open an [issue](https://www.github.com/run-llama/opendocrouter-typescript/issues) with questions, bugs, or suggestions.

## Requirements

TypeScript >= 4.9 is supported.

The following runtimes are supported:

- Web browsers (Up-to-date Chrome, Firefox, Safari, Edge, and more)
- Node.js 20 LTS or later ([non-EOL](https://endoflife.date/nodejs)) versions.
- Deno v1.28.0 or higher.
- Bun 1.0 or later.
- Cloudflare Workers.
- Vercel Edge Runtime.
- Jest 28 or greater with the `"node"` environment (`"jsdom"` is not supported at this time).
- Nitro v2.6 or greater.

Note that React Native is not supported at this time.

If you are interested in other runtime environments, please open or upvote an issue on GitHub.

## Contributing

See [the contributing documentation](./CONTRIBUTING.md).
