# Gateway Proxy Server

## Instructions

Beside the usage of this package as a dependency of your project, it can be used
to run an [`express`](http://expressjs.com) api server to expose same endpoints
documented in [lightstreams gateway api](https://docs.lightstreams.network/api-docs).

## Installation

Install `node_modules`, including their dev dependencies:
```
npm install
```

Environment variables are loaded from file `.env` on root path of the project.
You can find an sample file at `.env.sample`:
```
mv .env.sample .env
```

Modify `.env` to set a correct value for `GATEWAY_DOMAIN` which defines the
smart vault host domain.

**Sirius**

Lightstreams provides one public gateway endpoint running over Lightstreams test network, `Sirius`:
```
https://gateway.sirius.lightstreams.io
```

**Local**

You also can run your own local node of lightstreams smart vault. Follow the instructions [here](https://docs.lightstreams.network/getting-started/quick-start/#running-lightstreams-node)
by default it runs over:
```
http://localhost:9091
```

## How to use it

To run a local express server run the following command:

```bash
npm run start
```

By default it runs over [`localhost:3000`](http://localhost:3000).