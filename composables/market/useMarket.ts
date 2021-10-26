import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { getAddLiquidityData } from './callDataHelpers'

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

  const fetchResourceSupply = async (resourceId) => {
    try {
      error.resources = null
      // loading.resources = true
      return await getResourceSupply(activeNetwork.value.id, resourceId)
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

  const fetchResourcePrice = async (resourceId) => {
    try {
      error.resources = null
      // loading.resources = true
      const supply = await fetchResourceSupply(resourceId)
      const reserve = await fetchCurrencyReserve(resourceId)
      return await getResourcePrice(
        activeNetwork.value.id,
        resourceId,
        supply,
        reserve
      )
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

  const addLiquidity = async (resourceId) => {
    try {
      error.resources = null
      // loading.resources = true
      const supply = 100000000010000
      const reserve = 1000000000000
      return await addResourceLiquidity(
        activeNetwork.value.id,
        resourceId,
        supply,
        reserve
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  return {
    fetchResourceSupply,
    fetchCurrencyReserve,
    fetchResourcePrice,
    fetchLiquidityBalance,
    addLiquidity,
    error,
    loading,
    result,
    output,
  }
}

async function getResourceSupply(network, resourceId) {
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
  return ethers.utils.formatEther(supply[0])
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
  return ethers.utils.formatEther(reserve[0])
}

async function getResourcePrice(network, resourceId, supply, reserve) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = exchangeAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const exchange = new ethers.Contract(
    tokensAddrArr[0],
    ResourceExchangeAbi.abi,
    signer
  )

  return await exchange.getPrice_currencyToToken([resourceId], [1])
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

  const liquidityBal = await exchange.balanceOf(signer.getAddress(), [
    resourceId,
  ])
  return ethers.utils.formatEther(liquidityBal)
}

async function addResourceLiquidity(
  network,
  resourceId,
  supply,
  reserve,
  deadline = Math.floor(Date.now() / 1000) + 100000
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const exAddr = exchangeAddress[network].allTokens[0].address
  const resourceAddr = resourceTokens[network].allTokens[0].address
  const signer = provider.getSigner()

  const data = getAddLiquidityData([reserve], deadline)

  const validatedOp = await validateOperation(network, reserve)

  if (!validatedOp) return false

  const resources = new ethers.Contract(
    resourceAddr,
    ResourceExchangeAbi.abi,
    signer
  )
  return await resources.safeBatchTransferFrom(
    signer.getAddress(),
    exAddr,
    [resourceId],
    [supply],
    data
  )
}

async function validateOperation(network, lordsAmount) {
  const exAddr = exchangeAddress[network].allTokens[0].address
  const resourceAddr = resourceTokens[network].allTokens[0].address
  const lordsAddr = erc20Tokens[network].getTokenByKey('LordsToken')

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
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

    const isApproved = await resources.isApprovedForAll(
      signer.getAddress(),
      exAddr
    )
    if (!isApproved) await resources.setApprovalForAll(exAddr, true)

    const lordsAllowance = await lordsToken.allowance(
      signer.getAddress(),
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
