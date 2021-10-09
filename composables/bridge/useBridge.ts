/* eslint-disable max-depth */
import {
  reactive,
  ref,
  Ref,
  onMounted,
  onBeforeUnmount,
} from '@nuxtjs/composition-api'
import { hexDataLength } from '@ethersproject/bytes'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { ethers, BigNumber } from 'ethers'
import { Bridge } from 'arb-ts'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3/useWeb3'
import { useBigNumber } from '../web3/useBigNumber'
import realmsLockBoxABI from '~/abi/realmsLockBox.json'
import lootRealmsABI from '~/abi/lootRealms.json'
import lootRealmsL2ABI from '~/abi/lootRealmsL2.json'
import erc721tokens from '~/constant/erc721tokens'
import { useRealms } from '~/composables/web3/useRealms'
import {
  useTransactions,
  AssetType,
  Transaction,
} from '~/composables/bridge/useTransactions'
const RINKEBY_L1_BRIDGE_ADDRESS = '0x2a8Bd12936BD5fC260314a80D51937E497523FCC'
const ARB_RINKEBY_L2_BRIDGE_ADDRESS =
  '0x5fAe6B0BE396B9541D5Cc8D50a98168b790d0d7e'
interface AppProps {
  bridge: Bridge
}
export type TxnType =
  | 'deposit'
  | 'deposit-l1'
  | 'deposit-l2'
  | 'withdraw'
  | 'outbox'
  | 'approve'
  | 'connext-deposit'
  | 'connext-withdraw'
  | 'deposit-l2-auto-redeem'
  | 'deposit-l2-ticket-created'

export const txnTypeToLayer = (txnType: TxnType): 1 | 2 => {
  switch (txnType) {
    case 'deposit':
    case 'deposit-l1':
    case 'outbox':
    case 'approve':
    case 'connext-deposit':
      return 1
    case 'deposit-l2':
    case 'withdraw':
    case 'connext-withdraw':
    case 'deposit-l2-auto-redeem':
    case 'deposit-l2-ticket-created':
      return 2
  }
}

