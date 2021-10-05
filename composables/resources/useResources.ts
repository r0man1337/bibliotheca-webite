import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3/useWeb3'

import ResourceTokensAbi from '~/abi/ResourceTokens.json'
import resourceTokens from '~/constant/resourceTokens'

import erc721tokens from '~/constant/erc721tokens'

export function useResources() {
  const { provider, library, account, activate } = useWeb3()
  const { networks, partnerNetwork, useL1Network, useL2Network } = useNetwork()

  const error = reactive({
    resources: null,
  })

  const loading = reactive({
    resources: null,
  })

  const result = reactive({ resources: null })

  const fetchResource = async (resourceId) => {
    try {
      error.resources = null
      loading.resources = true
      return await resource(account.value, activeNetwork.value.id, resourceId)
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      loading.resources = false
    }
  }
  return {
    fetchResource,
    error,
    loading,
    result,
  }
}

async function resource(owner, network, resourceId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = resourceTokens[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const resources = new ethers.Contract(
    tokensAddrArr[0],
    ResourceTokensAbi.abi,
    signer
  )

  return await resources.balanceOf(
    '0xc5629B92458883a2D02502E282f1C3fD71E3f802',
    resourceId
  )
}
