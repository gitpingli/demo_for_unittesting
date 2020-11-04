'use strict';

const Mock = require('mockjs');
function fakeList(count) {
  return Mock.mock({
    data: [
      {
        'id': 1,
        serviceName: 'CRM',
        status: 'ACTIVE',
        updatedAt: '@datetime',
        createdAt: '@datetime',
      },{
        'id': 2,
        serviceName: 'Billing',
        status: 'DOWN',
        updatedAt: '@datetime',
        createdAt: '@datetime',
      },{
        'id': 3,
        serviceName: 'Payment',
        status: 'WARNING',
        updatedAt: '@datetime',
        createdAt: '@datetime',
      },{
        'id': 4,
        serviceName: 'Settlement',
        status: 'DOWN',
        updatedAt: '@datetime',
        createdAt: '@datetime',
      },
    ],
    total: 4,
  });
}

function getFakeList(count = 10) {
  return fakeList(count);
}

function getFakeOne() {
  return Mock.mock({
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    id: '@string(4)',
    logo: '@image',
    serviceName: '@name',
    url: '@url',
    accessUrl: '@url',
    version: '1.0.1',
    status: 'normal',
    statusHistory: 'normal',
    application:[
      {applicationName:'test',APIkey:'sdxcsfdww1223xx',status:'ACTIVE'},
      {applicationName:'test2',APIkey:'11sdxcsfdww1223xx',status:'DOWN'},
    ],
    notes: '@string(4)',
    serviceProvider: 'Platform Po',
    updatedAt: '@datetime',
    createdAt: '@datetime',
  });
}

module.exports = {
  getFakeList,
  getFakeOne,
};
