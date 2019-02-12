# Lightstreams JS Gateway SDK

This repository is a Javascript SDK to facilitate the usage of functionalities
implemented in Lightstreams node, [http api](https://docs.lightstreams.network/api-docs).

## Requirements
- Node > 10
- Leth (Optional). [How to install](https://docs.lightstreams.network/getting-started/install/)

## Instructions

### SDK library usage

**Install node module**

Install `js-sdk-lightstreams` as part of your project dependencies:
```bash
npm install git+ssh://git@github.com:lightstreams-network/js-sdk-lightstreams#master --save
```

**Using Gateway SDK**

Initialize a gateway sdk object to interact with lightstreams gateway.

```
const lsClient = require('js-sdk-lightstreams')
const gateway = lsClient('https://gateway.sirius.lightstreams.io')
```
where `'https://gateway.sirius.lightstreams.io'` is the endpoint we are going to use to interact
with lightstreams node. [More available domains](#gateway-endpoints)

Once `LightstreamsSDK` is initialized you interact with it as follow:
```
// Get user balance
const account = "0xa981f8ca77d069d79b609ca0069b052db79e7e30"
const { balance } = await gateway.wallet.balance(account)
```

**Available Methods**

Gateway SDK interface is made to match, one to one, every available [gateway endpoints](https://docs.lightstreams.network/api-docs).
For instance, above sample code correspond to the following endpoint:

```
PATH: /user/balance
METHOD: GET
QUERY: {account: "0xa981f8ca77d069d79b609ca0069b052db79e7e30"}
```

## Run SDK server

Beside the usage of this package as a dependency of your project, it can be used
to run an [`express`](http://expressjs.com) api server to expose same endpoints
documented in [lightstreams gateway api](https://docs.lightstreams.network/api-docs).

**Installation**

You download github project:
```
git clone https://github.com/lightstreams-network/js-sdk-lightstreams.git
```

And install `node_modules`, including their dev dependencies:
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
npm run dev
```

By default it runs over [`localhost:3000`](http://localhost:3000).

## <a href="#gateway-endpoints"></a>Available Gateway APIs

Lightstreams team provides provides two public gateway api for its free usage.

Additionally to those endpoints you can run your own local lightstreams node,
follow the instructions [here](https://docs.lightstreams.network/getting-started/quick-start/#running-lightstreams-node)

**Sirius**

Run over Lightstreams test net Sirius
`https://gateway.sirius.lightstreams.io`

**Rinkeby**

Runs over Ethereum test net Rinkeby
`https://gateway.rinkeby.lightstreams.io`


## Help
In case you have questions regarding the usage of this repository
create a new [question issue](https://github.com/lightstreams-network/js-sdk-lightstreams/issues/new)
and Lighstreams team will reply as soon as possible.
