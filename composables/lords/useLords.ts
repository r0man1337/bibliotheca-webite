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
import GoldAbi from '~/abi/gold.json'
export function useLords() {
  const { provider, library, account, activate } = useWeb3()
  const { networks, partnerNetwork, useL1Network, useL2Network } = useNetwork()

  const error = reactive({
    lords: null,
  })

  const loading = reactive({
    lords: false,
  })

  const result = reactive({ resources: null })
  const output = ref()

  const lordsAvailableOnRealm = ref()

  const claimLords = async (realmId) => {
    try {
      error.lords = null
      loading.lords = true
      lordsAvailableOnRealm.value = await claimAllLords(
        account,
        activeNetwork.value.id,
        realmId
      )
    } catch (e) {
      console.log(e)
      if (e.data) {
        error.lords = e.data.message
      } else {
        error.lords = e.message
      }
    } finally {
      loading.lords = false
    }
  }
  const worldAge = ref()
  const getWorldAge = async (realmId) => {
    try {
      error.lords = null
      loading.lords = true
      worldAge.value = await getAge(account, activeNetwork.value.id, realmId)
    } catch (e) {
      console.log(e)
      error.lords = e.data.message
    } finally {
      loading.lords = false
    }
  }
  const lordsBalance = ref()
  const getAdventurersLords = async (account) => {
    try {
      error.lords = null
      loading.lords = true
      lordsBalance.value = await getLordsBalance(
        account,
        activeNetwork.value.id
      )
    } catch (e) {
      console.log(e)
      error.lords = e.data.message
    } finally {
      loading.lords = false
    }
  }
  const goldBalance = ref()
  const getAdventurersGold = async (account) => {
    try {
      error.lords = null
      loading.lords = true
      goldBalance.value = await getGoldBalance(account, activeNetwork.value.id)
    } catch (e) {
      console.log(e)
      error.lords = e.data.message
    } finally {
      loading.lords = false
    }
  }

  const timeNextAge = ref()
  const getTimeToNextAge = async (account) => {
    try {
      error.lords = null
      loading.lords = true
      timeNextAge.value = await timeToNextAge(activeNetwork.value.id)
    } catch (e) {
      console.log(e)
      error.lords = e.data.message
    } finally {
      loading.lords = false
    }
  }
  return {
    claimLords,
    getWorldAge,
    getAdventurersLords,
    goldBalance,
    getAdventurersGold,
    lordsBalance,
    worldAge,
    lordsAvailableOnRealm,
    getTimeToNextAge,
    timeNextAge,
    error,
    loading,
    result,
    output,
  }
}

async function claimAllLords(owner, network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const LordstokensFacet = diamondAddress[network].allTokens
  const lordstokensFacetArr = LordstokensFacet.map((a) => a.address)

  const lordsTokens = new ethers.Contract(
    lordstokensFacetArr[0],
    LordsClaimingFacetAbi.abi,
    signer
  )
  const lords = await lordsTokens.claimAllLords()
  await lords
  return lords
}

async function getAge(owner, network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const LordstokensFacet = diamondAddress[network].allTokens
  const lordstokensFacetArr = LordstokensFacet.map((a) => a.address)

  const lordsTokens = new ethers.Contract(
    lordstokensFacetArr[0],
    LordsClaimingFacetAbi.abi,
    signer
  )
  const lords = await lordsTokens.getAge()
  await lords
  return lords
}

async function getLordsBalance(owner, network) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const LordstokensFacet = lordsAddress[network].allTokens
  const lordstokensFacetArr = LordstokensFacet.map((a) => a.address)

  const lordsTokens = new ethers.Contract(
    lordstokensFacetArr[0],
    LordsTokenAbi.abi,
    signer
  )

  const lords = await lordsTokens.balanceOf(owner)

  return ethers.utils.formatEther(lords)
}
async function getGoldBalance(owner, network) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const LordstokensFacet = lordsAddress[network].allTokens
  const lordstokensFacetArr = LordstokensFacet.map((a) => a.address)

  const goldToken = new ethers.Contract(
    '0x32353A6C91143bfd6C7d363B546e62a9A2489A20',
    GoldAbi,
    signer
  )

  const lords = await goldToken.balanceOf(owner)

  return ethers.utils.formatEther(lords)
}
async function timeToNextAge(network) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const LordstokensFacet = diamondAddress[network].allTokens
  const lordstokensFacetArr = LordstokensFacet.map((a) => a.address)

  const lordsTokens = new ethers.Contract(
    lordstokensFacetArr[0],
    LordsClaimingFacetAbi.abi,
    signer
  )

  return await lordsTokens.timeToNextAge()
}
