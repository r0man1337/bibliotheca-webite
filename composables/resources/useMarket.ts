import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useWeb3 } from '@instadapp/vue-web3'
import { useNetwork, activeNetwork } from '../web3/useNetwork'

// ABI
import ResourceTokensAbi from '~/abi/ResourceTokens.json'
import ResourceExchangeAbi from '~/abi/NiftyswapExchange20.json'

// ADDRESS CONSTS
import exchangeAddress from '~/constant/exchangeAddress'
import resourceTokens from '~/constant/resourceTokens'

export function useMarket() {
  const { provider, library, account, activate } = useWeb3()
  const { networks, partnerNetwork, useL1Network, useL2Network } = useNetwork()

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

  return {
    fetchResourceSupply,
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

  return await exchange.getTotalSupply([resourceId])
}

async function getCurrencyReserves(network, resourceId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = exchangeAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const exchange = new ethers.Contract(
    tokensAddrArr[0],
    ResourceExchangeAbi.abi,
    signer
  )

  return await exchange.getCurrencyReserves([resourceId])
}
