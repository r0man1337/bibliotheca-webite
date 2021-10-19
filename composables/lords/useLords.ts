import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3'
import { ageDistributions } from '../lordsTokenDistribution'
// ABI
import ResourceConstructionFacetAbi from '~/abi/ResourceConstructionFacet.json'
import LordsClaimingFacetAbi from '~/abi/LordsClaimingFacet.json'
import LordsTokenAbi from '~/abi/TheLordsToken.json'
import SRealmTokenAbi from '~/abi/SRealmToken.json'
import StakingFacetAbi from '~/abi/StakingFacet.json'

// ADDRESS CONSTS
import resourceTokens from '~/constant/resourceTokens'
import diamondAddress from '~/constant/diamondAddress'
import lordsAddress from '~/constant/erc20Tokens'
import sRealmsToken from '~/constant/sRealmsTokens'

export function useLords() {
  const { provider, library, account, activate } = useWeb3()
  const { networks, partnerNetwork, useL1Network, useL2Network } = useNetwork()

  const error = reactive({
    resources: null,
  })

  const loading = reactive({
    resources: false,
  })

  const result = reactive({ resources: null })
  const output = ref()

  const lordsAvailableOnRealm = ref()

  const getAvailableLords = async (realmId) => {
    try {
      error.resources = null
      // loading.resources = true
      lordsAvailableOnRealm.value = await getLordsBalanceOnRealm(
        account,
        activeNetwork.value.id,
        realmId
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  return {
    getAvailableLords,
    lordsAvailableOnRealm,
    error,
    loading,
    result,
    output,
  }
}

async function getLordsBalanceOnRealm(owner, network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  // SRealms Token
  const tokensArr = sRealmsToken[network].allTokens
  const tokensAddrArr = tokensArr.map((a) => a.address)
  console.log(tokensAddrArr[0])

  const sRealm = new ethers.Contract(
    tokensAddrArr[0],
    LordsClaimingFacetAbi.abi,
    signer
  )
  // sRealms
  const totalSRealms = await sRealm.balanceOf(owner)
  console.log(totalSRealms)

  const LordstokensFacet = diamondAddress[network].allTokens
  const lordstokensFacetArr = LordstokensFacet.map((a) => a.address)

  const lordsTokens = new ethers.Contract(
    lordstokensFacetArr[0],
    LordsClaimingFacetAbi.abi,
    signer
  )
  const getCurrentAge = await lordsTokens.getAge()
  console.log(getCurrentAge)
}
