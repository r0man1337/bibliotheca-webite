/* eslint-disable max-depth */
import {
  computed,
  reactive,
  onMounted,
  useContext,
  ref,
  watch,
} from '@nuxtjs/composition-api'

import { BigNumber, ethers } from 'ethers'
import { Bridge } from 'arb-ts'
import { Network } from './useNetwork'
import { useWeb3 } from './useWeb3'
import { useBigNumber } from './useBigNumber'
import { LootRealmsLockbox } from '~/typechain/LootRealmsLockbox'

const RINKEBY_L1_BRIDGE_ADDRESS = '0x2a8Bd12936BD5fC260314a80D51937E497523FCC'
const ARB_RINKEBY_L2_BRIDGE_ADDRESS =
  '0x5fAe6B0BE396B9541D5Cc8D50a98168b790d0d7e'
interface AppProps {
  bridge: Bridge
}

const error = reactive({
  depositL1: null,
  withdrawL2: null,
})

const loading = reactive({
  depositL1: null,
  withdrawL2: null,
})

export function useBridge() {
  const loadingModal = ref(false)

  const l1Signer = ethProvider.getSigner(0)
  const l2Signer = arbProvider.getSigner(window.ethereum?.selectedAddress)
  const bridge = Bridge.init(
    l1Signer,
    l2Signer,
    RINKEBY_L1_BRIDGE_ADDRESS,
    ARB_RINKEBY_L2_BRIDGE_ADDRESS
  )
  const { times, plus, ensureValue } = useBigNumber()
  const { ethersProviders, account, networkName, activate } = useWeb3()

  const ethProvider = ethersProviders
  const arbProvider = new ethers.providers.JsonRpcProvider(partnerNetwork.url)
  const l1NetworkID = useL1Network().chainID as string
  const l2NetworkID = useL2Network().chainID as string

  const deposit = async (lootId) => {
    if (!account.value) return activate()
    try {
      error.depositL1 = null
      loading.depositL1.value = true
      loadingModal.value = true
      result.mint = await depositToken(account.value, networkName.value, lootId)
    } catch (e) {
      error.depositL1 = e.message
    } finally {
      loading.depositL1.value = false
    }
  }

  const multiMint = async (lootIds) => {
    if (!account.value) return activate()

    try {
      error.mint = null
      loadingModal.value = true
      loading.value = true
      result.mint = await multiMintToken(
        account.value,
        networkName.value,
        lootIds
      )
    } catch (e) {
      console.log(e)
      error.mint = e.message
    } finally {
      loading.value = false
    }
  }

  const ids = async () => {
    if (!account.value) return
    console.log('2')
    try {
      error.mint = null
      tokenIds.value = await checkTokenMint(networkName.value)
      console.log(tokenIds)
    } catch (e) {
      error.mint = e.parse()
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  return {
    mint,
    multiMint,
    error,
    result,
    loading,
    loadingModal,
    ids,
  }
}

async function mintToken(owner, network: Network, lootId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = erc721tokens[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const tokenContract = new ethers.Contract(tokensAddrArr[0], realmsABI, signer)
  console.log(tokensAddrArr)
  console.log(owner)
  const overrides = {
    // To convert Ether to Wei:
    value: ethers.utils.parseEther('0.1'),
  }
  const mint = await tokenContract.mint(lootId, overrides)
  await mint.wait()

  return mint
}

async function multiMintToken(owner, network: Network, lootIds) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = erc721tokens[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const tokenContract = new ethers.Contract(tokensAddrArr[0], realmsABI, signer)

  const wei = 0.1 * lootIds.length
  const overrides = {
    // To convert Ether to Wei:
    value: ethers.utils.parseEther(wei.toString()),
  }
  console.log()
  const mint = await tokenContract.multiMint(lootIds, overrides)
  await mint.wait()

  return mint
}

async function checkTokenMint(network: Network) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const tokensArr = erc721tokens[network].allTokens
    const signer = provider.getSigner()
    const tokensAddrArr = tokensArr.map((a) => a.address)
    const tokenContract = new ethers.Contract(
      tokensAddrArr[0],
      realmsABI,
      signer
    )

    const ids = []
    for (let counter = 1; counter < 100; counter++) {
      const mint = await tokenContract.ownerOf(counter)
      console.log(mint)
      // await mint.wait()
    }
    console.log(ids)

    return ids
  } catch (e) {
    error.mint = e
  }
}
