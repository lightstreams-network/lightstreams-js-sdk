# Lightstreams JS SDK

This repository is a Javascript SDK to facilitate the usage of functionalities
implemented in the Lightstreams node (also known as the Lightstreams Gateway node, or simply Gateway), [http api](https://docs.lightstreams.network/api-docs).

## Requirements
- Node > 10
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

- [/user/signup](https://docs.lightstreams.network/api-docs/#operation/userSignup) &nbsp;-> `gateway.user.signUp(password)`
- [/user/signin](https://docs.lightstreams.network/api-docs/#operation/userSignin) &nbsp;-> `gateway.user.signIn(account, password)`

- [/wallet/balance](https://docs.lightstreams.network/api-docs/#operation/walletBalance) &nbsp;-> `gateway.wallet.balance(account)`
- [/wallet/transfer](https://docs.lightstreams.network/api-docs/#operation/walletTransfer) &nbsp;-> `gateway.wallet.transfer(from, password, to, amountWei)`

- [/storage/add](https://docs.lightstreams.network/api-docs/#tag/Storage) &nbsp;-> `gateway.storage.add(owner, password, file)`
- [/storage/fetch](https://docs.lightstreams.network/api-docs/#operation/storageFetch) &nbsp;-> `gateway.storage.fetch(meta, token, stream)`

- [/acl/grant](https://docs.lightstreams.network/api-docs/#operation/aclGrant) &nbsp;-> `gateway.acl.grant(acl, owner, password, to, permission)`
- /acl/revoke &nbsp;-> `gateway.acl.revoke(acl, owner, password, to)`
- /acl/grantPublic &nbsp;-> `gateway.acl.revoke(acl, owner, password)`
- /acl/revokePublic &nbsp;-> `gateway.acl.revoke(acl, owner, password)`

- [/shop/create](https://docs.lightstreams.network/api-docs/#operation/shopCreate) &nbsp;-> `gateway.shop.create(from, password)`
- [/shop/shell](https://docs.lightstreams.network/api-docs/#operation/shopSell) &nbsp;-> `gateway.shop.sell(shop, from, password, acl, priceWei)`
- [/shop/buy](https://docs.lightstreams.network/api-docs/#operation/shopBuy) &nbsp;-> `gateway.shop.buy(shop, from, password, acl)`

- [/erc20/balance](https://docs.lightstreams.network/api-docs/#operation/erc20Balance) &nbsp;-> `gateway.erc20.balance(erc20_address, account)`
- [/erc20/transfer](https://docs.lightstreams.network/api-docs/#operation/erc20Transfer) &nbsp;-> `gateway.erc20.transfer(erc20_address, from, password, to, amount)`
- [/erc20/purchase](https://docs.lightstreams.network/api-docs/#operation/erc20Purchase) &nbsp;-> `gateway.erc20.purchase(erc20_address, account, password, amount_wei)`


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

## Help
In case you have questions regarding the usage of this repository
create a new [question issue](https://github.com/lightstreams-network/lightstreams-js-sdk/issues/new)
and Lightstreams team will reply as soon as possible.
