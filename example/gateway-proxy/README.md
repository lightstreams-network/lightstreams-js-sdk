# Gateway Proxy Server

## Instructions

Beside the usage of this package as a dependency of your project, it can be used
to run an [`express`](http://expressjs.com) api server to expose same endpoints
documented in [lightstreams gateway api](https://docs.lightstreams.network/api-docs).

**Installation**

Install `node_modules`, including their dev dependencies:
```
npm install
```

**Set environment**

Environment variables are loaded from file `.env` on root path of the project.
You can find an sample file at `.env.sample`:
```
mv .env.sample .env
```

The only relevant value included in `.env` is `GATEWAY_DOMAIN` which defines the
endpoint hit to perform gateway calls. Available gateway domains [here](#gateway-endpoints)

**Init server**

To run a local express server run the following command:

```bash
npm run start
```

By default it runs over [`localhost:3000`](http://localhost:3000).

## <a href="#gateway-endpoints"></a>Available Gateway APIs

Lightstreams team provides provides two public gateway api for its free usage.

Additionally to those endpoints you can run your own local lightstreams node,
follow the instructions [here](https://docs.lightstreams.network/getting-started/quick-start/#running-lightstreams-node)
