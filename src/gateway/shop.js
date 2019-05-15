/**
 * User: ggarrido
 * Date: 14/05/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */

const got = require('got');
const _ = require('lodash');

const { parseResponse, errorResponse } = require('../lib/response');
const { defaultOptions } = require('../lib/request');

const CREATE_SHOP_PATH = '/shop/create';
const SELL_PATH = '/shop/sell';
const BUY_PATH = '/shop/buy';

const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  ADMIN: 'admin'
};

module.exports = (gwDomain) => ({
  /**
   * Creates an online shop, smart contract, for selling/buying digital content
   * @param from Shop owner account address
   * @param password The password that unlocks the from account
   * @returns {Promise<{ shop }>} Shop contract address
   */
  create: async (from, password) => {

    const options = {
      ...defaultOptions,
      body: {
        from,
        password,
      },
    };

    const gwResponse = await got.post(`${gwDomain}${CREATE_SHOP_PATH}`, options);
    return parseResponse(gwResponse);
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
  sell: async (shop, from, password, acl, priceWei) => {

    const options = {
      ...defaultOptions,
      body: {
        shop,
        from,
        password,
        acl,
        price_wei: priceWei,
      },
    };

    const gwResponse = await got.post(`${gwDomain}${SELL_PATH}`, options);
    return parseResponse(gwResponse);
  },

  /**
   * Buys the ACL Read Permission to digital content from owner's online shop
   * @param shop shop contract address
   * @param from Shop owner account address
   * @param password The password that unlocks the from account
   * @param acl acl contract address of file intended to sell
   * @returns {Promise<{ success }>} true or false
   */
  buy: async (shop, from, password, acl) => {

    const options = {
      ...defaultOptions,
      body: {
        shop,
        from,
        password,
        acl
      },
    };

    const gwResponse = await got.post(`${gwDomain}${BUY_PATH}`, options);
    return parseResponse(gwResponse);
  }
});