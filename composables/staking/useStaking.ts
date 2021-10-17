import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '@instadapp/vue-web3'
import { useBigNumber } from '../web3/useBigNumber'
import { useRealms } from '~/composables/web3/useRealms'
import StakingFacetAbi from '~/abi/StakingFacet.json'
import lootRealmsABI from '~/abi/lootRealms.json'
import SRealmTokenABI from '~/abi/SRealmToken.json'
import diamondAddress from '~/constant/diamondAddress'

import erc721tokens from '~/constant/erc721tokens'
import sRealmsTokens from '~/constant/sRealmsTokens'
export function useStaking() {
  const { account } = useWeb3()
  const error = reactive({
    stake: null,
  })

  const loading = reactive({
    stake: null,
  })
  const result = reactive({ stake: null })
  const balance = ref()
  const claimBalance = ref()
  const stakeRealm = async (realmId) => {
    try {
      error.stake = null
      loading.stake = true
      await setApprovalForAll(activeNetwork.value.id)
      result.stake = await stake(account.value, activeNetwork.value.id, realmId)
    } catch (e) {
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const getRealmsResourceBalance = async (realmId) => {
    try {
      error.stake = null
      loading.stake = true
      balance.value = await getBalance(activeNetwork.value.id, realmId)
    } catch (e) {
      console.log(e)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }

  const claimResources = async (realmId) => {
    try {
      error.stake = null
      loading.stake = true
      claimBalance.value = await claim(activeNetwork.value.id, realmId)
    } catch (e) {
      console.log(e)
      error.stake = e.data.message
    } finally {
      await getRealmsResourceBalance(realmId)
      loading.stake = false
    }
  }
  const getRealmsResourceIds = async (realmId) => {
    try {
      error.stake = null
      loading.stake = true
      return await getResourceIds(activeNetwork.value.id, realmId)
    } catch (e) {
      console.log(e)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }
  const withdraw = async (realmId) => {
    try {
      error.stake = null
      loading.stake = true
      await setApprovalForAllSRealms(activeNetwork.value.id)
      return await unStakeAndExit(activeNetwork.value.id, realmId)
    } catch (e) {
      console.log(e)
      error.stake = e.message
    } finally {
      loading.stake = false
    }
  }
  return {
    stakeRealm,
    getRealmsResourceIds,
    getRealmsResourceBalance,
    claimResources,
    claimBalance,
    balance,
    error,
    loading,
    result,
    withdraw,
  }
}

async function stake(owner, network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    StakingFacetAbi.abi,
    signer
  )
  console.log(resourceStakingFacet)
  const stake = await resourceStakingFacet.stakeRealm(realmId, true)
  await stake.wait()

  return stake
}
// TODO: make generic
async function setApprovalForAll(network) {
  const tokensArr = diamondAddress[network].allTokens
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const realmsTokensArr = erc721tokens[network].allTokens
  const signer = provider.getSigner()
  const realmsTokensAddrArr = realmsTokensArr.map((a) => a.address)
  const realmsContract = new ethers.Contract(
    realmsTokensAddrArr[0],
    lootRealmsABI,
    signer
  )
  const approve = await realmsContract.setApprovalForAll(tokensAddrArr[0], true)
  await approve.wait()
  return approve
}
// TODO: make generic
async function setApprovalForAllSRealms(network) {
  const tokensArr = diamondAddress[network].allTokens
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const sRealmTokenArr = sRealmsTokens[network].allTokens
  const signer = provider.getSigner()
  const sRealmsTokensAddrArr = sRealmTokenArr.map((a) => a.address)
  const realmsContract = new ethers.Contract(
    sRealmsTokensAddrArr[0],
    SRealmTokenABI.abi,
    signer
  )
  const approve = await realmsContract.setApprovalForAll(tokensAddrArr[0], true)
  await approve.wait()
  return approve
}

async function getBalance(network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    StakingFacetAbi.abi,
    signer
  )
  const day = await resourceStakingFacet.getVestingTime(realmId)
  const month = await resourceStakingFacet.get30DayVestingTime(realmId)
  const name = await resourceStakingFacet.getName(realmId)
  const resources = {
    day,
    month,
    name,
  }
  return resources
}

async function claim(network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    StakingFacetAbi.abi,
    signer
  )

  const withdraw = await resourceStakingFacet.withdrawResources(realmId, '0x')
  await withdraw.wait()

  return withdraw
}

async function getResourceIds(network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    StakingFacetAbi.abi,
    signer
  )

  return await resourceStakingFacet.getResourceIds(realmId)
}

async function unStakeAndExit(network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    StakingFacetAbi.abi,
    signer
  )
  console.log(resourceStakingFacet)
  const withdraw = await resourceStakingFacet.unstakeAndExit(realmId)

  await withdraw.wait()

  return withdraw
}
