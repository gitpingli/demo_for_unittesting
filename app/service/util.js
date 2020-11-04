/* eslint-disable no-bitwise */
'use strict'

const blake = require('blakejs')
const nacl = require('../../scripts/js/nacl')

const uint4ToUint81 = function (uintValue) {
  const length = uintValue.length / 2
  const uint8 = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    uint8[i] = uintValue[i * 2] * 16 + uintValue[i * 2 + 1]
  }

  return uint8
}

const uint4ToUint8 = function (uintValue) {
  const length = uintValue.length / 2
  const uint8 = new Uint8Array(length)
  for (let i = 0; i < length; i++) {
    uint8[i] = uintValue[i * 2] * 16 + uintValue[i * 2 + 1]
  }

  return uint8
}
const hexToUint8 = function (hexString) {
  if (hexString.length % 2 > 0) {
    hexString = '0' + hexString
  }
  const byteArray = []
  for (let i = 0; i < hexString.length; i += 2) {
    byteArray.push(parseInt(hexString.slice(i, i + 2), 16))
  }
  return Uint8Array.from(byteArray)
}
const uint8ToHex = function (uintValue) {
  let hex = ''
  let aux
  for (let i = 0; i < uintValue.length; i++) {
    aux = uintValue[i].toString(16)
    if (aux.length === 1) {
      aux = '0' + aux
    }
    hex += aux
    aux = ''
  }

  return hex
}
const decToHex = function (decValue, bytes = null) {
  const dec = decValue.toString().split('')
  const sum = []
  let hex = ''
  const hexArray = []
  let i
  let s
  while (dec.length) {
    s = 1 * dec.shift()
    for (i = 0; s || i < sum.length; i++) {
      s += (sum[i] || 0) * 10
      sum[i] = s % 16
      s = (s - sum[i]) / 16
    }
  }
  while (sum.length) {
    hexArray.push(sum.pop().toString(16))
  }

  hex = hexArray.join('')

  if (hex.length % 2 !== 0) {
    hex = '0' + hex
  }
  if (bytes > hex.length / 2) {
    const diff = bytes - hex.length / 2
    for (let j = 0; j < diff; j++) {
      hex = '00' + hex
    }
  }

  return hex
}
const generateAccountSecretKeyBytes = function (seedBytes, accountIndex) {
  const accountBytes = hexToUint8(decToHex(accountIndex, 4))
  const context = blake.blake2bInit(32)
  blake.blake2bUpdate(context, seedBytes)
  blake.blake2bUpdate(context, accountBytes)
  const newKey = blake.blake2bFinal(context)

  return newKey
}
const generateAccountKeyPair = function (accountSecretKeyBytes) {
  return nacl.sign.keyPair.fromSecretKey(accountSecretKeyBytes)
}
function hexToUint4 (hexValue) {
  const uint4 = new Uint8Array(hexValue.length)
  for (let i = 0; i < hexValue.length; i++) {
    uint4[i] = parseInt(hexValue.substr(i, 1), 16)
  }

  return uint4
}
function uint5ToString (uint5) {
  const letterList = '13456789abcdefghijkmnopqrstuwxyz'.split('')
  let string = ''
  for (let i = 0; i < uint5.length; i++) {
    string += letterList[uint5[i]]
  }

  return string
}

function uint4ToUint5 (uintValue) {
  const length = (uintValue.length / 5) * 4
  const uint5 = new Uint8Array(length)
  for (let i = 1; i <= length; i++) {
    const n = i - 1
    const m = i % 4
    const z = n + (i - m) / 4
    const right = uintValue[z] << m
    let left
    if ((length - i) % 4 === 0) {
      left = uintValue[z - 1] << 4
    } else {
      left = uintValue[z + 1] >> (4 - m)
    }
    uint5[n] = (left + right) % 32
  }
  return uint5
}

function uint8ToUint4 (uintValue) {
  const uint4 = new Uint8Array(uintValue.length * 2)
  for (let i = 0; i < uintValue.length; i++) {
    uint4[i * 2] = (uintValue[i] / 16) | 0
    uint4[i * 2 + 1] = uintValue[i] % 16
  }

  return uint4
}

const getPublicAccountID = function (accountPublicKeyBytes) {
  const accountHex = uint8ToHex(accountPublicKeyBytes)
  const keyBytes = uint4ToUint8(hexToUint4(accountHex))
  const checksum = uint5ToString(uint4ToUint5(uint8ToUint4(blake.blake2b(keyBytes, null, 5).reverse())))
  const account = uint5ToString(uint4ToUint5(hexToUint4(`0${accountHex}`)))

  return `qlc_${account}${checksum}`
}

module.exports = {
  uint4ToUint8,
  uint4ToUint81,
  hexToUint8,
  uint8ToHex,
  decToHex,
  generateAccountSecretKeyBytes,
  generateAccountKeyPair,
  getPublicAccountID
}
