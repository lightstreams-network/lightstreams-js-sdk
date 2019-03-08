# Lightstreams JS SDK

This repository is a Javascript SDK to facilitate the usage of functionalities
implemented in the Lightstreams node (also known as the Lightstreams Gateway node, or simply Gateway), [http api](https://docs.lightstreams.network/api-docs).

## Requirements
- Node > 10
- Leth (Optional). [How to install](https://docs.lightstreams.network/getting-started/install/)

## Instructions

### SDK library usage

**Install node module**

Install `lightstreams-js-sdk` as part of your project dependencies:
```bash
npm install git+ssh://git@github.com:lightstreams-network/lightstreams-js-sdk#master --save
```

**Using Gateway SDK**

Initialize a gateway sdk object to interact with lightstreams gateway.

```
const lsClient = require('lightstreams-js-sdk')
const gateway = lsClient('https://gateway.sirius.lightstreams.io')
```
where `'https://gateway.sirius.lightstreams.io'` is the endpoint we are going to use to interact
with lightstreams node. [See available gateway APIs below](#available-gateway-apis)

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

## Available Gateway APIs

Lightstreams team provides provides two public gateway api for its free usage.

Additionally to those endpoints you can run your own local lightstreams node,
follow the instructions [here](https://docs.lightstreams.network/getting-started/quick-start/#running-lightstreams-node)

**Sirius**

Run over Lightstreams test net Sirius
`https://gateway.sirius.lightstreams.io`

**Rinkeby**

Runs over Ethereum test net Rinkeby
`https://gateway.rinkeby.lightstreams.io`

## Sample project
- [Gateway Proxy Server](https://github.com/lightstreams-network/lightstreams-js-sdk/tree/master/example/gateway-proxy)


## Help
In case you have questions regarding the usage of this repository
create a new [question issue](https://github.com/lightstreams-network/lightstreams-js-sdk/issues/new)
and Lighstreams team will reply as soon as possible.
