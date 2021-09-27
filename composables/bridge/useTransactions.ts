/* eslint-disable max-depth */
import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { hexDataLength } from '@ethersproject/bytes'
import { ethers } from 'ethers'
import {
  // Bridge,
  networks,
  L2ToL1EventResult,
  OutgoingMessageState,
} from 'arb-ts'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3/useWeb3'
import { useBridge } from './useBridge'

export enum AssetType {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ETH = 'ETH',
}

export interface L2ToL1EventResultPlus extends L2ToL1EventResult {
  type: AssetType
  tokenAddress?: string
  outgoingMessageState: OutgoingMessageState
  tokenId: number
}

export interface PendingWithdrawalsMap {
  [id: string]: L2ToL1EventResultPlus
}

const RINKEBY_L1_BRIDGE_ADDRESS = '0x2a8Bd12936BD5fC260314a80D51937E497523FCC'
const ARB_RINKEBY_L2_BRIDGE_ADDRESS =
  '0x5fAe6B0BE396B9541D5Cc8D50a98168b790d0d7e'

interface newProviderClass extends Ref {
  getSigner: () => string
}

export function useTransactions() {
  const { account } = useWeb3()
  const { partnerNetwork, useL1Network, useL2Network } = useNetwork()
  const { bridge: bridgeRef } = useBridge()
  const loadingBridge = ref(false)
  const error = reactive({
    depositL1: null,
  })
  const { l2CustomGateway } = networks[useL1Network.value.chainId].tokenBridge
  console.log(l2CustomGateway)
  const getTokenWithdrawalsV2 = async (
    bridge,
    filter?: ethers.providers.Filter
  ) => {
    /* const latestGraphBlockNumber = await getL2GatewayGraphLatestBlockNumber(
      useL1Network.value.chainId
    )
    console.log(
      `*** L2 gateway graph block number: ${latestGraphBlockNumber} ***`
    ) */
    /*
    const startBlock =
      (filter && filter.fromBlock && +filter.fromBlock.toString()) || 0

    // const pivotBlock = Math.max(latestGraphBlockNumber, startBlock)

   /* const results = await getTokenWithdrawalsGraph(
      account.value,
      startBlock,
      pivotBlock,
      useL1Network.value.chainId
    )

    /* const symbols = await Promise.all(
      results.map(resultData =>
        getTokenSymbol(resultData.otherData.tokenAddress)
      )
    )
    const decimals = await Promise.all(
      results.map(resultData =>
        getTokenDecimals(resultData.otherData.tokenAddress)
      )
    ) */

    /* const outgoingMessageStates = await Promise.all(
      results.map((withdrawEventData, i) => {
        const { batchNumber, indexInBatch } = withdrawEventData.l2ToL1Event
        return getOutGoingMessageState(batchNumber, indexInBatch)
      })
    )
    const oldTokenWithdrawals = results.map((resultsData, i) => {
      const {
        caller,
        destination,
        uniqueId,
        batchNumber,
        indexInBatch,
        arbBlockNum,
        ethBlockNum,
        timestamp,
        callvalue,
        data,
      } = resultsData.l2ToL1Event
      const { value, tokenAddress, type } = resultsData.otherData
      const eventDataPlus: L2ToL1EventResultPlus = {
        caller,
        destination,
        uniqueId,
        batchNumber,
        indexInBatch,
        arbBlockNum,
        ethBlockNum,
        timestamp,
        callvalue,
        data,
        type,
        value,
        tokenAddress,
        outgoingMessageState: outgoingMessageStates[i],
        symbol: symbols[i],
        decimals: decimals[i],
      }
      return eventDataPlus
    }) */

    const recentTokenWithdrawals = await getTokenWithdrawals(
      bridge,
      ['0x195C107F3F75c4C93Eba7d9a1312F19305d6375f'],
      {
        fromBlock: 4832020,
      }
    )

    const t = new Date().getTime()

    return recentTokenWithdrawals
  }

  const getTokenWithdrawals = async (
    bridge,
    gatewayAddresses: string[],
    filter?: ethers.providers.Filter
  ) => {
    const t = new Date().getTime()

    const gateWayWithdrawalsResultsNested =
      await bridge.value.getGatewayWithdrawEventData(
        gatewayAddresses[0],
        account.value,
        filter
      )

    console.log(gateWayWithdrawalsResultsNested)

    console.log(
      `*** got token gateway event data in ${
        (new Date().getTime() - t) / 1000
      } seconds *** `
    )

    const gateWayWithdrawalsResults = gateWayWithdrawalsResultsNested.flat()

    const l2Txns = await Promise.all(
      gateWayWithdrawalsResults.map((withdrawEventData) =>
        bridge.value.getL2Transaction(withdrawEventData.txHash)
      )
    )
    console.log(l2Txns)
    return l2Txns
    /* const outgoingMessageStates = await Promise.all(
      gateWayWithdrawalsResults.map((withdrawEventData, i) => {
        const eventDataArr = bridge.getWithdrawalsInL2Transaction(l2Txns[i])
        // TODO: length != 1
        const { batchNumber, indexInBatch } = eventDataArr[0]
        return getOutGoingMessageState(batchNumber, indexInBatch)
      })
    )
    return gateWayWithdrawalsResults.map(
      (withdrawEventData: WithdrawalInitiated, i) => {
        // TODO: length != 1
        const eventDataArr = bridge.getWithdrawalsInL2Transaction(l2Txns[i])
        const {
          caller,
          destination,
          uniqueId,
          batchNumber,
          indexInBatch,
          arbBlockNum,
          ethBlockNum,
          timestamp,
          callvalue,
          data,
        } = eventDataArr[0]

        const eventDataPlus: L2ToL1EventResultPlus = {
          caller,
          destination,
          uniqueId,
          batchNumber,
          indexInBatch,
          arbBlockNum,
          ethBlockNum,
          timestamp,
          callvalue,
          data,
          type: AssetType.ERC20,
          value: withdrawEventData._amount,
          tokenAddress: withdrawEventData.l1Token,
          outgoingMessageState: outgoingMessageStates[i],
          symbol: symbols[i],
          decimals: decimals[i],
        }
        return eventDataPlus
      }
    ) */
  }

  const setInitialPendingWithdrawals = async (
    bridge,
    filter?: ethers.providers.Filter
  ) => {
    console.log(bridgeRef)
    const pendingWithdrawals: PendingWithdrawalsMap = {}
    const t = new Date().getTime()
    console.log('*** Getting initial pending withdrawal data ***')
    const l2ToL1Txns = await getTokenWithdrawalsV2(bridge, filter)

    console.log(
      `*** done getting pending withdrawals, took ${
        Math.round(new Date().getTime() - t) / 1000
      } seconds`
    )
    console.log(l2ToL1Txns)
    /* for (const l2ToL1Thing of l2ToL1Txns as ) {
      pendingWithdrawals[l2ToL1Thing.uniqueId.toString()] = l2ToL1Thing
    }
    console.log(pendingWithdrawals)
    // setPendingWithdrawalMap(pendingWithdrawals)
  }

  /*  const getOutGoingMessageStateV2 = useCallback(
    async (batchNumber: BigNumber, indexInBatch: BigNumber) => {
      if (
        executedMessagesCache[hashOutgoingMessage(batchNumber, indexInBatch)]
      ) {
        return OutgoingMessageState.EXECUTED
      } else {
        const proofData = await bridge.tryGetProofOnce(
          batchNumber,
          indexInBatch
        )
        if (!proofData) {
          return OutgoingMessageState.UNCONFIRMED
        }

        const { path } = proofData
        const l1NetworkID = await l1NetworkIDCached()
        const res = await messageHasExecuted(path, batchNumber, l1NetworkID)

        if (res) {
          addToExecutedMessagesCache(batchNumber, indexInBatch)
          return OutgoingMessageState.EXECUTED
        } else {
          return OutgoingMessageState.CONFIRMED
        }
      }
    },
    [executedMessagesCache]
  )

  const getOutGoingMessageState = useCallback(
    async (batchNumber: BigNumber, indexInBatch: BigNumber) => {
      if (
        executedMessagesCache[hashOutgoingMessage(batchNumber, indexInBatch)]
      ) {
        return OutgoingMessageState.EXECUTED
      } else {
        return bridge.getOutGoingMessageState(batchNumber, indexInBatch)
      }
    },
    [executedMessagesCache]
  )

  const addToExecutedMessagesCache = useCallback(
    (batchNumber: BigNumber, indexInBatch: BigNumber) => {
      const _executedMessagesCache = { ...executedMessagesCache }
      _executedMessagesCache[hashOutgoingMessage(batchNumber, indexInBatch)] =
        true
      setExecutedMessagesCache(_executedMessagesCache)
    },
    [executedMessagesCache]
  )

  const hashOutgoingMessage = (
    batchNumber: BigNumber,
    indexInBatch: BigNumber
  ) => {
    return batchNumber.toString() + ',' + indexInBatch.toString() */
  }

  return {
    /* transactions: {
      transactions,
      clearPendingTransactions,
      setTransactionConfirmed,
      updateTransaction,
      addTransaction,
      addTransactions,
    }, */
    setInitialPendingWithdrawals,
  }
}
