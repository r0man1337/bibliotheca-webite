import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '@instadapp/vue-web3'

// ABI
import ResourceConstructionFacetAbi from '~/abi/ResourceConstructionFacet.json'
import ResourceTokensAbi from '~/abi/ResourceTokens.json'

// ADDRESS CONSTS
import resourceTokens from '~/constant/resourceTokens'
import diamondAddress from '~/constant/diamondAddress'

export function useResources() {
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

  const fetchResource = async (account, resourceId) => {
    try {
      error.resources = null
      // loading.resources = true
      return await getResourceBalance(
        account,
        activeNetwork.value.id,
        resourceId
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }
  const fetchProductionOutput = async (realmId, resourceId) => {
    try {
      error.resources = null
      // loading.resources = true
      output.value = await resourceProductionOutput(
        account.value,
        activeNetwork.value.id,
        realmId,
        resourceId
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      // loading.resources = false
    }
  }

  const upgradeCosts = ref()
  const fetchUpgradeCost = async (resourceId, level) => {
    try {
      error.resources = null
      loading.fetchingResources = true
      upgradeCosts.value = await upgradeCost(
        account.value,
        activeNetwork.value.id,
        resourceId,
        level
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      loading.fetchingResources = false
    }
  }
  const upgradeResource = async (realmId, resourceId, level) => {
    loading.resources = true
    try {
      error.resources = null
      loading.resources = true
      await fetchUpgradeCost(resourceId, level)
      await upgradeResourceProduction(
        account.value,
        activeNetwork.value.id,
        realmId,
        resourceId,
        upgradeCosts.value[0],
        upgradeCosts.value[1]
      )
    } catch (e) {
      console.log(e)
      error.resources = e.message
    } finally {
      loading.resources = false
      await fetchProductionOutput(realmId, resourceId)
    }
  }
  return {
    fetchResource,
    fetchProductionOutput,
    upgradeResource,
    fetchUpgradeCost,
    upgradeCosts,
    error,
    loading,
    result,
    output,
  }
}

async function getResourceBalance(owner, network, resourceId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = resourceTokens[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const resources = new ethers.Contract(
    tokensAddrArr[0],
    ResourceTokensAbi.abi,
    signer
  )

  return await resources.balanceOf(owner, resourceId)
}

async function resourceProductionOutput(owner, network, realmId, resourceId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const signer = provider.getSigner()
  const resourceConstructionFacet = new ethers.Contract(
    tokensAddrArr[0],
    ResourceConstructionFacetAbi.abi,
    signer
  )

  return await resourceConstructionFacet.getProductionDetails(
    realmId,
    resourceId
  )
}

async function upgradeResourceProduction(
  owner,
  network,
  realmId,
  resourceId,
  upgradeResourceIds,
  upgradeResourceValues
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const signer = provider.getSigner()
  const resourceConstructionFacet = new ethers.Contract(
    tokensAddrArr[0],
    ResourceConstructionFacetAbi.abi,
    signer
  )
  const construct = await resourceConstructionFacet.upgradeResource(
    realmId,
    resourceId,
    upgradeResourceIds,
    upgradeResourceValues
  )
  await construct.wait()
  return construct
}

async function upgradeCost(owner, network, resourceId, level) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const signer = provider.getSigner()
  const resourceConstructionFacet = new ethers.Contract(
    tokensAddrArr[0],
    ResourceConstructionFacetAbi.abi,
    signer
  )
  return await resourceConstructionFacet.getCosts(resourceId, level)
}
