"use strict";

/**
 * User: ggarrido
 * Date: 14/05/19 11:04
 * Copyright 2019 (c) Lightstreams, Palma
 */
var request = require('../http/request');

var CREATE_SHOP_PATH = '/shop/create';
var SELL_PATH = '/shop/sell';
var BUY_PATH = '/shop/buy';

module.exports = function (gwDomain) {
  return {
    /**
     * Creates an online shop, smart contract, for selling/buying digital content
     * @param from Shop owner account address
     * @param password The password that unlocks the from account
     * @returns {Promise<{ shop }>} Shop contract address
     */
    create: function create(from, password) {
      return request.post("".concat(gwDomain).concat(CREATE_SHOP_PATH), {
        from: from,
        password: password
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
    sell: function sell(shop, from, password, acl, priceWei) {
      return request.post("".concat(gwDomain).concat(SELL_PATH), {
        shop: shop,
        from: from,
        password: password,
        acl: acl,
        price_wei: priceWei
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
    buy: function buy(shop, from, password, acl) {
      return request.post("".concat(gwDomain).concat(BUY_PATH), {
        shop: shop,
        from: from,
        password: password,
        acl: acl
      });
    }
  };
};