export function useBridge() {
  const { getUserRealms } = useRealms()
  const loadingBridge = ref(false)
  const error = reactive({
    depositL1: null,
    withdrawL2: null,
  })

  const loading = reactive({
    depositL1: null,
    withdrawL2: null,
  })
  const result = reactive({
    realmsOnL2: null,
  })

  const { times, plus, ensureValue } = useBigNumber()
  const { provider, library, account, activate } = useWeb3()
  const { networks, partnerNetwork, useL1Network, useL2Network } = useNetwork()
  const {
    transactions,
    successfulL1Deposits,
    sortedTransactions,
    addTransaction,
    addTransactions,
    updateTransaction,
    pendingTransactions,
  } = useTransactions()

  const ethProvider = ref(null)
  const arbProvider = ref(null)
  const l1Signer = ref(null)
  const l2Signer = ref(null)
  const l2TransactionCount = ref(null)
  const bridge = ref(null)

  const initBridge = async () => {
    if (!process.server && account.value) {
      if (!activeNetwork.value.isArbitrum) {
        ethProvider.value = new ethers.providers.Web3Provider(window.ethereum)
        arbProvider.value = new ethers.providers.JsonRpcProvider(
          useL2Network.value.url
        )
      } else {
        ethProvider.value = new ethers.providers.JsonRpcProvider(
          useL1Network.value.url
        )
        arbProvider.value = new ethers.providers.Web3Provider(provider.value)
      }

      l1Signer.value = ethProvider.value.getSigner(account.value)
      l2Signer.value = arbProvider.value.getSigner(account.value)

      try {
        bridge.value = await Bridge.init(
          l1Signer.value,
          l2Signer.value,
          RINKEBY_L1_BRIDGE_ADDRESS,
          ARB_RINKEBY_L2_BRIDGE_ADDRESS
        )
        l2TransactionCount.value =
          await bridge.value.l2Signer.getTransactionCount()
        return bridge.value
      } catch (e) {
        console.log(e)
      }
    }
  }

  const depositRealm = async (id) => {
    // eslint-disable-next-line prefer-const
    if (!process.server) {
      loadingBridge.value = true
      loading.depositL1 = true
      try {
        // Calculate the amount of data to be sent to L2 (see LootRealmsLockbox)
        console.log(l1Signer.value)
        const calldataBytes = ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256'],
          [bridge.value.l1Bridge.l1Signer._address, 1011]
        )
        const calldataBytesLength = hexDataLength(calldataBytes) + 4 // 4 bytes func identifier
        console.log(`Calldata size: ${calldataBytesLength}`)
        console.log('deposting id' + id)
        const [_submissionPriceWei, nextUpdateTimestamp] =
          await bridge.value.l2Bridge.getTxnSubmissionPrice(calldataBytesLength)
        const submissionPriceWei = _submissionPriceWei + 5
        const timeNow = Math.floor(new Date().getTime() / 1000)
        const gasPriceBid = await bridge.value.l2Provider.getGasPrice()
        console.log(submissionPriceWei)
        console.log(`L2 gas price: ${gasPriceBid.toString()}`)

        // Hardcoded for now
        const maxGas = 200000000
        // eslint-disable-next-line prettier/prettier
      const callValue = (gasPriceBid * maxGas) + parseInt(submissionPriceWei)
        console.log(`Call value to L2: ${callValue.toString()}`)

        const lootRealmsLockbox = new ethers.Contract(
          RINKEBY_L1_BRIDGE_ADDRESS,
          realmsLockBoxABI,
          l1Signer.value
        )
        const tokensArr = erc721tokens[activeNetwork.value.id].allTokens
        const tokensAddrArr = tokensArr.map((a) => a.address)

        const realmsContract = new ethers.Contract(
          tokensAddrArr[0],
          lootRealmsABI,
          l1Signer.value
        )

        const checkApproval = await realmsContract.isApprovedForAll(
          account.value,
          RINKEBY_L1_BRIDGE_ADDRESS
        )
        console.log(checkApproval)

        const network = await bridge.value.l1Bridge.l1Provider.getNetwork()
        const networkID = await network.chainId.toString()

        if (!checkApproval) {
          const tx = await realmsContract.setApprovalForAll(
            RINKEBY_L1_BRIDGE_ADDRESS,
            true
          )
          addTransaction({
            type: 'approve',
            status: 'pending',
            value: null,
            txID: tx.hash,
            assetName: 'Realms',
            assetType: AssetType.ERC721,
            sender: account.value,
            l1NetworkID: networkID, // TODO: make dynamiuc
          })
          const receipt = await tx.wait()
          updateTransaction(receipt, tx)
        }

        const tx = await lootRealmsLockbox.depositToL2(
          id,
          submissionPriceWei,
          maxGas,
          gasPriceBid,
          { value: callValue }
        )

        console.log(l1Signer._address)
        addTransaction({
          type: 'deposit-l1',
          status: 'pending',
          value: id,
          txID: tx.hash,
          assetName: 'Realms',
          assetType: AssetType.ERC721,
          sender: account.value,
          l1NetworkID: networkID,
        })

        try {
          const receipt = await tx.wait()
          const seqNums =
            await bridge.value.getInboxSeqNumFromContractTransaction(receipt)
          const seqNum = seqNums[0].toNumber()
          updateTransaction(receipt, tx, seqNum)
          loading.depositL1 = false
        } catch (err) {
          console.warn('deposit token failure', err)
          throw err
        }

        /* const event = receipt.events[receipt.events.length - 1]
        const ticketId = event.args[0]

        const ticketIdBigNumber = ethers.BigNumber.from(ticketId.toString())

        console.log(`Ticket Id: ${ticketId}`)
        await getUserRealms()
        const autoRedeemHash =
          await bridge.value.calculateRetryableAutoRedeemTxnHash(
            ticketIdBigNumber
          )
        const autoRedeemRec = await arbProvider.value.getTransactionReceipt(
          autoRedeemHash
        )
        console.log(
          `AutoRedeem https://rinkeby-explorer.arbitrum.io/tx/${autoRedeemHash}`
        )
        console.log(autoRedeemRec)

        const redeemTxnHash =
          await bridge.value.calculateL2RetryableTransactionHash(
            ticketIdBigNumber
          )
        const redeemTxnRec = await arbProvider.value.getTransactionReceipt(
          redeemTxnHash
        )
        console.log(
          `RedeemTxn https://rinkeby-explorer.arbitrum.io/tx/${redeemTxnHash}`
        )
        console.log(redeemTxnRec)

        const retryableTicketHash =
          await bridge.value.calculateL2TransactionHash(ticketIdBigNumber)
        const retryableTicketRec =
          await arbProvider.value.getTransactionReceipt(retryableTicketHash)
        console.log(
          `RetryableTicket https://rinkeby-explorer.arbitrum.io/tx/${retryableTicketHash}`
        )
        console.log(retryableTicketRec)

        const ourMessagesSequenceNum = seqNums[0]

        const retryableTxnHash =
          await bridge.value.calculateL2RetryableTransactionHash(
            ourMessagesSequenceNum
          )

        console.log(`Waiting L2 tx: ${retryableTxnHash}`)

        // Wait for L2
        const retryRec = await arbProvider.value.waitForTransaction(
          retryableTxnHash
        ) 

        console.log(`L2 retryable txn executed: ${retryRec.transactionHash}`) */
        await getUserRealms()
      } catch (e) {
        console.log(e)
      } finally {
        loadingBridge.value = false
        loading.depositL1 = false
      }
    }
  }
  const withdrawToL1 = async (id) => {
    // eslint-disable-next-line prefer-const
    if (!process.server) {
      loadingBridge.value = true
      // Calculate the amount of data to be sent to L2 (see LootRealmsLockbox)
      const lootRealmsL2 = new ethers.Contract(
        ARB_RINKEBY_L2_BRIDGE_ADDRESS,
        lootRealmsL2ABI,
        l2Signer.value
      )

      const checkApproval = await lootRealmsL2.isApprovedForAll(
        account.value,
        ARB_RINKEBY_L2_BRIDGE_ADDRESS
      )

      if (!checkApproval) {
        console.log('approving')
        const approve = await lootRealmsL2.setApprovalForAll(
          ARB_RINKEBY_L2_BRIDGE_ADDRESS,
          true
        )
        await approve.wait()
      }

      const tx = await lootRealmsL2.withdrawToL1(id)

      try {
        const receipt = await tx.wait()
        // updateTransaction(receipt, tx)

        const l2ToL2EventData = await bridge.getWithdrawalsInL2Transaction(
          receipt
        )
        console.log('event data')
        console.log(l2ToL2EventData)
        /* if (l2ToL2EventData.length === 1) {
          const l2ToL2EventDataResult = l2ToL2EventData[0]
          const id = l2ToL2EventDataResult.uniqueId.toString()
          const outgoingMessageState = await getOutGoingMessageState(
            l2ToL2EventDataResult.batchNumber,
            l2ToL2EventDataResult.indexInBatch
          )
          const l2ToL2EventDataResultPlus = {
            ...l2ToL2EventDataResult,
            type: AssetType.ERC721,
            tokenAddress: erc20l1Address,
            value: amountParsed,
            outgoingMessageState,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals,
          }
          setPendingWithdrawalMap({
            ...pendingWithdrawalsMap,
            [id]: l2ToL2EventDataResultPlus,
          })
        }
        updateTokenData(erc20l1Address) */
        return receipt
      } catch (err) {
        console.warn('withdraw token err', err)
      }
    }
  }
  const getL2TxnHashes = async (depositTxn) => {
    let seqNum: BigNumber
    if (depositTxn.seqNum) {
      seqNum = BigNumber.from(depositTxn.seqNum)
    } else {
      // for backwards compatibility, add seqNum to cached old deposits
      const rec = await bridge.value.l1Provider.getTransactionReceipt(
        depositTxn.txID
      )
      const seqNumArray =
        await bridge.value.getInboxSeqNumFromContractTransaction(rec)
      if (!seqNumArray || seqNumArray.length === 0) {
        return null
      }
      ;[seqNum] = seqNumArray
    }

    const l2ChainID = BigNumber.from(useL2Network.value.chainId)
    const retryableTicketHash = await bridge.value.calculateL2TransactionHash(
      seqNum,
      l2ChainID
    )
    const autoRedeemHash =
      await bridge.value.calculateRetryableAutoRedeemTxnHash(seqNum, l2ChainID)
    const userTxnHash = await bridge.value.calculateL2RetryableTransactionHash(
      seqNum,
      l2ChainID
    )
    return {
      retryableTicketHash,
      autoRedeemHash,
      userTxnHash,
      seqNum,
    }
  }
  const checkAndAddL2DepositTxns = () => {
    Promise.all(successfulL1Deposits.value.map(getL2TxnHashes))
      .then((txnHashesArr) => {
        let transactionsToAdd = []
        const txIdsSet = new Set([
          ...sortedTransactions.value.map((tx) => tx.txID),
        ])
        successfulL1Deposits.value.forEach((depositTxn, i: number) => {
          const txnHashes = txnHashesArr[i]
          if (txnHashes === null) {
            console.log('Could not find seqNum for', depositTxn.txID)
            return
          }
          const { retryableTicketHash, autoRedeemHash, userTxnHash } = txnHashes
          const seqNum = txnHashes.seqNum.toNumber()
          // add ticket creation if not yet included
          if (!txIdsSet.has(retryableTicketHash)) {
            transactionsToAdd.push({
              ...depositTxn,
              ...{
                status: 'pending',
                type:
                  depositTxn.assetType === 'ETH'
                    ? 'deposit-l2'
                    : 'deposit-l2-ticket-created',
                txID: retryableTicketHash,
                seqNum,
                blockNumber: undefined,
              },
            })
          }

          if (depositTxn.assetType === AssetType.ERC721) {
            // add autoredeem if not yet included (tokens only)
            if (!txIdsSet.has(autoRedeemHash)) {
              transactionsToAdd.push({
                ...depositTxn,
                ...{
                  status: 'pending',
                  type: 'deposit-l2-auto-redeem',
                  txID: autoRedeemHash,
                  seqNum,
                  blockNumber: undefined,
                },
              })
            }
            // add user-txn if not yet included (tokens only)
            if (!txIdsSet.has(userTxnHash)) {
              transactionsToAdd.push({
                ...depositTxn,
                ...{
                  status: 'pending',
                  type: 'deposit-l2',
                  txID: userTxnHash,
                  seqNum,
                  blockNumber: undefined,
                },
              })
            }
          }
        })
        addTransactions(transactionsToAdd)
        transactionsToAdd = []
      })
      .catch((err) => {
        console.warn('Errors checking to retryable txns to add', err)
      })
  }
  const checkAndUpdatePendingTransactions = () => {
    if (pendingTransactions.value.length) {
      console.info(
        `Checking and updating ${pendingTransactions.value.length} pending transactions' statuses`
      )

      // eslint-disable-next-line consistent-return
      return Promise.all(
        pendingTransactions.value.map((tx: Transaction) => {
          const provider =
            txnTypeToLayer(tx.type) === 2
              ? bridge?.value.l2Provider
              : bridge?.value.l1Provider
          return provider?.getTransactionReceipt(tx.txID)
        })
      ).then((txReceipts: TransactionReceipt[]) => {
        txReceipts.forEach((txReceipt: TransactionReceipt, i) => {
          if (!txReceipt) {
            console.info(
              'Transaction receipt not yet found:',
              pendingTransactions[i].txID
            )
          } else {
            updateTransaction(txReceipt)
          }
        })
      })
    }
  }
  const getL2Realms = async () => {
    console.log('getting l2 realms')
    const l2RealmsContract = new ethers.Contract(
      ARB_RINKEBY_L2_BRIDGE_ADDRESS,
      lootRealmsL2ABI,
      l2Signer.value
    )
    const connect = await l2RealmsContract.connect(arbProvider.value)
    // console.log(connect)
    result.realmsOnL2 = await connect.balanceOf(account.value)
    // console.log(balance)
    return result.realmsOnL2
  }
  const addL2Interval = ref()
  const checkPendingInterval = ref()

  onMounted(() => {
    addL2Interval.value = setInterval(checkAndAddL2DepositTxns, 4000)
    checkPendingInterval.value = setInterval(
      checkAndUpdatePendingTransactions,
      4000
    )
  })
  onBeforeUnmount(() => {
    clearInterval(addL2Interval.value)
    clearInterval(checkPendingInterval.value)
  })
  return {
    initBridge,
    getL2Realms,
    depositRealm,
    withdrawToL1,
    getL2TxnHashes,
    l2TransactionCount,
    error,
    bridge,
    result,
    loading,
    partnerNetwork,
    loadingBridge,
  }
}
