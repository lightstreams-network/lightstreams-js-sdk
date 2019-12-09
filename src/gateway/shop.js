/**
 * User: ggarrido
 * Date: 14/05/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const request = require('../http/request');

const CREATE_SHOP_PATH = '/shop/create';
const SELL_PATH = '/shop/sell';
const BUY_PATH = '/shop/buy';

module.exports = (gwDomain) => ({
  /**
   * Creates an online shop, smart contract, for selling/buying digital content
   * @param from Shop owner account address
   * @param password The password that unlocks the from account
   * @returns {Promise<{ shop }>} Shop contract address
   */
  create: (from, password) => {
    return request.post(`${gwDomain}${CREATE_SHOP_PATH}`, {
      from,
      password,
    });
  },

  /**
   * Puts an ACL permission to digital content for sale in owner's online shop
   * @param shop shop contract address
   * @param from Shop owner account address
   * @param password The password that unlocks the from account
   * @param acl acl contract address of file intended to sell
   * @param priceWei price in wei buyers must pay to get read access to the file
   * @returns {Promise<{ success }>} true or false
   */
  sell: (shop, from, password, acl, priceWei) => {
    return request.post(`${gwDomain}${SELL_PATH}`, {
      shop,
      from,
      password,
      acl,
      price_wei: priceWei,
    });
  },

  /**
   * Buys the ACL Read Permission to digital content from owner's online shop
   * @param shop shop contract address
   * @param from Shop owner account address
   * @param password The password that unlocks the from account
   * @param acl acl contract address of file intended to sell
   * @returns {Promise<{ success }>} true or false
   */
  buy: (shop, from, password, acl) => {
    return request.post(`${gwDomain}${BUY_PATH}`, {
      shop,
      from,
      password,
      acl
    });
  }
});
