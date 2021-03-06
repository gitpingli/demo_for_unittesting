'use strict'

module.exports = {
  getContractsByAddress: {
    address: { type: 'string', required: true },
    count: { type: 'integer', required: true },
    offset: { type: 'integer', required: true }
  },
  getSummaryReport: {
    address: { type: 'string', required: true },
    start: { type: 'integer', required: true },
    end: { type: 'integer', required: true }
  },
  getAllCDRStatus: {
    address: { type: 'string', required: true },
    count: { type: 'integer', required: true },
    offset: { type: 'integer', required: true }
  },
  generateInvoices: {
    address: { type: 'string', required: true },
    start: { type: 'integer', required: true },
    end: { type: 'integer', required: true }
  },
  generateInvoicesByContract: {
    address: { type: 'string', required: true },
    start: { type: 'integer', required: true },
    end: { type: 'integer', required: true }
  },
  getContractsAsPartyA: {
    address: { type: 'string', required: true },
    count: { type: 'integer', required: true },
    offset: { type: 'integer', required: true }
  },
  getContractsAsPartyB: {
    address: { type: 'string', required: true },
    count: { type: 'integer', required: true },
    offset: { type: 'integer', required: true }
  },
  getCreateContractBlock: {
    partyA: { type: 'string', required: true },
    partyB: { type: 'string', required: true },
    services: { type: 'string', required: true },
    startDate: { type: 'integer', required: true },
    endDate: { type: 'integer', required: true }
  },
  getSignContractBlock: {
    contractAddress: { type: 'string', required: true },
    address: { type: 'string', required: true }
  },
  getTerminateContractBlock: {
    contractAddress: { type: 'string', required: true },
    address: { type: 'string', required: true },
    request: { type: 'string', required: true }
  },
  getAddPreStopBlock: {
    contractAddress: { type: 'string', required: true },
    stopName: { type: 'string', required: true },
    address: { type: 'string', required: true }
  },
  getAddPreStopBlockBatch: {
    contractAddress: { type: 'string', required: true },
    stopName: { type: 'string', required: true },
    address: { type: 'string', required: true }
  },
  getRemovePreStopBlock: {
    contractAddress: { type: 'string', required: true },
    stopName: { type: 'string', required: true },
    address: { type: 'string', required: true }
  },
  getUpdatePreStopBlock: {
    contractAddress: { type: 'string', required: true },
    stopName: { type: 'string', required: true },
    address: { type: 'string', required: true },
    newName: { type: 'string', required: true }
  },
  getAddNextStopBlock: {
    contractAddress: { type: 'string', required: true },
    stopName: { type: 'string', required: true },
    address: { type: 'string', required: true }
  },
  getAddNextStopBlockBatch: {
    contractAddress: { type: 'string', required: true },
    stopName: { type: 'string', required: true },
    address: { type: 'string', required: true }
  },
  getRemoveNextStopBlock: {
    contractAddress: { type: 'string', required: true },
    stopName: { type: 'string', required: true },
    address: { type: 'string', required: true }
  },
  getUpdateNextStopBlock: {
    contractAddress: { type: 'string', required: true },
    stopName: { type: 'string', required: true },
    address: { type: 'string', required: true },
    newName: { type: 'string', required: true }
  },
  getPreStopNames: {
    address: { type: 'string', required: true }
  },
  getNextStopNames: {
    address: { type: 'string', required: true }
  },
  getProcessCDRBlock: {
    addr: { type: 'string', required: true },
    params: { type: 'string', required: true }
  },
  newAccounts: {
    num: { type: 'integer', required: false }
  },
  create: {
    seed: { type: 'string', required: true },
    index: { type: 'integer', required: false }
  },
  forPublicKey: {
    publicKey: { type: 'string', required: true }
  },
  publicKey: {
    address: { type: 'string', required: true }
  },
  accountInfo: {
    address: { type: 'string', required: true }
  },
  accountBlocksCount: {
    address: { type: 'string', required: true }
  },
  accountHistoryTopn: {
    address: { type: 'string', required: true },
    count: { type: 'integer', required: true },
    offset: { type: 'integer', required: true }
  },
  accountsBalance: {
    addresses: { type: 'string', required: true }
  },
  accountsPending: {
    addresses: { type: 'string', required: true },
    count: { type: 'integer', required: true }
  },
  blocksInfo: {
    hash: { type: 'string', required: true }
  },
  generateSendBlock: {
    from: { type: 'string', required: true },
    to: { type: 'string', required: true },
    tokenName: { type: 'string', required: true },
    amount: { type: 'string', required: true },
    sender: { type: 'string', required: false },
    receiver: { type: 'string', required: false },
    message: { type: 'string', required: false }
  },
  generateReceiveBlock: {
    type: { type: 'string', required: true },
    token: { type: 'string', required: true },
    address: { type: 'string', required: true },
    balance: { type: 'string', required: true },
    vote: { type: 'string', required: true },
    network: { type: 'string', required: true },
    storage: { type: 'string', required: true },
    oracle: { type: 'string', required: true },
    previous: { type: 'string', required: true },
    link: { type: 'string', required: true },
    message: { type: 'string', required: true },
    povHeight: { type: 'string', required: true },
    timestamp: { type: 'string', required: true },
    extra: { type: 'string', required: true },
    representative: { type: 'string', required: true },
    work: { type: 'string', required: true },
    signature: { type: 'string', required: true }
  },
  generateChangeBlock: {
    address: { type: 'string', required: true },
    representativeAddress: { type: 'string', required: true }
  },
  getRegisterAssetBlock: {
    owner: { type: 'string', required: true },
    assets: { type: 'string', required: true },
    startDate: { type: 'integer', required: true },
    endDate: { type: 'integer', required: true },
    status: { type: 'string', required: true }
  },
  getAllAssets: {
    count: { type: 'integer', required: true },
    offset: { type: 'integer', required: true }
  },
  getAssetsByOwner: {
    owner: { type: 'string', required: true },
    count: { type: 'integer', required: true },
    offset: { type: 'integer', required: true }
  },
  getAsset: {
    address: { type: 'string', required: true }
  },
  getContractAddressByPartyANextStop: {
    addresses: { type: 'string', required: true },
    stop: { type: 'string', required: true }
  },
  getContractAddressByPartyBPreStop: {
    addresses: { type: 'string', required: true },
    stop: { type: 'string', required: true }
  },
  generateMultiPartyInvoice: {
    firstAddr: { type: 'string', required: true },
    secondAddr: { type: 'string', required: true },
    start: { type: 'integer', required: true },
    end: { type: 'integer', required: true }
  },
  generateMultiPartySummaryReport: {
    firstAddr: { type: 'string', required: true },
    secondAddr: { type: 'string', required: true },
    start: { type: 'integer', required: true },
    end: { type: 'integer', required: true }
  },
  getMultiPartyCDRStatus: {
    firstAddr: { type: 'string', required: true },
    secondAddr: { type: 'string', required: true },
    count: { type: 'integer', required: true },
    offset: { type: 'integer', required: true }
  },
  getNodesList: {
    nodesCount: { type: 'integer', required: false },
    nodesOffset: { type: 'integer', required: false },
    peersCount: { type: 'integer', required: false },
    peersOffset: { type: 'integer', required: false }
  },
  getNode: {
    nodeId: { type: 'string', required: true }
  },
  getAdminHandoverBlock: {
    admin: { type: 'string', required: true },
    successor: { type: 'string', required: true },
    comment: { type: 'string', required: true }
  },
  getAdmin: {
  },
  getNodeUpdateBlock: {
    admin: { type: 'string', required: true },
    nodeId: { type: 'string', required: true },
    nodeUrl: { type: 'string', required: true },
    comment: { type: 'string', required: true }
  },
  getPtmKeyByAccount: {
    account: { type: 'string', required: true }
  },
  getPtmKeyByAccountAndBtype: {
    account: { type: 'string', required: true },
    btype: { type: 'string', required: true }
  },
  getPtmKeyUpdateBlock: {
    account: { type: 'string', required: true },
    btype: { type: 'string', required: true },
    pubkey: { type: 'string', required: true }
  },
  getPtmKeyDeleteBlock: {
    account: { type: 'string', required: true },
    btype: { type: 'string', required: true }
  },
  dodGetCreateOrderBlock: {
    buyer: { type: 'string', required: true },
    seller: { type: 'string', required: true },
    portServices: { type: 'string', required: true },
    ConnectionServices: { type: 'string', required: true }
  },
  dodGetUpdateOrderInfoBlock: {
    address: { type: 'string', required: true },
    externalId: { type: 'string', required: true },
    orderId: { type: 'string', required: true },
    services: { type: 'string', required: true }
  },
  dodGetResponseBlock: {
    address: { type: 'string', required: true },
    requestHash: { type: 'string', required: true },
    action: { type: 'string', required: true }
  },
  dodGetChangeOrderBlock: {
    orderId: { type: 'string', required: true },
    buyer: { type: 'string', required: true },
    seller: { type: 'string', required: true },
    portServices: { type: 'string', required: true },
    ConnectionServices: { type: 'string', required: true }
  },
  dodGetTerminateOrderBlock: {
    buyer: { type: 'string', required: true },
    externalId: { type: 'string', required: true }
  },
  dodGetPendingRequest: {
    address: { type: 'string', required: true }
  },
  dodGetOrderInfo: {
    requestHash: { type: 'string', required: true }
  },
  dodGetSummaryReport: {
    role: { type: 'string', required: true },
    address: { type: 'string', required: true },
    startTime: { type: 'integer', required: true },
    endTime: { type: 'integer', required: true }
  },
  dodGenerateInvoice: {
    address: { type: 'string', required: true },
    startTime: { type: 'integer', required: true },
    endTime: { type: 'integer', required: true }
  },
  dodGetCreateOrderRewardBlock: {
    requestHash: { type: 'string', required: true },
    action: { type: 'string', required: true }
  },
  dodGetUpdateOrderInfoRewardBlock: {
    requestHash: { type: 'string', required: true }
  },
  dodGetChangeOrderRewardBlock: {
    requestHash: { type: 'string', required: true },
    action: { type: 'string', required: true }
  },
  dodGetTerminateOrderRewardBlock: {
    requestHash: { type: 'string', required: true },
    action: { type: 'string', required: true }
  },
  dodGetOrderIdListByAddress: {
    buyer: { type: 'string', required: true }
  },
  dodGetOrderIdListByAddressAndSeller: {
    buyer: { type: 'string', required: true },
    seller: { type: 'string', required: true }
  },
  dodGetProductIdListByAddress: {
    buyer: { type: 'string', required: true }
  },
  dodGetProductIdListByAddressAndSeller: {
    buyer: { type: 'string', required: true },
    seller: { type: 'string', required: true }
  },
  dodGetOrderInfoBySellerAndOrderId: {
    seller: { type: 'string', required: true },
    orderId: { type: 'string', required: true }
  },
  dodGetConnectionInfoBySellerAndProductId: {
    seller: { type: 'string', required: true },
    productId: { type: 'string', required: true }
  },
  dodGetPendingResourceCheck: {
    seller: { type: 'string', required: true }
  },
  dodGetUpdateProductInfoBlock: {
    address: { type: 'string', required: true },
    orderId: { type: 'string', required: true },
    productInfo: { type: 'string', required: true }
  },
  dodGetOrderInfoByInternalId: {
    internalId: { type: 'string', required: true }
  },
  dodGenerateInvoiceByOrderId: {
    seller: { type: 'string', required: true },
    orderId: { type: 'string', required: true },
    startTime: { type: 'string', required: true },
    endTime: { type: 'string', required: true },
    inFlight: { type: 'string', required: true },
    split: { type: 'string', required: true }
  },
  dodGenerateInvoiceByProductId: {
    seller: { type: 'string', required: true },
    productId: { type: 'string', required: true },
    startTime: { type: 'string', required: true },
    endTime: { type: 'string', required: true },
    inFlight: { type: 'string', required: true },
    split: { type: 'string', required: true }
  }
}
