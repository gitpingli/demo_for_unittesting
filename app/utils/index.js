'use strict'

async function delay (delayInms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(2)
    }, delayInms)
  })
}

module.exports = {
  delay
}
