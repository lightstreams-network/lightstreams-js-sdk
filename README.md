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

## Modules

### 1. Wallets (ethers-js)

Learn more about [ethers-js](https://docs.ethers.io/ethers.js/html/api-wallet.html#wallet)

**How to create a random new wallet**

```js
import { EthersWallet as EW } from 'lightstreams-js-sdk';

const encryptedJson = await EW.Keystore.createRandomWallet(seedPhrase, password);
```

**How to create a wallet from seed phrase**

```js
import { EthersWallet as EW } from 'lightstreams-js-sdk';

const encryptedJson = await EW.Keystore.createWallet(seedPhrase, password);
```

**How to generate a random seed phrase**

```js
import { EthersWallet as EW } from 'lightstreams-js-sdk';

const randomSeedPhrase = EW.Keystore.generateRandomSeedPhrase();
```

#### 1.1 Account

**How to create a new account**

```js
import { EthersWallet as EW } from 'lightstreams-js-sdk';
const encryptedJson = await EW.Keystore.createRandomWallet(seedPhrase, password);
const account = EW.Account.createAccount(encryptedJson)
```

**Public account object API**

- `lock():void`: Lock wallet account
- `unlock(password):void`: Unlock wallet account
- `isLocked():boolean`: Return false is the account is unlock
- `sign(txParams):string`: Return a signed transaction. Wallet must be unlocked
- `export():object`: Returns encrypted privatekey in json format
- `seedPhrase():array`: Return account seed phrase. Wallet must be unlocked

### 2. Web3 provider

In this repository you can find a customize web3 provider which uses a local
keystorage to sign transactions. In addition other ethereum public API methods
such as `eth_lockAccount`, `eth_unlockAccount` and `eth_newAccount` are being
overwritten to use the key local storage.

**How to initialize a LS web3 provider**

```js
import { Web3, Web3Provider } from 'lightstreams-js-sdk';

const provider = Web3Provider({ rpcUrl: window.process.env.WEB3_PROVIDER});
Web3.initialize(provider).then(web3 => {
  window.web3 = this.state.web3;
});
```

Using this web3 provider you could create a new account and unlock it as you would regularly do
web3 engine api methods, such as:
```js

web3.eth.personal.newAccount("password");
web3.eth.personal.unlockAccount("0x0Address", "password", 1000);
```

**How to import a wallet**

```
import { EthersWallet as EW } from 'lightstreams-js-sdk';

const encryptedJson = await EW.Keystore.createRandomWallet(password);
web3.currentProvider.importAccount(encryptedJson);
```


### 3. ENS

Learn more about it in [official docs](https://docs.ens.domains/).

**How to register new tld**
```js
import { ENS } from 'lightstreams-js-sdk';

const account = "0x0Address"; // Owner account
const tld = "lsn"
const { ensAddress, resolverAddress } = await ENS.SDK.deployNewRegistry(web3, { from: account });
await ENS.SDK.registerNode(web3, { ensAddress, from: account, node: tld});
```

**How to use ENS official sdk**
Read docs [here](https://docs.ens.domains/dapp-developer-guide/working-with-ens)

```js

const domain = 'fanbase.lsn';
const ens = ENS.SDK.initializeManager(web3.currentProvider, ensAddress);
console.log(`Registering ${domain}...`);
await ens.setSubnodeOwner(domain, account, { from: account });
console.log(`Setting resolver ...`);
await ens.setResolver(domain, resolverAddress, { from: account });
console.log(`Setting address ...`);
await ens.resolver(domain).setAddr(account, { from: account });
let address = await ens.resolver(domain).addr();
console.log(`${domain} is pointing to ${address}`);
```


### 4. Smart vault

#### 4.1 Gateway proxy

**Sample usage**
```
const { Gateway as useGateway }  = require('lightstreams-js-sdk')
const gateway = useGateway('https://gateway.sirius.lightstreams.io')
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

#### Smart Vault

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

