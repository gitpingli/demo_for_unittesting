'use strict'

const Controller = require('egg').Controller
const util = require('../../service/util')
const nacl = require('../../../scripts/js/nacl')

/**
 *
 * @Controller Rpc
 */
class RpcController extends Controller {
  async getSeed (address) {
    const { ctx } = this
    let seed = null

    const user = await ctx.service.ums.agent.getLoggedInUser()
    const companyId = user.companyId || null

    if (companyId) {
      const wallets = await ctx.service.ums.wallet.list(companyId)

      if (wallets.length > 0) {
        const wallet = wallets.find(wallet => wallet.address.trim() === address)

        if (wallet) {
          seed = wallet.seed
        }
      }

      if (!seed) {
        seed = wallets[0].seed
      }
    }

    return seed
  }

  async prvKey (address) {
    const { ctx } = this
    let prvKey = null
    const user = await ctx.service.ums.agent.getLoggedInUser()
    const companyId = user.companyId || null
    if (companyId) {
      const wallets = await ctx.service.ums.wallet.list(companyId)
      if (wallets.length > 0) {
        const wallet = wallets.find(wallet => wallet.address.trim() === address)

        if (wallet) {
          prvKey = wallet.prvKey
        }
      }

      if (!prvKey) {
        prvKey = wallets[0].prvKey
      }
    }

    return prvKey
  }

  async updateAndProcessBlock (block, address, ignorePov = true, ignoreWork = true) {
    const { ctx } = this

    if (!ignorePov) {
      const povFittest = await ctx.service.qlc.pov.getFittestHeader(0)

      if (povFittest.error || !povFittest.result) {
        ctx.body = { error: povFittest.error }
        return ctx.body
      }

      block.povHeight = povFittest.result.basHdr.height
    }

    const blockHash = await ctx.service.qlc.ledger.blockHash(block)

    if (blockHash.error || !blockHash.result) {
      ctx.body = { error: blockHash.error }
      return ctx.body
    }

    const prvKey = await this.prvKey(address)
    if (prvKey !== 'test' && prvKey !== '') {
      const half = Math.ceil(prvKey.length / 2)
      const prvKeyHalf = String(prvKey).slice(0, half)
      const prvKeyBytes = util.hexToUint8(prvKeyHalf)

      const signed = nacl.sign.detached(
        util.hexToUint8(blockHash.result),
        prvKeyBytes
      )

      const signature = util.uint8ToHex(signed)

      block.signature = signature
    } else {
      const seed = await this.getSeed(address)

      let checkAddress = ''
      let accountKeyPair = ''

      for (let i = 0; i < 10; i++) {
        const accountBytes = util.generateAccountSecretKeyBytes(
          util.hexToUint8(
            seed
          ),
          i
        )
        accountKeyPair = util.generateAccountKeyPair(accountBytes)
        checkAddress = util.getPublicAccountID(accountKeyPair.publicKey)
        if (checkAddress === address) {
          break
        }
      }

      block.signature = util.uint8ToHex(
        nacl.sign.detached(
          util.hexToUint8(blockHash.result),
          accountKeyPair.secretKey
        )
      )
    }

    if (!ignoreWork) {
      let generateWorkFor = block.previous

      if (
        block.previous ===
        '0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        const publicKey = await ctx.service.qlc.account.publicKey(
          block.address
        )

        if (publicKey.error || !publicKey.result) {
          ctx.body = { error: publicKey.error }
          return ctx.body
        }

        generateWorkFor = publicKey.result
      }

      const pow = await ctx.service.qlc.rpc.getPow(generateWorkFor)

      if (pow.error || !pow.result) {
        ctx.body = { error: pow.error }
        return ctx.body
      }

      block.work = pow.result
    }

    const hash = await ctx.service.qlc.ledger.process(block)

