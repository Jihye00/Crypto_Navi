const Caver = require('caver-js');
const caver = new Caver('https://kaikas.cypress.klaytn.net:8651');
const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new Web3.providers.HttpProvider());//'http://localhost:8551'

