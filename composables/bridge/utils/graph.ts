import { BigNumber } from '@ethersproject/bignumber'
import { L2ToL1EventResult } from 'arb-ts'
import axios from 'axios'
import { utils } from 'ethers'
import { gql } from 'graphql-request'
import { useContext, ref } from '@nuxtjs/composition-api'
import { useGraph } from '~/composables/web3/useGraph'
import {
  lastOutboxEntryQuery,
  getWithdrawalsQuery,
  messageHasExecutedQuery,
} from '~/composables/graphql/queries'

const networkIDAndLayerToClient = (networkID: number, layer: 1 | 2) => {
  switch (networkID) {
    case 1:
      return layer === 1 ? 'L1Mainnetlient' : 'L2Mainnetlient'
    case 4:
      return layer === 1 ? 'L1RinkebyClient' : 'L2RinkebyClient'
    default:
      throw new Error('Unsupported network')
  }
}

export const getLatestOutboxEntryIndex = async (networkID: number) => {
  const { gqlRequest } = useGraph()
  const client = networkIDAndLayerToClient(networkID, 2)
  const res = await gqlRequest(lastOutboxEntryQuery, null, client)
  console.log(res)
  return res.data.outboxEntries?.[0]?.outboxEntryIndex as number
}

export async function getETHWithdrawals(
  callerAddress: string,
  fromBlock: number,
  toBlock: number,
  networkID: number
): Promise<L2ToL1EventResult[]> {
  const { gqlRequest } = useGraph()

  const client = networkIDAndLayerToClient(networkID, 2)

  const res = await gqlRequest(
    getWithdrawalsQuery,
    { callerAddress, fromBlock, toBlock },
    client
  )

  return res.data.l2ToL1Transactions.map((eventData: any) => {
    const {
      destination,
      timestamp,
      data,
      caller,
      uniqueId,
      batchNumber,
      indexInBatch,
      arbBlockNum,
      ethBlockNum,
      callvalue,
    } = eventData
    return {
      destination,
      timestamp,
      data,
      caller,
      uniqueId: BigNumber.from(uniqueId),
      batchNumber: BigNumber.from(batchNumber),
      indexInBatch: BigNumber.from(indexInBatch),
      arbBlockNum: BigNumber.from(arbBlockNum),
      ethBlockNum: BigNumber.from(ethBlockNum),
      callvalue: BigNumber.from(callvalue),
    } as L2ToL1EventResult
  })
}

export const messageHasExecuted = async (
  path: BigNumber,
  batchNumber: BigNumber,
  networkID: number
) => {
  const { gqlRequest } = useGraph()

  const client = networkIDAndLayerToClient(networkID, 1)
  const batchHexString = utils.hexStripZeros(batchNumber.toHexString())

  const res = await gqlRequest(
    messageHasExecutedQuery,
    { path: path.toNumber(), batchHexString },
    client
  )

  return res.data.outboxOutputs.length > 0
}

interface GetTokenWithdrawalsResult {
  l2ToL1Event: L2ToL1EventResult
  otherData: {
    value: BigNumber
    tokenAddress: string
  }
}

const getLatestIndexedBlockNumber = async (subgraphName: string) => {
  try {
    const res = await axios.post(
      'https://api.thegraph.com/index-node/graphql',
      {
        query: `{ indexingStatusForCurrentVersion(subgraphName: "${subgraphName}") {  chains { network latestBlock { number }  } } }`,
      }
    )
    return res.data.data.indexingStatusForCurrentVersion.chains[0].latestBlock
      .number
  } catch (err) {
    console.warn('Error getting graph status:', err)

    return 0
  }
}

export const getBuiltInsGraphLatestBlockNumber = (l1NetworkID: number) => {
  const subgraphName = ((l1NetworkID: number) => {
    switch (l1NetworkID) {
      case 1:
        return 'fredlacs/arb-builtins'
      case 4:
        return 'fredlacs/arb-builtins-rinkeby'
      default:
        throw new Error('Unsupported netwowk')
    }
  })(l1NetworkID)

  return getLatestIndexedBlockNumber(subgraphName)
}

export const getL2GatewayGraphLatestBlockNumber = (l1NetworkID: number) => {
  const subgraphName = ((l1NetworkID: number) => {
    switch (l1NetworkID) {
      case 1:
        return 'fredlacs/layer2-token-gateway'
      case 4:
        return 'fredlacs/layer2-token-gateway-rinkeby'
      default:
        throw new Error('Unsupported netwowk')
    }
  })(l1NetworkID)

  return getLatestIndexedBlockNumber(subgraphName)
}