    if (hash.error || !hash.result) {
      ctx.body = { error: hash.error }
      return ctx.body
    }
    block.hash = hash.result
    return block
  }

  /**
   * @Summary Submit a request
   * @Router POST /qlc/services
   * @Request body createQlcRequest *body
   * @Response 200 createQlcResponse OK
   * @Response 500 error Unknown internal server error
   */
  async process () {
    const { ctx } = this
    const { body } = ctx.request
    ctx.body = await ctx.service.qlc.rpc.curl(body.method, body.params)
  }

  /**
   * @Summary Get contracts by address
   * @Router GET /rpc/settlement/getContractsByAddress
   * @Response 200 getContractsByAddress OK
   * @Response 500 error Unknown internal server error
   */
  async getContractsByAddress () {
    const { ctx } = this

    try {
      const { address, count, offset } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.getContractsByAddress({
        address,
        count: parseInt(count),
        offset: parseInt(offset)
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get contract summary report
   * @Router GET /rpc/settlement/getSummaryReport
   * @Response 200 getSummaryReport OK
   * @Response 500 error Unknown internal server error
   */
  async getSummaryReport () {
    const { ctx } = this

    try {
      const { address, start, end } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.getSummaryReport({
        address,
        start: parseInt(start),
        end: parseInt(end)
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get contracts by address
   * @Router GET /rpc/settlement/getAllCDRStatus
   * @Response 200 getAllCDRStatus OK
   * @Response 500 error Unknown internal server error
   */
  async getAllCDRStatus () {
    const { ctx } = this

    try {
      const { address, count, offset } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.getAllCDRStatus({
        address,
        count: parseInt(count),
        offset: parseInt(offset)
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate user's invoice by start and end time
   * @Router GET /rpc/settlement/generateInvoices
   * @Response 200 generateInvoices OK
   * @Response 500 error Unknown internal server error
   */
  async generateInvoices () {
    const { ctx } = this

    try {
      const { address, start, end } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.generateInvoices({
        address,
        start: parseInt(start),
        end: parseInt(end)
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate invoice by settlement contract address start and end time
   * @Router GET /rpc/settlement/generateInvoicesByContract
   * @Response 200 generateInvoicesByContract OK
   * @Response 500 error Unknown internal server error
   */
  async generateInvoicesByContract () {
    const { ctx } = this

    try {
      const { address, start, end } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.generateInvoicesByContract(
        {
          address,
          start: parseInt(start),
          end: parseInt(end)
        }
      )
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Query all settlement contracts as Party A info by address
   * @Router GET /rpc/settlement/getContractsAsPartyA
   * @Response 200 getContractsAsPartyA OK
   * @Response 500 error Unknown internal server error
   */
  async getContractsAsPartyA () {
    const { ctx } = this

    try {
      const { address, count, offset } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.getContractsAsPartyA({
        address,
        count: parseInt(count),
        offset: parseInt(offset)
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Query all settlement contracts as Party B info by address
   * @Router GET /rpc/settlement/getContractsAsPartyB
   * @Response 200 getContractsAsPartyB OK
   * @Response 500 error Unknown internal server error
   */
  async getContractsAsPartyB () {
    const { ctx } = this

    try {
      const { address, count, offset } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.getContractsAsPartyB({
        address,
        count: parseInt(count),
        offset: parseInt(offset)
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate create settlement contract
   * @Router POST /rpc/settlement/getCreateContractBlock
   * @Request body getCreateContractBlock *body
   * @Response 200 getCreateContractBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getCreateContractBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      for (const service of body.services) {
        service.mcc = parseInt(service.mcc)
        service.mnc = parseInt(service.mnc)
        service.totalAmount = parseInt(service.totalAmount)
        service.UnitPrice = parseFloat(service.UnitPrice)
      }

      body.startDate = parseInt(body.startDate)
      body.endDate = parseInt(body.endDate)

      const currentTimestamp = Math.round(+new Date() / 1000)

      if (body.startDate < currentTimestamp) {
        body.startDate = currentTimestamp + 60
      }

      const block = await ctx.service.qlc.settlement.getCreateContractBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.partyA.address)

      // ctx.body = {contractAddress: block.result.address}; // not contract address
      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate sign settlement contract
   * @Router POST /rpc/settlement/getSignContractBlock
   * @Request body getSignContractBlock *body
   * @Response 200 getSignContractBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getSignContractBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.settlement.getSignContractBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.contractAddress)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate terminate settlement contract call
   * @Router POST /rpc/settlement/getTerminateContractBlock
   * @Request body getTerminateContractBlock *body
   * @Response 200 getTerminateContractBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getTerminateContractBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request
      body.request = body.request === true || body.request === 'true'

      const block = await ctx.service.qlc.settlement.getTerminateContractBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.address)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate add previous stop ContractSend block for Party B
   * @Router POST /rpc/settlement/getAddPreStopBlock
   * @Request body getAddPreStopBlock *body
   * @Response 200 getAddPreStopBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getAddPreStopBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.settlement.getAddPreStopBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.contractAddress)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  async getAddPreStopBlockBatchWorker (data, response) {
    const { ctx } = this

    if (data.length > 0) {
      const currentBlock = data.shift()

      try {
        const block = await ctx.service.qlc.settlement.getAddPreStopBlock(
          {
            contractAddress: currentBlock.contractAddress,
            stopName: currentBlock.stopName,
            address: currentBlock.address
          }
        )

        block.result = await this.updateAndProcessBlock(block.result, block.contractAddress)

        response.push({
          [`block${response.length + 1}`]: block.result
        })

        return await this.getAddPreStopBlockBatchWorker(data, response)
      } catch (error) {
        response.push({
          [`block${response.length + 1}`]: error.error
        })

        return await this.getAddPreStopBlockBatchWorker(data, response)
      }
    } else {
      return response
    }
  }

  /**
   * @Summary Generate add previous stop ContractSend block for Party A
   * @Router POST /rpc/settlement/getAddPreStopBlockBatch
   * @Request body getAddPreStopBlockBatch *body
   * @Response 200 getAddPreStopBlockBatch OK
   * @Response 500 error Unknown internal server error
   */
  async getAddPreStopBlockBatch () {
    const { ctx } = this

    try {
      const { body } = ctx.request
      const response = []

      ctx.body = await this.getAddPreStopBlockBatchWorker(body, response)
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate remove previous stop ContractSend block for Party B
   * @Router POST /rpc/settlement/getRemovePreStopBlock
   * @Request body getRemovePreStopBlock *body
   * @Response 200 getRemovePreStopBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getRemovePreStopBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.settlement.getRemovePreStopBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.contractAddress)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate update previous stop ContractSend block for Party B
   * @Router POST /rpc/settlement/getUpdatePreStopBlock
   * @Request body getUpdatePreStopBlock *body
   * @Response 200 getUpdatePreStopBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getUpdatePreStopBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.settlement.getUpdatePreStopBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.contractAddress)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate add previous stop ContractSend block for Party A
   * @Router POST /rpc/settlement/getAddNextStopBlock
   * @Request body getAddNextStopBlock *body
   * @Response 200 getAddNextStopBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getAddNextStopBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request
      const block = await ctx.service.qlc.settlement.getAddNextStopBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.contractAddress)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  async getAddNextStopBlockBatchWorker (data, response) {
    const { ctx } = this

    if (data.length > 0) {
      const currentBlock = data.shift()

      try {
        const block = await ctx.service.qlc.settlement.getAddNextStopBlock(
          {
            contractAddress: currentBlock.contractAddress,
            stopName: currentBlock.stopName,
            address: currentBlock.address
          }
        )

        block.result = await this.updateAndProcessBlock(block.result, block.contractAddress)

        response.push({
          [`block${response.length + 1}`]: block.result
        })

        return await this.getAddNextStopBlockBatchWorker(data, response)
      } catch (error) {
        response.push({
          [`block${response.length + 1}`]: error.error
        })

        return await this.getAddNextStopBlockBatchWorker(data, response)
      }
    } else {
      return response
    }
  }

  /**
   * @Summary Generate add previous stop ContractSend block for Party A
   * @Router POST /rpc/settlement/getAddNextStopBlockBatch
   * @Request body getAddNextStopBlockBatch *body
   * @Response 200 getAddNextStopBlockBatch OK
   * @Response 500 error Unknown internal server error
   */
  async getAddNextStopBlockBatch () {
    const { ctx } = this

    try {
      const { body } = ctx.request
      const response = []

      ctx.body = await this.getAddNextStopBlockBatchWorker(body, response)
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate remove previous stop ContractSend block for Party A
   * @Router POST /rpc/settlement/getRemoveNextStopBlock
   * @Request body getRemoveNextStopBlock *body
   * @Response 200 getRemoveNextStopBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getRemoveNextStopBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.settlement.getRemoveNextStopBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.contractAddress)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate update previous stop ContractSend block for Party A
   * @Router POST /rpc/settlement/getUpdateNextStopBlock
   * @Request body getUpdateNextStopBlock *body
   * @Response 200 getUpdateNextStopBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getUpdateNextStopBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.settlement.getUpdateNextStopBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.contractAddress)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Query all previous stop names by user's qlc address
   * @Router GET /rpc/settlement/getPreStopNames
   * @Response 200 getPreStopNames OK
   * @Response 500 error Unknown internal server error
   */
  async getPreStopNames () {
    const { ctx } = this

    try {
      const { address } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.getPreStopNames({
        address
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Query next stop names by user's qlc address
   * @Router GET /rpc/settlement/getNextStopNames
   * @Response 200 getNextStopNames OK
   * @Response 500 error Unknown internal server error
   */
  async getNextStopNames () {
    const { ctx } = this

    try {
      const { address } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.getNextStopNames({
        address
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate create settlement contract
   * @Router POST /rpc/settlement/getProcessCDRBlock
   * @Request body getProcessCDRBlock *body
   * @Response 200 getProcessCDRBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getProcessCDRBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      for (const param of body.params) {
        if (typeof param.contractAddress !== 'undefined') {
          delete param.contractAddress
        }
        param.index = parseInt(param.index)
        param.smsDt = parseInt(param.smsDt)
      }

      const block = await ctx.service.qlc.settlement.getProcessCDRBlock(
        body.addr,
        body.params
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.addr, true, true)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Create a new account by seed and index
   * @Router POST /rpc/account/create
   * @Request body create *body
   * @Response 200 create OK
   * @Response 500 error Unknown internal server error
   */
  async create () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      ctx.body = await ctx.service.qlc.account.create(body)
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Create new accounts randomly
   * @Router POST /rpc/account/newAccounts
   * @Request body newAccounts *body
   * @Response 200 newAccounts OK
   * @Response 500 error Unknown internal server error
   */
  async newAccounts () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const num = typeof body.num !== 'undefined' ? parseInt(body.num) : 1

      ctx.body = await ctx.service.qlc.account.newAccounts(num)
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Return account address by public key
   * @Router GET /rpc/account/forPublicKey
   * @Response 200 forPublicKey OK
   * @Response 500 error Unknown internal server error
   */
  async forPublicKey () {
    const { ctx } = this

    try {
      const { publicKey } = ctx.params

      const response = await ctx.service.qlc.account.forPublicKey(
        publicKey
      )

      ctx.body = { address: response.result }
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Return public key for account address
   * @Router GET /rpc/account/publicKey
   * @Response 200 publicKey OK
   * @Response 500 error Unknown internal server error
   */
  async publicKey () {
    const { ctx } = this

    try {
      const { address } = ctx.params

      const response = await ctx.service.qlc.account.publicKey(address)

      ctx.body = { publicKey: response.result }
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Return newest account detail info, include each token in the account
   * @Router GET /rpc/ledger/accountInfo
   * @Response 200 accountInfo OK
   * @Response 500 error Unknown internal server error
   */
  async accountInfo () {
    const { ctx } = this

    try {
      const { address } = ctx.params

      ctx.body = await ctx.service.qlc.ledger.accountInfo(address)
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Return number of blocks for a specific account
   * @Router GET /rpc/ledger/accountBlocksCount
   * @Response 200 accountBlocksCount OK
   * @Response 500 error Unknown internal server error
   */
  async accountBlocksCount () {
    const { ctx } = this

    try {
      const { address } = ctx.params

      const response = await ctx.service.qlc.ledger.accountBlocksCount(
        address
      )

      ctx.body = { num: response.result }
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Return blocks for the account, include each token of the account and order of blocks is forward from the last one
   * @Router GET /rpc/ledger/accountHistoryTopn
   * @Response 200 accountHistoryTopn OK
   * @Response 500 error Unknown internal server error
   */
  async accountHistoryTopn () {
    const { ctx } = this

    try {
      let { address, count, offset } = ctx.params

      count = parseInt(count)
      offset = parseInt(offset)

      ctx.body = await ctx.service.qlc.ledger.accountHistoryTopn({
        address,
        count,
        offset
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Returns balance and pending (amount that has not yet been received) for each account, if token is QLC, alse have benefit amount as vote, network, oracle, storage
   * @Router POST /rpc/ledger/accountsBalance
   * @Request body accountsBalance *body
   * @Response 200 accountsBalance OK
   * @Response 500 error Unknown internal server error
   */
  async accountsBalance () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      ctx.body = await ctx.service.qlc.ledger.accountsBalance(body)
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Returns pending info for accounts
   * @Router POST /rpc/ledger/accountsPending
   * @Request body accountsPending *body
   * @Response 200 accountsPending OK
   * @Response 500 error Unknown internal server error
   */
  async accountsPending () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      ctx.body = await ctx.service.qlc.ledger.accountsPending(
        body[0],
        body[1]
      )
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Returns contract address if found
   * @Router POST /rpc/settlement/getContractAddressByPartyANextStop
   * @Request body getContractAddressByPartyANextStop *body
   * @Response 200 getContractAddressByPartyANextStop OK
   * @Response 500 error Unknown internal server error
   */
  async getContractAddressByPartyANextStop () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      ctx.body = await ctx.service.qlc.settlement.getContractAddressByPartyANextStop(
        body[0],
        body[1]
      )
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Returns contract address if found
   * @Router POST /rpc/settlement/getContractAddressByPartyBPreStop
   * @Request body getContractAddressByPartyBPreStop *body
   * @Response 200 getContractAddressByPartyBPreStop OK
   * @Response 500 error Unknown internal server error
   */
  async getContractAddressByPartyBPreStop () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      ctx.body = await ctx.service.qlc.settlement.getContractAddressByPartyBPreStop(
        body[0],
        body[1]
      )
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Return send block by send parameter and private key
   * @Router POST /rpc/ledger/generateSendBlock
   * @Request body generateSendBlock *body
   * @Response 200 generateSendBlock OK
   * @Response 500 error Unknown internal server error
   */
  async generateSendBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.ledger.generateSendBlock(body)

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.from)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Return receive block by send block and private key
   * @Router POST /rpc/ledger/generateReceiveBlock
   * @Request body generateReceiveBlock *body
   * @Response 200 generateReceiveBlock OK
   * @Response 500 error Unknown internal server error
   */
  async generateReceiveBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const blockInfoQ = await ctx.service.qlc.ledger.blocksInfo([
        body.hash
      ])
      if (blockInfoQ.result) {
        const sendBlock = blockInfoQ.result[0]

        // check if settlements reward
        if (
          sendBlock.type === 'ContractSend' &&
          sendBlock.link ===
          '0000000000000000000000000000000000000000000000000000000000000019'
        ) {
          const rewardSettlementRewardsQuery = await ctx.service.qlc.settlement.getSettlementRewardsBlock(
            sendBlock.hash
          )

          if (rewardSettlementRewardsQuery.result) {
            const process = await this.updateAndProcessBlock(
              rewardSettlementRewardsQuery.result,
              body.account,
              true,
              true
            )
            ctx.body = process
          }

          if (rewardSettlementRewardsQuery.error) {
            ctx.body = { error: rewardSettlementRewardsQuery.error }
            return ctx.body
          }
        } else {
          const query = await ctx.service.qlc.ledger.generateReceiveBlock(
            sendBlock
          )
          if (query.result) {
            const process = await this.updateAndProcessBlock(query.result, body.account)
            ctx.body = process
          }
          if (query.error) {
            ctx.body = { error: query.error }
            return ctx.body
          }
        }
      }
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Return change block by account and private key
   * @Router POST /rpc/ledger/generateChangeBlock
   * @Request body generateChangeBlock *body
   * @Response 200 generateChangeBlock OK
   * @Response 500 error Unknown internal server error
   */
  async generateChangeBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.ledger.generateChangeBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.address)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate register asset contract
   * @Router POST /rpc/settlement/getRegisterAssetBlock
   * @Request body getRegisterAssetBlock *body
   * @Response 200 getRegisterAssetBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getRegisterAssetBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      for (const asset of body.assets) {
        asset.mcc = parseInt(asset.mcc)
        asset.mnc = parseInt(asset.mnc)
        asset.totalAmount = parseInt(asset.totalAmount)

        for (const sla of asset.sla) {
          sla.priority = parseInt(sla.priority)
          sla.value = parseFloat(sla.value)

          for (const compensation of sla.compensations) {
            compensation.low = parseFloat(compensation.low)
            compensation.high = parseFloat(compensation.high)
            compensation.rate = parseFloat(compensation.rate)
          }
        }
      }

      body.startDate = parseInt(body.startDate)
      body.endDate = parseInt(body.endDate)

      const block = await ctx.service.qlc.settlement.getRegisterAssetBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.owner.address, true, true)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary List all assets
   * @Router GET /rpc/settlement/getAllAssets
   * @Response 200 getAllAssets OK
   * @Response 500 error Unknown internal server error
   */
  async getAllAssets () {
    const { ctx } = this

    try {
      let { count, offset } = ctx.params

      count = parseInt(count)
      offset = parseInt(offset)

      ctx.body = await ctx.service.qlc.settlement.getAllAssets({
        count,
        offset
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Query assets by asset's owner
   * @Router GET /rpc/settlement/getAssetsByOwner
   * @Response 200 getAssetsByOwner OK
   * @Response 500 error Unknown internal server error
   */
  async getAssetsByOwner () {
    const { ctx } = this

    try {
      let { owner, count, offset } = ctx.params

      count = parseInt(count)
      offset = parseInt(offset)

      ctx.body = await ctx.service.qlc.settlement.getAssetsByOwner({
        owner,
        count,
        offset
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get asset by asset's address
   * @Router GET /rpc/settlement/getAsset
   * @Response 200 getAsset OK
   * @Response 500 error Unknown internal server error
   */
  async getAsset () {
    const { ctx } = this

    try {
      const { address } = ctx.params

      ctx.body = await ctx.service.qlc.settlement.getAsset(address)
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate multi-party invoice by settlement contract address start and end time
   * @Router GET /rpc/settlement/generateMultiPartyInvoice
   * @Response 200 generateMultiPartyInvoice OK
   * @Response 500 error Unknown internal server error
   */
  async generateMultiPartyInvoice () {
    const { ctx } = this

    try {
      let { firstAddr, secondAddr, start, end } = ctx.params

      start = parseInt(start)
      end = parseInt(end)

      ctx.body = await ctx.service.qlc.settlement.generateMultiPartyInvoice(
        {
          firstAddr,
          secondAddr,
          start,
          end
        }
      )
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate multi-party summary report by settlement contract address start and end time
   * @Router GET /rpc/settlement/generateMultiPartySummaryReport
   * @Response 200 generateMultiPartySummaryReport OK
   * @Response 500 error Unknown internal server error
   */
  async generateMultiPartySummaryReport () {
    const { ctx } = this

    try {
      let { firstAddr, secondAddr, start, end } = ctx.params

      start = parseInt(start)
      end = parseInt(end)

      ctx.body = await ctx.service.qlc.settlement.generateMultiPartySummaryReport(
        {
          firstAddr,
          secondAddr,
          start,
          end
        }
      )
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate multi-party summary report by settlement contract address start and end time
   * @Router GET /rpc/settlement/getMultiPartyCDRStatus
   * @Response 200 getMultiPartyCDRStatus OK
   * @Response 500 error Unknown internal server error
   */
  async getMultiPartyCDRStatus () {
    const { ctx } = this

    try {
      let { firstAddr, secondAddr, count, offset } = ctx.params

      count = parseInt(count)
      offset = parseInt(offset)

      ctx.body = await ctx.service.qlc.settlement.getMultiPartyCDRStatus(
        {
          firstAddr,
          secondAddr,
          count,
          offset
        }
      )
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get blocksInfo by hash
   * @Router GET /rpc/ledger/blocksInfo
   * @Response 200 blocksInfo OK
   * @Response 500 error Unknown internal server error
   */
  async blocksInfo () {
    const { ctx } = this

    try {
      const { hash } = ctx.params

      ctx.body = await ctx.service.qlc.ledger.blocksInfo([hash])
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get nodes data
   * @Router GET /rpc/permission/getNodesList
   * @Response 200 getNodesList OK
   * @Response 500 error Unknown internal server error
   */
  async getNodesList () {
    const { ctx } = this

    try {
      let { nodesCount, nodesOffset, peersCount, peersOffset } = ctx.params

      const getNodesCount = await ctx.service.qlc.permission.getNodesCount()

      if (!nodesCount) {
        nodesCount = getNodesCount.result
        peersCount = getNodesCount.result
      }

      if (!nodesOffset) {
        nodesOffset = 0
      }
      if (!peersOffset) {
        peersOffset = 0
      }

      nodesCount = parseInt(nodesCount)
      nodesOffset = parseInt(nodesOffset)
      peersCount = parseInt(peersCount)
      peersOffset = parseInt(peersOffset)

      const nodes = await ctx.service.qlc.permission.getNodes([nodesCount, nodesOffset])
      const onlinePeersInfo = await ctx.service.qlc.net.getOnlinePeersInfo([peersCount, peersOffset])

      for (const node of nodes.result) {
        node.online = onlinePeersInfo.result.findIndex(obj => obj.peerid === node.nodeId) >= 0
      }

      ctx.body = {
        getNodesCount: getNodesCount.result,
        getNodes: nodes.result
      }
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get node data by nodeId
   * @Router GET /rpc/permission/getNode
   * @Response 200 getNode OK
   * @Response 500 error Unknown internal server error
   */
  async getNode () {
    const { ctx } = this

    try {
      const { nodeId } = ctx.params

      ctx.body = await ctx.service.qlc.permission.getNode(nodeId)
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get the current admin
   * @Router GET /rpc/permission/getAdmin
   * @Response 200 getAdmin OK
   * @Response 500 error Unknown internal server error
   */
  async getAdmin () {
    const { ctx } = this

    try {
      ctx.body = await ctx.service.qlc.permission.getAdmin()
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get a contractSend block to update admin
   * @Router POST /rpc/permission/getAdminHandoverBlock
   * @Request body getAdminHandoverBlock *body
   * @Response 200 getAdminHandoverBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getAdminHandoverBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.permission.getAdminHandoverBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.admin)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get a contractSend block to update node
   * @Router POST /rpc/permission/getNodeUpdateBlock
   * @Request body getNodeUpdateBlock *body
   * @Response 200 getNodeUpdateBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getNodeUpdateBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.permission.getNodeUpdateBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.admin)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get a ptm pubkey by account
   * @Router GET /rpc/ptmkey/getPtmKeyByAccount
   * @Response 200 getPtmKeyByAccount OK
   * @Response 500 error Unknown internal server error
   */
  async getPtmKeyByAccount () {
    const { ctx } = this

    try {
      const { account } = ctx.params

      ctx.body = await ctx.service.qlc.ptmkey.getPtmKeyByAccount(account)
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get a ptm pubkey by account and btype
   * @Router GET /rpc/ptmkey/getPtmKeyByAccountAndBtype
   * @Response 200 getPtmKeyByAccountAndBtype OK
   * @Response 500 error Unknown internal server error
   */
  async getPtmKeyByAccountAndBtype () {
    const { ctx } = this

    try {
      const { account, btype } = ctx.params

      ctx.body = await ctx.service.qlc.ptmkey.getPtmKeyByAccountAndBtype({
        account,
        btype
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get a contractSend block to update ptm pubkey
   * @Router POST /rpc/ptmkey/getPtmKeyUpdateBlock
   * @Request body getPtmKeyUpdateBlock *body
   * @Response 200 getPtmKeyUpdateBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getPtmKeyUpdateBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.ptmkey.getPtmKeyUpdateBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get a contractSend block to delete ptm pubkey
   * @Router POST /rpc/ptmkey/getPtmKeyDeleteBlock
   * @Request body getPtmKeyDeleteBlock *body
   * @Response 200 getPtmKeyDeleteBlock OK
   * @Response 500 error Unknown internal server error
   */
  async getPtmKeyDeleteBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.ptmkey.getPtmKeyDeleteBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate a block to create an order.
   * @Router POST /rpc/dod/settlement/dodGetCreateOrderBlock
   * @Request body dodGetCreateOrderBlock *body
   * @Response 200 dodGetCreateOrderBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetCreateOrderBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.DoDSettlement.getCreateOrderBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate a block to update orderId/connectionId from sonata api to qlc chain.
   * @Router POST /rpc/dod/settlement/dodGetUpdateOrderInfoBlock
   * @Request body dodGetUpdateOrderInfoBlock *body
   * @Response 200 dodGetUpdateOrderInfoBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetUpdateOrderInfoBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.DoDSettlement.getUpdateOrderInfoBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate a block to confirm or reject requests, createOrderBlock/changeOrderBlock/terminateOrderBlock/updateConnectionStatusBlock all belong to request block.
   * @Router POST /rpc/dod/settlement/dodGetResponseBlock
   * @Request body dodGetResponseBlock *body
   * @Response 200 dodGetResponseBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetResponseBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      ctx.body = await ctx.service.qlc.DoDSettlement.getResponseBlock(
        body
      )
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate a block to change order's service parameters.
   * @Router POST /rpc/dod/settlement/dodGetChangeOrderBlock
   * @Request body dodGetChangeOrderBlock *body
   * @Response 200 dodGetChangeOrderBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetChangeOrderBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.DoDSettlement.getChangeOrderBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Genearate a block to terminate an order.
   * @Router POST /rpc/dod/settlement/dodGetTerminateOrderBlock
   * @Request body dodGetTerminateOrderBlock *body
   * @Response 200 dodGetTerminateOrderBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetTerminateOrderBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.DoDSettlement.getTerminateOrderBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary When the port is activated or the connection is established or the bandwidth has changed, we use this interface to generate a block to update the resource state.
   * @Router GET /rpc/dod/settlement/dodGetPendingRequest
   * @Response 200 dodGetPendingRequest OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetPendingRequest () {
    const { ctx } = this

    try {
      const { address } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getPendingRequest(
        address
      )
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Query order info.
   * @Router GET /rpc/dod/settlement/dodGetOrderInfo
   * @Response 200 dodGetOrderInfo OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetOrderInfo () {
    const { ctx } = this

    try {
      const { requestHash } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getOrderInfo({
        requestHash
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get buyer/seller's summary report.
   * @Router GET /rpc/dod/settlement/dodGetSummaryReport
   * @Response 200 dodGetSummaryReport OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetSummaryReport () {
    const { ctx } = this

    try {
      let { role, address, startTime, endTime } = ctx.params

      startTime = parseInt(startTime)
      endTime = parseInt(endTime)
      ctx.body = await ctx.service.qlc.DoDSettlement.getSummaryReport({
        role,
        address,
        startTime,
        endTime
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate buyer's invoice.
   * @Router GET /rpc/dod/settlement/dodGenerateInvoice
   * @Response 200 dodGenerateInvoice OK
   * @Response 500 error Unknown internal server error
   */
  async dodGenerateInvoice () {
    const { ctx } = this

    try {
      let { address, startTime, endTime } = ctx.params

      startTime = parseInt(startTime)
      endTime = parseInt(endTime)
      ctx.body = await ctx.service.qlc.DoDSettlement.generateInvoice({
        address,
        startTime,
        endTime
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get buyer's all order id.
   * @Router GET /rpc/dod/settlement/dodGetOrderIdListByAddress
   * @Response 200 dodGetOrderIdListByAddress OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetOrderIdListByAddress () {
    const { ctx } = this

    try {
      const { buyer } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getOrderIdListByAddress({
        buyer
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get buyer's all order id with a specified seller.
   * @Router GET /rpc/dod/settlement/dodGetOrderIdListByAddressAndSeller
   * @Response 200 dodGetOrderIdListByAddressAndSeller OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetOrderIdListByAddressAndSeller () {
    const { ctx } = this

    try {
      const { buyer, seller } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getOrderIdListByAddressAndSeller({
        buyer,
        seller
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get buyer's all product id
   * @Router GET /rpc/dod/settlement/dodGetProductIdListByAddress
   * @Response 200 dodGetProductIdListByAddress OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetProductIdListByAddress () {
    const { ctx } = this

    try {
      const { buyer } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getProductIdListByAddress({
        buyer
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get buyer's all product id with a specified seller
   * @Router GET /rpc/dod/settlement/dodGetProductIdListByAddressAndSeller
   * @Response 200 dodGetProductIdListByAddressAndSeller OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetProductIdListByAddressAndSeller () {
    const { ctx } = this

    try {
      const { buyer, seller } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getProductIdListByAddressAndSeller({
        buyer,
        seller
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary get order info by seller address and order id.
   * @Router GET /rpc/dod/settlement/dodGetOrderInfoBySellerAndOrderId
   * @Response 200 dodGetOrderInfoBySellerAndOrderId OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetOrderInfoBySellerAndOrderId () {
    const { ctx } = this

    try {
      const { seller, orderId } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getOrderInfoBySellerAndOrderId({
        seller,
        orderId
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary get product info by seller address and product id
   * @Router GET /rpc/dod/settlement/dodGetConnectionInfoBySellerAndProductId
   * @Response 200 dodGetConnectionInfoBySellerAndProductId OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetConnectionInfoBySellerAndProductId () {
    const { ctx } = this

    try {
      const { seller, productId } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getConnectionInfoBySellerAndProductId({
        seller,
        productId
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Get all pending orders for seller to check. Seller need to check every product's status in each order.
   * @Router GET /rpc/dod/settlement/dodGetPendingResourceCheck
   * @Response 200 dodGetPendingResourceCheck OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetPendingResourceCheck () {
    const { ctx } = this

    try {
      const { seller } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getPendingResourceCheck({
        seller
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate a block to confirm or reject a creating request.
   * @Router POST /rpc/dod/settlement/dodGetCreateOrderRewardBlock
   * @Request body dodGetCreateOrderRewardBlock *body
   * @Response 200 dodGetCreateOrderRewardBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetCreateOrderRewardBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.DoDSettlement.getCreateOrderRewardBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate a block to update order state to complete when all products in this order can be used normally.
   * @Router POST /rpc/dod/settlement/dodGetUpdateOrderInfoRewardBlock
   * @Request body dodGetUpdateOrderInfoRewardBlock *body
   * @Response 200 dodGetUpdateOrderInfoRewardBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetUpdateOrderInfoRewardBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.DoDSettlement.getUpdateOrderInfoRewardBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate a block to confirm or reject a changing request.
   * @Router POST /rpc/dod/settlement/dodGetChangeOrderRewardBlock
   * @Request body dodGetChangeOrderRewardBlock *body
   * @Response 200 dodGetChangeOrderRewardBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetChangeOrderRewardBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.DoDSettlement.getChangeOrderRewardBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate a block to confirm or reject a terminating request.
   * @Router POST /rpc/dod/settlement/dodGetTerminateOrderRewardBlock
   * @Request body dodGetTerminateOrderRewardBlock *body
   * @Response 200 dodGetTerminateOrderRewardBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetTerminateOrderRewardBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.DoDSettlement.getTerminateOrderRewardBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary When the port is activated or the connection is established or the bandwidth has changed, we use this interface to generate a block to update the resource state.
   * @Router POST /rpc/dod/settlement/dodGetUpdateProductInfoBlock
   * @Request body dodGetUpdateProductInfoBlock *body
   * @Response 200 dodGetUpdateProductInfoBlock OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetUpdateProductInfoBlock () {
    const { ctx } = this

    try {
      const { body } = ctx.request

      const block = await ctx.service.qlc.DoDSettlement.getUpdateProductInfoBlock(
        body
      )

      if (block.error || !block.result) {
        ctx.body = { error: block.error }
        return ctx.body
      }

      block.result = await this.updateAndProcessBlock(block.result, body.account)

      ctx.body = block
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary get order info by internal id.
   * @Router GET /rpc/dod/settlement/getOrderInfoByInternalId
   * @Response 200 dodGetOrderInfoByInternalId OK
   * @Response 500 error Unknown internal server error
   */
  async dodGetOrderInfoByInternalId () {
    const { ctx } = this

    try {
      const { internalId } = ctx.params

      ctx.body = await ctx.service.qlc.DoDSettlement.getOrderInfoByInternalId({
        internalId
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate invoice by order id.
   * @Router GET /rpc/dod/settlement/generateInvoiceByOrderId
   * @Response 200 dodGenerateInvoiceByOrderId OK
   * @Response 500 error Unknown internal server error
   */
  async dodGenerateInvoiceByOrderId () {
    const { ctx } = this
    try {
      let { seller, orderId, startTime, endTime, inFlight, split } = ctx.params
      startTime = parseInt(startTime)
      endTime = parseInt(endTime)
      inFlight = inFlight === 'true'
      split = split === 'true'

      ctx.body = await ctx.service.qlc.DoDSettlement.generateInvoiceByOrderId({
        seller,
        orderId,
        startTime,
        endTime,
        inFlight,
        split
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }

  /**
   * @Summary Generate invoice by product id.
   * @Router GET /rpc/dod/settlement/generateInvoiceByProductId
   * @Response 200 dodGenerateInvoiceByProductId OK
   * @Response 500 error Unknown internal server error
   */
  async dodGenerateInvoiceByProductId () {
    const { ctx } = this

    try {
      let { seller, productId, startTime, endTime, inFlight, split } = ctx.params

      startTime = parseInt(startTime)
      endTime = parseInt(endTime)
      inFlight = inFlight === 'true'
      split = split === 'true'

      ctx.body = await ctx.service.qlc.DoDSettlement.generateInvoiceByProductId({
        seller,
        productId,
        startTime,
        endTime,
        inFlight,
        split
      })
      ctx.status = 200
    } catch (error) {
      ctx.body = error
      ctx.status = 200
    }
  }
}

module.exports = RpcController
