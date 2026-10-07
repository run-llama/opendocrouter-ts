# Parse

Types:

- <code><a href="./src/resources/parse.ts">ParseRecord</a></code>
- <code><a href="./src/resources/parse.ts">ParseDeleteResponse</a></code>

Methods:

- <code title="post /v1/parse">client.parse.<a href="./src/resources/parse.ts">create</a>({ ...params }) -> ParseRecord</code>
- <code title="delete /v1/parse/{id}">client.parse.<a href="./src/resources/parse.ts">delete</a>(id) -> ParseDeleteResponse</code>
- <code title="get /v1/parse/{id}">client.parse.<a href="./src/resources/parse.ts">get</a>(id, { ...params }) -> ParseRecord</code>

# Uploads

Types:

- <code><a href="./src/resources/uploads.ts">Upload</a></code>

Methods:

- <code title="post /v1/uploads">client.uploads.<a href="./src/resources/uploads.ts">create</a>() -> Upload</code>

# Credits

Types:

- <code><a href="./src/resources/credits.ts">Credits</a></code>

Methods:

- <code title="get /v1/credits">client.credits.<a href="./src/resources/credits.ts">get</a>() -> Credits</code>

# Models

Types:

- <code><a href="./src/resources/models.ts">ModelListResponse</a></code>

Methods:

- <code title="get /v1/models">client.models.<a href="./src/resources/models.ts">list</a>() -> ModelListResponse</code>
