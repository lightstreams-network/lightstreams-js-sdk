/**
 * User: ggarrido
 * Date: 4/02/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const debug = require('debug')('lightstreams:gateway');

const { GATEWAY_DOMAIN } = require('@src/config/urls');

const GET_WALLET_BALANCE_URL = `${GATEWAY_DOMAIN}/wallet/balance`;
const REQUEST_TRANSFER_URL = `${GATEWAY_DOMAIN}/wallet/transfer`;

module.exports.getWalletBalance = (ethAddress) => {
  const options = {
    json: true,
    query: {
      account: ethAddress
    },
  };

  debug(`GET: ${GET_WALLET_BALANCE_URL}\t${JSON.stringify(options)}`);
  return got.get(GET_WALLET_BALANCE_URL, options)
    .then(response => {
      const { balance } = response.body;
      return { balance };
    }).catch(err => {
      handleGatewayError(err);
    });
};

module.exports.requestFaucetTransfer = async (ethAddress, weiAmount) => {
  const transfers = await Faucet.findByToAddress(ethAddress);
  const now = DateTime.utc();
  const waitingTimeSlotInSec = 30; // 30s window

  const validTransfers = _.filter(transfers, (transfer) => {
    if (transfer.succeeded === true) return true;
    if (now.toMillis() - transfer.created_at.getTime() < (waitingTimeSlotInSec * 1000)) return true;
    return false;
  });

  if (validTransfers.length > 0) {
    // throw new Error('Faucet transfer is not authorized');
  }

  const transfer = await Faucet.create({
    to_address: ethAddress,
    amount: weiAmount,
    succeeded: null,
    created_at: now.toSQL(),
    modified_at: now.toSQL(),
  });

  const options = {
    json: true,
    body: {
      from: authConfig.faucet.address,
      password: authConfig.faucet.pwd,
      to: ethAddress,
      amount_wei: weiAmount.toString()
    }
  };

  debug(`POST: ${REQUEST_TRANSFER_URL}\t${JSON.stringify(options)}`);
  return got.post(REQUEST_TRANSFER_URL, options)
    .then(async (gwResponse) => {
      const { balance } = gwResponse.body;
      await transfer.update({
        succeeded: true
      });
      return {
        balance
      }
    })
    .catch((err) => {
      handleGatewayError(err);
    });
};