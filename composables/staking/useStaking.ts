import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { BigNumber, ethers } from 'ethers'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3/useWeb3'
import { useBigNumber } from '../web3/useBigNumber'
import { useRealms } from '~/composables/web3/useRealms'
import ResourceStakingFacet from '~/abi/ResourceStakingFacet.json'
import lootRealmsABI from '~/abi/lootRealms.json'
import diamondAddress from '~/constant/diamondAddress'

import erc721tokens from '~/constant/erc721tokens'
export function useStaking() {
  const { provider, library, account, activate } = useWeb3()
  const { intRoundFloor } = useBigNumber()
  const { networks, partnerNetwork, useL1Network, useL2Network } = useNetwork()
  const error = reactive({
    stake: null,
  })

  const loading = reactive({
    stake: null,
  })
  const result = reactive({ stake: null })
  const realmBalance = ref()
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
      return await getBalance(activeNetwork.value.id, realmId)
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
      error.stake = e.message
    } finally {
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
  return {
    stakeRealm,
    getRealmsResourceIds,
    getRealmsResourceBalance,
    claimResources,
    claimBalance,
    realmBalance,
    error,
    loading,
    result,
  }
}

async function stake(owner, network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    ResourceStakingFacet.abi,
    signer
  )

  const stake = await resourceStakingFacet.stakeRealm(realmId, true)
  await stake.wait()

  return stake
}

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

  // const checkApproval = await realmsContract.isApprovedForAll(
  //   account.value,
  //   RINKEBY_L1_BRIDGE_ADDRESS
  // )
  // console.log(checkApproval)

  // if (!checkApproval) {
  const approve = await realmsContract.setApprovalForAll(tokensAddrArr[0], true)
  await approve.wait()
  // }

  return approve
}

async function getBalance(network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    ResourceStakingFacet.abi,
    signer
  )
  return await resourceStakingFacet.getVestingTime(realmId)
}

async function claim(network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const resourceStakingFacet = new ethers.Contract(
    tokensAddrArr[0],
    ResourceStakingFacet.abi,
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
    ResourceStakingFacet.abi,
    signer
  )

  return await resourceStakingFacet.getResourceIds(realmId)
}
