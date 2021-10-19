import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3/useWeb3'
import { useBigNumber } from '../web3/useBigNumber'
import { useRealms } from '~/composables/web3/useRealms'
import StakingFacetAbi from '~/abi/StakingFacet.json'
import lootRealmsABI from '~/abi/lootRealms.json'
import SRealmTokenABI from '~/abi/SRealmToken.json'
import diamondAddress from '~/constant/diamondAddress'

import erc721tokens from '~/constant/erc721tokens'
import sRealmsTokens from '~/constant/sRealmsTokens'
export function useStatistics() {
  const { account } = useWeb3()
  const error = reactive({
    stake: null,
  })

  const loading = reactive({
    stake: null,
  })

  const happiness = ref()

  const getHappiness = async (realmId) => {
    try {
      error.stake = null
      loading.stake = true
      happiness.value = await getRealmHappiness(activeNetwork.value.id, realmId)
    } catch (e) {
      console.log(e)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }
  const realmStatistics = ref()
  const getStatistics = async (realmId) => {
    try {
      error.stake = null
      loading.stake = true
      realmStatistics.value = await getAllStatistics(
        activeNetwork.value.id,
        realmId
      )
    } catch (e) {
      console.log(e)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }
  return {
    getHappiness,
    getStatistics,
    realmStatistics,
    happiness,
    error,
    loading,
  }
}

async function getRealmHappiness(network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    StakingFacetAbi.abi,
    signer
  )

  return await resourceStakingFacet.getHappiness(realmId)
}

async function getAllStatistics(network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    StakingFacetAbi.abi,
    signer
  )

  return await resourceStakingFacet.getAllStatistics(realmId)
}
