'use strict';

const Mock = require('mockjs');

function fakeList(count) {
  return Mock.mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|10': [
      {
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': count * 10,
        transactionId: '@integer(1000000,9999999)',
        info: '@string(50)',
        updatedAt: '@datetime',
        createdAt: '@datetime',
      },
    ],
    total: 50,
  });
}

function getFakeList(count = 10) {
  return fakeList(count);
}

module.exports = {
  getFakeList,
};
