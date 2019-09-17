require('dotenv').config({ path: `${__dirname}/.env` });

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

// A helper test for quick debugging of receipts during development.
contract('TxReceipt', (accounts) => {
  it('should fetch and print specified receipt', async () => {
    let balance = await web3.eth.getBalance("0xd119b8b038d3a67d34ca1d46e1898881626a082b");
    console.log(balance.toString());

    let receipt = await web3.eth.getTransactionReceipt("0x3746251167b4761d7e57c3418c2010ae377f2427e1eee9ca8608fe264aa3a214");
    console.log(receipt);
  });
});
