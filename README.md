# Lightstreams JS SDK

Lightstreams Javascript(JS) SDK is a project implemented to bring utilities to dapp developers. This project
includes a set of wrappers around libraries and protocol such as:

 - [Lightstreams Smart Vault Wrappers](#lightstreams-smart-vault-wrappers): Decentralized data storage with privacy controls for sharing data within private groups and for selling content
 - [Lightstreams name service (LSN)](#lightstreams-name-service): Secure & decentralised way to address resources both on and off the blockchain using simple, human-readable names in Lightstreams network.
 - [Gas Station Network](#gas-station-network): Set of contracts to implement your our gasless contracts.
 - Bonding Curve: Set of contracts to issue new ERC20 tokens using the [bonding curve](https://medium.com/coinmonks/token-bonding-curves-explained-7a9332198e0e).
 - [Local private key management](#local-private-key-management): Generate, encrypt and decrypt your private keys all within your favorite storage: memory, browser or disk.
 - [Lightstreams Web3 engine](#lightstreams-web3-engine): Extended version of web3 engine with useful addons such as private keys in a memory storage management, metamask integration and gsn proxy calls.
 - [Web3 wrapper](#web3-wrapper): Functional library to wrap [web3js](https://web3js.readthedocs.io/en/v1.2.0/web3-utils.html) methods into simple high level calls.

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
const web3 = Web3.newEngine('http://localhost:8545');
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

### Web3 Wrapper

Lightstreams has implemented a functional wrapper class onto [web3js](https://web3js.readthedocs.io/en/1.0/web3-utils.html)
library to encapsulate some of the most common functionalities of web3 into simple high level api.

Firtly, we instantiate a new web3 engine (although this wrapper can be used with other versions of web3)
```js
const web3 = Web3.newEngine('https://localhost:8545');
```

We could deploy a new contract as follow:
```js
const txReceipt = await Web3.deployContract(web3, {
    from: fromAcc,
    abi: contract.abi,
    bytecode: contract.bytecode,
    params: [param1, param2]
});
```

then, send a transaction to it:
```js
const txReceipt = await Web3.contractSendTx(web3, {
  to: contractAddress,
  abi: contract.abi,
  from: fromAcc,,
  method: 'methodName',
  params: [Web3.utils.toWei('1')...]
});
```

or do a read-only call to the contract:
```js
const outputValue = await Web3.contractCall(web3, {
    to: contractAddress,
    abi: contract.abi,
    method: 'methodName|public attribute',
    params: [...],
  });
```


### Gas Station Network

**Run your own gas station**

First you need to run your own gas station along with a relayer account who is going to stake some
tokens to fund the transactions in behalf the users of your apps, then those tokens will be paid back
from the staked amount staked on the contract itself. If you want to know [read this article](https://medium.com/lightstreams/no-gas-needed-to-interact-with-lightstreams-dapps-41aea98d1089?source=collection_home---4------3-----------------------)

Lightstreams team has forked [tabookey-gasless](https://github.com/lightstreams-network/tabookey-gasless) and
modify it to make it work on Lightstreams network. Please, follow [README.md](https://github.com/lightstreams-network/tabookey-gasless/blob/master/README.md)
to compile and run your local instance of the gas station.

Once you got your local GSN running you can start writing your gasless contract, next you can see few samples of it:
- [GSNProfile](https://github.com/lightstreams-network/lightstreams-js-sdk/blob/master/contracts/GSNProfile.sol): Smart contract to handle user profile data using smart vault distributed storage
- [GSNAcl](https://github.com/lightstreams-network/lightstreams-js-sdk/blob/master/contracts/GSNAcl.sol): Smart contract implementing access control list of files in smart vault

Once the contract is written you will need to deploy it and stake some tokens to fund users transactions:
```js
const { Web3, GSN } = require('lighstreams-js-sdk');

// Load compiled version of our GSNAcl.sol contract
const contract = require('@contract/build/GSNAcl.json');

// Initiliaze a new web3 engine enabling GSN by default
const web3 = Web3.newEngine('https://localhost:8545', { useGSN: true });

// Init env process variable to point to our gas station server
process.env.RELAY_URL="http://localhost:8090"

// Account used to deploy and fund the contract
const account = "0xa981f8ca77d069d79b609ca0069b052db79e7e30"

// Deploy GSNContract using Web3 wrapper
const txNewContractReceipt = await Web3.deployContract(web3, {
    from: account,
    abi: contract.abi,
    bytecode: contract.bytecode,
    params: [account, false]
});

// Relayer wallet address
const relayHubAddr = '0x2cfb0a0388f429318E0D12b12980c13ccad15189'

// Stake tokens into the contract
await GSN.fundRecipient(web3, {
    from: account,
    recipient: txNewContractReceipt.contractAddress,
    relayHub: relayerHubAddr,
    amountInPht: 100 // Amount of tokens to stake in the contract to fund user txs
  });
```

Now we deployed and funded the contract we can test out how to a user with balance 0 is capable to do a call
to that contract

```js
const newAccount = await web3.eth.personal.newAccount("password");

const txReceipt = await Web3.contractSendTx(web3ls, {
  to: aclContractAddress,
  abi: contract.abi,
  from: newAccount,
  method: 'addOwner',
  useGSN: true, // Force the usage of the gasless tx
  params: [newAccount]
});
```

You can see more sample code at this [test suite file](https://github.com/lightstreams-network/lightstreams-js-sdk/blob/master/test/05_gsn_profile_factory.js)

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

#### Prerequisites

1. Install and run the GSN. See: https://github.com/lightstreams-network/tabookey-gasless

2. Copy and set the environment variables:
```
$> cp .env.sample .env
```

Ensure the RELAY_HUB variable has been set with the address of relayer admin account. This is copied from {TABOOKEY_PROJECT}/hubaddr.txt

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

## How to release
1. Change the version in `package.json`
1. Commit and create a new Git tag

## Sample project
- [Lighstreams Smart Vault Dashboard](https://github.com/lightstreams-network/example-dashboard)
- [e-commerce distributed shop](https://github.com/lightstreams-network/example-eshop)
- [Distributed browser storage](https://github.com/lightstreams-network/example-browser/commits/master)
- [Fanbase](https://fanbase.live) (Coming very soon :) )

## Bugs, Issues, Questions
If you find any bugs or simply have a question, please [write an issue](https://github.com/lightstreams-network/lightstreams-js-sdk/issues) and we'll try and help as best we can.

