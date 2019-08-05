# Lightstreams JS SDK

This repository is a Javascript SDK to facilitate the usage of functionalities
implemented in the Lightstreams node (also known as the Lightstreams Gateway node, or simply Gateway), [http api](https://docs.lightstreams.network/api-docs).

## Requirements
- Node >= 10
- Lightstreams Smart Vault (Optional). [How to install](https://docs.lightstreams.network/getting-started/install/)

### How to use

**Install node module**

Install `lightstreams-js-sdk` as part of your project dependencies:
```bash
npm install git+ssh://git@github.com:lightstreams-network/lightstreams-js-sdk#master --save
```

**Sample usage**
```
const Gateway = require('lightstreams-js-sdk')
const gateway = Gateway('https://gateway.sirius.lightstreams.io')
```

Once `LightstreamsSDK` is initialized you interact with it as follow:
```
// Get user balance
const account = "0xa981f8ca77d069d79b609ca0069b052db79e7e30"
const { balance } = await gateway.wallet.balance(account)
```

**Available Methods**

Gateway SDK interface is made to match, one to one, every available [smart vault endpoints](https://docs.lightstreams.network/api-docs).

- [/user/signup](https://docs.lightstreams.network/api-docs/#operation/userSignup)  ->  `gateway.user.signUp(password)`
- [/user/signin](https://docs.lightstreams.network/api-docs/#operation/userSignin)  ->  `gateway.user.signIn(account, password)`

- [/wallet/balance](https://docs.lightstreams.network/api-docs/#operation/walletBalance)    ->  `gateway.wallet.balance(account)`
- [/wallet/transfer](https://docs.lightstreams.network/api-docs/#operation/walletTransfer)  ->  `gateway.wallet.transfer(from, password, to, amountWei)`

- [/storage/add](https://docs.lightstreams.network/api-docs/#tag/Storage)   ->  `gateway.storage.add(owner, password, file)`
- [/storage/fetch](https://docs.lightstreams.network/api-docs/#operation/storageFetch)  ->  `gateway.storage.fetch(meta, token, stream)`

- [/acl/grant](https://docs.lightstreams.network/api-docs/#operation/aclGrant)  ->  `gateway.acl.grant(acl, owner, password, to, permission)`
- /acl/revoke   ->  `gateway.acl.revoke(acl, owner, password, to)`
- [/acl/grant-public](https://docs.lightstreams.network/api-docs/#operation/aclGrantPublic) ->  `gateway.acl.grantPublic(acl, owner, password)`
- [/acl/revoke-public](https://docs.lightstreams.network/api-docs/#operation/aclRevoke)    ->  `gateway.acl.revokePublic(acl, owner, password)`

- [/shop/create](https://docs.lightstreams.network/api-docs/#operation/shopCreate)  ->  `gateway.shop.create(from, password)`
- [/shop/shell](https://docs.lightstreams.network/api-docs/#operation/shopSell) ->  `gateway.shop.sell(shop, from, password, acl, priceWei)`
- [/shop/buy](https://docs.lightstreams.network/api-docs/#operation/shopBuy)    ->  `gateway.shop.buy(shop, from, password, acl)`

- [/erc20/balance](https://docs.lightstreams.network/api-docs/#operation/erc20Balance)  ->  `gateway.erc20.balance(erc20_address, account)`
- [/erc20/transfer](https://docs.lightstreams.network/api-docs/#operation/erc20Transfer)    ->  `gateway.erc20.transfer(erc20_address, from, password, to, amount)`
- [/erc20/purchase](https://docs.lightstreams.network/api-docs/#operation/erc20Purchase)    -> `gateway.erc20.purchase(erc20_address, account, password, amount_wei)`

## Smart Vault

[See available gateway APIs endpoints](#available-gateway-apis)

**Sirius**

Lightstreams provides one public gateway endpoint running over Lightstreams test network, `Sirius`:
```
https://gateway.sirius.lightstreams.io
```

**Local**

You also can run your own local node of lightstreams smart vault. Follow the instructions [here](https://docs.lightstreams.network/getting-started/quick-start/#running-lightstreams-node)

## Development

### Install
```
npm i
```

### Recompile `lib` from `src`
```
npm run build
```

## Sample project
- [Gateway Proxy Server](https://github.com/lightstreams-network/lightstreams-js-sdk/tree/master/example/gateway-proxy)
- [Gateway Browser](https://github.com/lightstreams-network/lightstreams-js-sdk/tree/master/example/gateway-proxy) (Veryyy drafted)

## Bugs, Issues, Questions
If you find any bugs or simply have a question, please [write an issue](https://github.com/lightstreams-network/lightstreams-js-sdk/issues) and we'll try and help as best we can.

