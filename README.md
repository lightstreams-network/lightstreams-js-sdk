# Lightstreams JS SDK

Lightstreams Javascript(JS) SDK is a project implemented to bring utilities to dapp developers. This project
includes a set of wrappers around libraries and protocol such as:

 - [Lightstreams Smart Vault Wrappers](/#lightstreams-smart-vault-wrappers): Decentralized data storage with privacy controls for sharing data within private groups and for selling content
 - [Lightstreams name service (LSN)](/#lightstreams-name-service): Secure & decentralised way to address resources both on and off the blockchain using simple, human-readable names in Lightstreams network.
 - Gas Station Network: Set of contracts implementing GSN pattern.
 - Bonding Curve: Set of contracts to allow you to issue new tokens using the popular [bonding curve](https://medium.com/coinmonks/token-bonding-curves-explained-7a9332198e0e)
 - [Local private key management](#local-private-key-management): Generate, encrypt and decrypt your private keys all within your favorite storage: memory, browser or disk.
 - [Lightstreams Web3 engine](#lightstreams-web3-engine): Extended version of web3 engine with useful addons such as private keys in a memory storage management, metamask integration and gsn proxy calls.
 - Web3 wrapper: Functional library to wrap [web3js](https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html) methods into simple high level calls.

## Requirements
- Node >= 10
- [Lightstreams Smart Vault](https://docs.lightstreams.network/products-1/smart-vault/getting-started/installation) (Optional): Just in cases where you want to use Lightstreams distributed storage.
- [tabookey-gasless](https://github.com/lightstreams-network/tabookey-gasless) (Optional): Compile and run your own GSN using our forked version of tabookey-gasless project.

### How to use

Add `lightstreams-js-sdk` project as a dependency of your project, using npm
```bash
npm install git+https://github.com/lightstreams-network/lightstreams-js-sdk.git#master --save
```

or using yarn
```bash
yarn add git+https://github.com/lightstreams-network/lightstreams-js-sdk.git#master --save
```

## Modules

### Lightstreams Smart Vault Wrappers

#### Gateway proxy

Gateway SDK interface is made to match, one to one, every available
[Lightstreams Smart Vault endpoints](https://docs-api.lightstreams.network/). For instance an
example of it is:


Upload a new file to decentralize storage
```js
const { Gateway as useGateway }  = require('lightstreams-js-sdk')
const gateway = useGateway('https://gateway.sirius.lightstreams.io')

const account = "0xa981f8ca77d069d79b609ca0069b052db79e7e30"
const file = fs.createReadStream(`/tmp/my_secret_file.txt`)
const { meta, acl } = await gateway.storage.add(account, "password", file)
```

or distribute some json object and distribute it publicly:
```js
const { meta, acl } = await gateway.storage.addRaw(account, "password", JSON.stringify({key: "value"}), 'json')
await gateway.acl.grantPublic(acl, account, "password")

// And fetch public content does not require token, otherwise it is mandatory
const myJson = await gateway.storage.fetch(meta, null, false)
```

#### Smart vault using local private keys

Smart vault is implemented to be used using remote private key management but in case you
need to use the power of this distributed storage with your local private keys, or even using your favorite
tools such as Metamask you can do it using `Leth` wrapper.

Here is an example of how upload a new file and grant read permissions using a local private keys:

```js
const { Leth, Web3, Gateway use useGateway } = require('lightstreams-js-sdk')

// Instanciate web3 engine using my local lightstreams network provider and remote keys
const web3 = Web3.createEngine('http://localhost:8545');
const gateway = useGateway('https://gateway.sirius.lightstreams.io');

// Create accounts to be used in the example
// `accountPublisher` will require some tokens to performe the actions
const accountPublisher = await web3.eth.personal.newAccount("password");
const accountReader = await web3.eth.personal.newAccount("password");

// Deploy an ACL contract
const txReceipt = Leth.acl.create(web3, { from: accountPublisher, owner: accountPublisher, isPublic: false });

const aclAddr = txReceipt.contractAddress;

// Publish new content using deployed acl
const file = fs.createReadStream(`/tmp/my_secret_file.txt`);
const { meta } = await gateway.storage.addWithAcl(account, aclAddr, file);

// Grant reader read access
await Leth.acl.grantRead = async (web3, { from: accountPublisher, contractAddr: aclAddr, account: accountReader })
```

### Lightstreams name service

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

### Local private key management

We have wrote our private key management based on [ethers-js](https://docs.ethers.io/ethers.js/html/api-wallet.html#wallet)


**How to create a new account**

```js
import { EthersWallet as EW } from 'lightstreams-js-sdk';
const decryptedWallet = await EW.Keystore.createRandomWallet();
const encryptedJson = await EW.Keystore.encryptWallet(decryptedWallet, password);
const address = encryptedJson.address;
```

Then we can create an account from the encrypted version of it as follow:
```js
const account = EW.account.newAccount(encryptedJson)
await account.unlock(password);
```

The following apis are available for the `account`
- `account.lock():void`: Lock wallet account
- `account.unlock(password):void`: Unlock wallet account
- `account.isLocked():boolean`: Return false is the account is unlock
- `account.sign(txParams):string`: Return a signed transaction. Wallet must be unlocked
- `account.signMsg({ data, chainId }, cb)`: Return a signed messaged. Wallet must be unlocked
- `account.export():object`: Returns encrypted privatekey in json format
- `account.seedPhrase():array`: Return account seed phrase. Wallet must be unlocked

### Lightstreams Web3 Engine

In this repository you can find a customize web3 provider which uses a local
keystorage to sign transactions. In addition other ethereum public API methods
such as `eth_lockAccount`, `eth_unlockAccount` and `eth_newAccount` are being
overwritten to use the key local storage.

**How to initialize a LS web3 provider**

```js
import { Web3 } from 'lightstreams-js-sdk';

// Using local private key storage
const web3 = Web3.newEngine('http://localhost:8545');

// Using remove private key storage
const web3 = Web3.newEngine('http://localhost:8545', { useRemoteKeystore: true });
```

Using this web3 provider you could create a new account and unlock it using
web3js [personal apis](https://web3js.readthedocs.io/en/v1.2.0/web3-eth-personal.html)

```js
web3.eth.personal.newAccount("password");
web3.eth.personal.unlockAccount("0x0Address", "password", 1000);
```

**How to import a private key**

```
import { EthersWallet as EW } from 'lightstreams-js-sdk';

const encryptedJson = await EW.Keystore.createRandomWallet(password);
web3.currentProvider.importAccount(encryptedJson);
```

**How to export a private key**
```
const encryptedJson = web3.currentProvider.exportAccount(address);
```


## Development

### Install
```
npm i
```

### Recompile `lib` from `src`
```
npm run build
```

### Deploy migrations

To deploy every migration over a network, such as `standalone`, you can run:
```
$> FORCE_MIGRATION='true' npm run deploy -- standalone
```

In case you want to run only force migration 01 and 03, you have to run:
```
$> FORCE_MIGRATION='01_03' npm run deploy -- standalone
```

### Run test

To run the full test suite over `standalone` network and every migrations
```
FORCE_MIGRATION='true' npm run test -- standalone
```

To run a single test file with every migration
```
FORCE_MIGRATION='true' npx truffle test ./test/{filename} --network standalone
```

To run a single test file along with no migrations:
```
FORCE_MIGRATION='false' npx truffle test ./test/{filename} --network standalone
```

## Sample project
- [Lighstreams Smart Vault Dashboard](https://github.com/lightstreams-network/example-dashboard)
- [e-commerce distributed shop](https://github.com/lightstreams-network/example-eshop)
- [Distributed browser storage](https://github.com/lightstreams-network/example-browser/commits/master)

## Bugs, Issues, Questions
If you find any bugs or simply have a question, please [write an issue](https://github.com/lightstreams-network/lightstreams-js-sdk/issues) and we'll try and help as best we can.

