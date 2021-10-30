import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import {
  getAddLiquidityData,
  getBuyTokenData,
  getRemoveLiquidityData,
  getSellTokenData,
} from './callDataHelpers'

// ABI
import TheLordsTokenAbi from '~/abi/TheLordsToken.json'
import ResourceTokensAbi from '~/abi/ResourceTokens.json'
import ResourceExchangeAbi from '~/abi/NiftyswapExchange20.json'

// ADDRESS CONSTS
import exchangeAddress from '~/constant/exchangeAddress'
import resourceTokens from '~/constant/resourceTokens'
import erc20Tokens from '~/constant/erc20Tokens'

export function useMarket() {
  const { provider, library, account, activate } = useWeb3()
  const { availableNetworks, partnerNetwork, useL1Network, useL2Network } =
    useNetwork()

  const error = reactive({
    resources: null,
  })

  const loading = reactive({
    resources: false,
    fetchingResources: false,
  })

  const result = reactive({ resources: null })
  const output = ref()

  const fetchResourceReserve = async (resourceId) => {
    try {
      error.resources = null
      // loading.resources = true
      return await getResourceReserve(activeNetwork.value.id, resourceId)
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  const fetchLiquidityTokenSupply = async (resourceId) => {
    try {
      error.resources = null
      // loading.resources = true
      return await getLiquidityTokenSupply(activeNetwork.value.id, resourceId)
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  const fetchCurrencyReserve = async (resourceId) => {
    try {
      error.resources = null
      // loading.resources = true
      return await getCurrencyReserve(activeNetwork.value.id, resourceId)
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  const fetchResourcePrice = async (resourceId, amount = 1) => {
    try {
      error.resources = null
      // loading.resources = true
      return (await fetchBulkResourcePrices([resourceId], [amount]))[0]
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  const fetchBulkResourcePrices = async (resourceIds, amounts) => {
    try {
      error.resources = null
      // loading.resources = true
      return await getBuyPrices(activeNetwork.value.id, resourceIds, amounts)
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  const fetchLiquidityBalance = async (resourceId) => {
    try {
      error.resources = null
      // loading.resources = true
      return await getLiquidityBalance(activeNetwork.value.id, resourceId)
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  const buyTokens = async (resourceIds, resourceAmounts) => {
    try {
      error.resources = null
      // loading.resources = true
      return await sendBulkBuyResources(
        activeNetwork.value.id,
        resourceIds,
        resourceAmounts
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }
  const sellTokens = async (resourceIds, resourceAmounts) => {
    try {
      error.resources = null
      // loading.resources = true
      return await sendBulkSellResources(
        activeNetwork.value.id,
        resourceIds,
        resourceAmounts
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }
  const addLiquidity = async (
    resourceIds,
    resourceAmounts,
    currencyAmounts
  ) => {
    try {
      error.resources = null
      // loading.resources = true
      return await sendAddLiquidity(
        activeNetwork.value.id,
        resourceIds,
        resourceAmounts,
        currencyAmounts
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }
  const removeLiquidity = async (
    resourceIds,
    resourceAmounts,
    currencyAmounts
  ) => {
    try {
      error.resources = null
      // loading.resources = true
      return await sendRemoveLiquidity(
        activeNetwork.value.id,
        resourceIds,
        resourceAmounts,
        currencyAmounts
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  return {
    fetchCurrencyReserve,
    fetchResourceReserve,
    fetchLiquidityTokenSupply,
    fetchResourcePrice,
    fetchBulkResourcePrices,
    fetchLiquidityBalance,
    buyTokens,
    sellTokens,
    addLiquidity,
    removeLiquidity,
    error,
    loading,
    result,
    output,
  }
}

async function getCurrencyReserve(network, resourceId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = exchangeAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const exchange = new ethers.Contract(
    tokensAddrArr[0],
    ResourceExchangeAbi.abi,
    signer
  )

  const reserve = await exchange.getCurrencyReserves([resourceId])
  return reserve[0]
}

async function getResourceReserve(network, resourceId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const exAddr = exchangeAddress[network].allTokens[0].address
  const resourceAddr = resourceTokens[network].allTokens[0].address
  const signer = provider.getSigner()

  const resources = new ethers.Contract(
    resourceAddr,
    ResourceExchangeAbi.abi,
    signer
  )
  const reserve = await resources.balanceOf(exAddr, resourceId)
  return reserve
}

async function getLiquidityTokenSupply(network, resourceId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = exchangeAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const exchange = new ethers.Contract(
    tokensAddrArr[0],
    ResourceExchangeAbi.abi,
    signer
  )

  const supply = await exchange.getTotalSupply([resourceId])
  return supply[0]
}

async function getLiquidityBalance(network, resourceId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = exchangeAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const exchange = new ethers.Contract(
    tokensAddrArr[0],
    ResourceExchangeAbi.abi,
    signer
  )

  const liquidityBal = await exchange.balanceOf(await signer.getAddress(), [
    resourceId,
  ])
  return liquidityBal
}

async function getBuyPrices(network, resourceIds, amounts) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = exchangeAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const exchange = new ethers.Contract(
    tokensAddrArr[0],
    ResourceExchangeAbi.abi,
    signer
  )

  const prices = await exchange.getPrice_currencyToToken(resourceIds, amounts)
  return prices
}

async function validateOperation(network, lordsAmount) {
  const exAddr = exchangeAddress[network].allTokens[0].address
  const resourceAddr = resourceTokens[network].allTokens[0].address
  const lordsAddr = erc20Tokens[network].getTokenByKey('LordsToken').address
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  try {
    const resources = new ethers.Contract(
      resourceAddr,
      ResourceExchangeAbi.abi,
      signer
    )

    const lordsToken = new ethers.Contract(
      lordsAddr,
      TheLordsTokenAbi.abi,
      signer
    )

    const balance = await lordsToken.balanceOf(await signer.getAddress())
    if (balance.lt(lordsAmount)) throw new Error('INSUFFICIENT LORDS')

    const isApproved = await resources.isApprovedForAll(
      await signer.getAddress(),
      exAddr
    )

    if (!isApproved) await resources.setApprovalForAll(exAddr, true)

    const lordsAllowance = await lordsToken.allowance(
      await signer.getAddress(),
      exAddr
    )

    if (lordsAllowance.lt(lordsAmount))
      await lordsToken.approve(exAddr, lordsAmount)

    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

// MARKET OPERATIONS

async function sendBulkBuyResources(
  network,
  resourceIds,
  resourceAmounts,
  deadline = Math.floor(Date.now() / 1000) + 100000
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const exAddr = exchangeAddress[network].allTokens[0].address
  const resourceAddr = resourceTokens[network].allTokens[0].address
  const signer = provider.getSigner()

  const exchange = new ethers.Contract(exAddr, ResourceExchangeAbi.abi, signer)

  const costs = await exchange.getPrice_currencyToToken(
    resourceIds,
    resourceAmounts
  )
  const totalCost = costs.reduce((a, b) => a + b)
  await validateOperation(network, totalCost)
  await exchange.buyTokens(
    resourceIds,
    resourceAmounts,
    totalCost,
    deadline,
    await signer.getAddress()
  )
}

async function sendBulkSellResources(
  network,
  resourceIds,
  resourceAmounts,
  deadline = Math.floor(Date.now() / 1000) + 100000
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const exAddr = exchangeAddress[network].allTokens[0].address
  const resourceAddr = resourceTokens[network].allTokens[0].address
  const signer = provider.getSigner()
  const exchange = new ethers.Contract(exAddr, ResourceExchangeAbi.abi, signer)
  const prices = exchange.getPrice_tokenToCurrency(resourceIds, resourceAmounts)
  const data = getSellTokenData(await signer.getAddress(), prices, deadline)
  const resources = new ethers.Contract(
    resourceAddr,
    ResourceExchangeAbi.abi,
    signer
  )
  await resources.setApprovalForAll(exAddr, true)
  return await resources.safeBatchTransferFrom(
    await signer.getAddress(),
    exAddr,
    resourceIds,
    resourceAmounts,
    data
  )
}

async function sendAddLiquidity(
  network,
  resourceIds,
  resourceAmounts,
  currencyAmounts,
  deadline = Math.floor(Date.now() / 1000) + 100000
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const exAddr = exchangeAddress[network].allTokens[0].address
  const resourceAddr = resourceTokens[network].allTokens[0].address
  const signer = provider.getSigner()

  const data = getAddLiquidityData(currencyAmounts, deadline)

  const resources = new ethers.Contract(
    resourceAddr,
    ResourceTokensAbi.abi,
    signer
  )
  await validateOperation(
    network,
    currencyAmounts.reduce((a, b) => a + b)
  )
  await resources.setApprovalForAll(exAddr, true)
  return await resources.safeBatchTransferFrom(
    await signer.getAddress(),
    exAddr,
    resourceIds,
    resourceAmounts,
    data
  )
}

async function sendRemoveLiquidity(
  network,
  resourceIds,
  resourceAmounts,
  currencyAmounts,
  deadline = Math.floor(Date.now() / 1000) + 100000
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const exAddr = exchangeAddress[network].allTokens[0].address
  const resourceAddr = resourceTokens[network].allTokens[0].address
  const signer = provider.getSigner()

  const data = getRemoveLiquidityData(
    currencyAmounts,
    resourceAmounts,
    deadline
  )

  const exchange = new ethers.Contract(exAddr, ResourceExchangeAbi.abi, signer)
  await exchange.setApprovalForAll(exAddr, true)
  return await exchange.safeBatchTransferFrom(
    await signer.getAddress(),
    exAddr,
    resourceIds,
    resourceAmounts,
    data
  )
}
