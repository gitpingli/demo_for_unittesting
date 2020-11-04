'use strict'

module.exports = app => {
  const { router, controller } = app
  const { rpc } = controller.qlc
  router.post('/rpc/account/create', rpc.create)
  router.post('/rpc/account/newAccounts', rpc.newAccounts)
  router.get('/rpc/account/forPublicKey/:publicKey', rpc.forPublicKey)
  router.get('/rpc/account/publicKey/:address', rpc.publicKey)

  router.post('/rpc/ledger/accountsBalance', rpc.accountsBalance)
  router.post('/rpc/ledger/accountsPending', rpc.accountsPending)
  router.get('/rpc/ledger/blocksInfo/:hash', rpc.blocksInfo)
  router.post('/rpc/ledger/generateSendBlock', rpc.generateSendBlock)
  router.post('/rpc/ledger/generateReceiveBlock', rpc.generateReceiveBlock)
  router.post('/rpc/ledger/generateChangeBlock', rpc.generateChangeBlock)
  router.get('/rpc/ledger/accountInfo/:address', rpc.accountInfo)
  router.get('/rpc/ledger/accountBlocksCount/:address', rpc.accountBlocksCount)
  router.get('/rpc/ledger/accountHistoryTopn/:address/:count/:offset', rpc.accountHistoryTopn)

  router.get('/rpc/ptmkey/getPtmKeyByAccount/:account', rpc.getPtmKeyByAccount)
  router.get('/rpc/ptmkey/getPtmKeyByAccountAndBtype/:account/:btype', rpc.getPtmKeyByAccountAndBtype)
  router.post('/rpc/ptmkey/getPtmKeyUpdateBlock', rpc.getPtmKeyUpdateBlock)
  router.post('/rpc/ptmkey/getPtmKeyDeleteBlock', rpc.getPtmKeyDeleteBlock)

  router.post('/rpc/permission/getAdminHandoverBlock', rpc.getAdminHandoverBlock)
  router.post('/rpc/permission/getNodeUpdateBlock', rpc.getNodeUpdateBlock)
  router.get('/rpc/permission/getNodesList', rpc.getNodesList)
  router.get('/rpc/permission/getNodesList/:nodesCount/:nodesOffset/:peersCount/:peersOffset', rpc.getNodesList)
  router.get('/rpc/permission/getNode/:nodeId', rpc.getNode)
  router.get('/rpc/permission/getAdmin', rpc.getAdmin)

  router.post('/rpc/dod/settlement/getCreateOrderBlock', rpc.dodGetCreateOrderBlock)
  router.post('/rpc/dod/settlement/getUpdateOrderInfoBlock', rpc.dodGetUpdateOrderInfoBlock)
  router.post('/rpc/dod/settlement/getResponseBlock', rpc.dodGetResponseBlock)
  router.post('/rpc/dod/settlement/getChangeOrderBlock', rpc.dodGetChangeOrderBlock)
  router.post('/rpc/dod/settlement/getTerminateOrderBlock', rpc.dodGetTerminateOrderBlock)
  router.get('/rpc/dod/settlement/getPendingRequest/:address', rpc.dodGetPendingRequest)
  router.get('/rpc/dod/settlement/getOrderInfo/:requestHash', rpc.dodGetOrderInfo)
  router.get('/rpc/dod/settlement/getSummaryReport/:role/:address/:startTime/:endTime', rpc.dodGetSummaryReport)
  router.get('/rpc/dod/settlement/generateInvoice/:address/:startTime/:endTime', rpc.dodGenerateInvoice)
  router.get('/rpc/dod/settlement/getOrderIdListByAddress/:buyer', rpc.dodGetOrderIdListByAddress)
  router.get('/rpc/dod/settlement/getOrderIdListByAddressAndSeller/:buyer/:seller', rpc.dodGetOrderIdListByAddressAndSeller)
  router.get('/rpc/dod/settlement/getProductIdListByAddress/:buyer', rpc.dodGetProductIdListByAddress)
  router.get('/rpc/dod/settlement/getProductIdListByAddressAndSeller/:buyer/:seller', rpc.dodGetProductIdListByAddressAndSeller)
  router.get('/rpc/dod/settlement/getOrderInfoBySellerAndOrderId/:seller/:orderId', rpc.dodGetOrderInfoBySellerAndOrderId)
  router.get('/rpc/dod/settlement/getConnectionInfoBySellerAndProductId/:seller/:productId', rpc.dodGetConnectionInfoBySellerAndProductId)
  router.get('/rpc/dod/settlement/getPendingResourceCheck/:seller', rpc.dodGetPendingResourceCheck)
  router.post('/rpc/dod/settlement/getCreateOrderRewardBlock', rpc.dodGetCreateOrderRewardBlock)
  router.post('/rpc/dod/settlement/getUpdateOrderInfoRewardBlock', rpc.dodGetUpdateOrderInfoRewardBlock)
  router.post('/rpc/dod/settlement/getChangeOrderRewardBlock', rpc.dodGetChangeOrderRewardBlock)
  router.post('/rpc/dod/settlement/getTerminateOrderRewardBlock', rpc.dodGetTerminateOrderRewardBlock)
  router.post('/rpc/dod/settlement/getUpdateProductInfoBlock', rpc.dodGetUpdateProductInfoBlock)
  router.get('/rpc/dod/settlement/getOrderInfoByInternalId/:internalId', rpc.dodGetOrderInfoByInternalId)
  router.get('/rpc/dod/settlement/generateInvoiceByOrderId/:seller/:orderId/:startTime/:endTime/:inFlight/:split', rpc.dodGenerateInvoiceByOrderId)
  router.get('/rpc/dod/settlement/generateInvoiceByProductId/:seller/:productId/:startTime/:endTime/:inFlight/:split', rpc.dodGenerateInvoiceByProductId)

  router.post('/rpc/settlement/getContractAddressByPartyANextStop', rpc.getContractAddressByPartyANextStop)
  router.post('/rpc/settlement/getContractAddressByPartyBPreStop', rpc.getContractAddressByPartyBPreStop)
  router.post('/rpc/settlement/getCreateContractBlock', rpc.getCreateContractBlock)
  router.post('/rpc/settlement/getAddPreStopBlockBatch', rpc.getAddPreStopBlockBatch)
  router.post('/rpc/settlement/getAddNextStopBlockBatch', rpc.getAddNextStopBlockBatch)
  router.post('/rpc/settlement/getProcessCDRBlock', rpc.getProcessCDRBlock)
  router.post('/rpc/settlement/getRegisterAssetBlock', rpc.getRegisterAssetBlock)
  router.post('/rpc/settlement/getSignContractBlock', rpc.getSignContractBlock)
  router.post('/rpc/settlement/getTerminateContractBlock', rpc.getTerminateContractBlock)
  router.post('/rpc/settlement/getAddPreStopBlock', rpc.getAddPreStopBlock)
  router.post('/rpc/settlement/getRemovePreStopBlock', rpc.getRemovePreStopBlock)
  router.post('/rpc/settlement/getUpdatePreStopBlock', rpc.getUpdatePreStopBlock)
  router.post('/rpc/settlement/getAddNextStopBlock', rpc.getAddNextStopBlock)
  router.post('/rpc/settlement/getRemoveNextStopBlock', rpc.getRemoveNextStopBlock)
  router.post('/rpc/settlement/getUpdateNextStopBlock', rpc.getUpdateNextStopBlock)
  router.get('/rpc/settlement/getContractsByAddress/:address/:count/:offset', rpc.getContractsByAddress)
  router.get('/rpc/settlement/getSummaryReport/:address/:start/:end', rpc.getSummaryReport)
  router.get('/rpc/settlement/getAllCDRStatus/:address/:count/:offset', rpc.getAllCDRStatus)
  router.get('/rpc/settlement/generateInvoices/:address/:start/:end', rpc.generateInvoices)
  router.get('/rpc/settlement/generateInvoicesByContract/:address/:start/:end', rpc.generateInvoicesByContract)
  router.get('/rpc/settlement/getContractsAsPartyA/:address/:count/:offset', rpc.getContractsAsPartyA)
  router.get('/rpc/settlement/getContractsAsPartyB/:address/:count/:offset', rpc.getContractsAsPartyB)
  router.get('/rpc/settlement/getPreStopNames/:address', rpc.getPreStopNames)
  router.get('/rpc/settlement/getNextStopNames/:address', rpc.getNextStopNames)
  router.get('/rpc/settlement/getAllAssets/:count/:offset', rpc.getAllAssets)
  router.get('/rpc/settlement/getAssetsByOwner/:owner/:count/:offset', rpc.getAssetsByOwner)
  router.get('/rpc/settlement/getAsset/:address', rpc.getAsset)
  router.get('/rpc/settlement/generateMultiPartyInvoice/:firstAddr/:secondAddr/:start/:end', rpc.generateMultiPartyInvoice)
  router.get('/rpc/settlement/generateMultiPartySummaryReport/:firstAddr/:secondAddr/:start/:end', rpc.generateMultiPartySummaryReport)
  router.get('/rpc/settlement/getMultiPartyCDRStatus/:firstAddr/:secondAddr/:count/:offset', rpc.getMultiPartyCDRStatus)
}
