/* eslint-disable max-depth */
import {
  computed,
  reactive,
  onMounted,
  useContext,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Network, activeNetwork } from './useNetwork'
import { useWeb3 } from './useWeb3'
import { useBigNumber } from './useBigNumber'
import realmsABI from '~/abi/lootRealms.json'
import erc721tokens from '~/constant/erc721tokens'
import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'

const error = reactive({
  mint: null,
})

const result = reactive({ mint: null })

const tokenIds = ref(null)

export function useMint() {
  const loading = ref(false)
  const loadingModal = ref(false)
  const { times, plus, ensureValue } = useBigNumber()
  const { provider, account, activate } = useWeb3()
  const { open } = useWeb3Modal()

  const mint = async (lootId) => {
    if (!account.value) return open()
    try {
      error.mint = null
      loading.value = true
      loadingModal.value = true
      result.mint = await mintToken(
        account.value,
        activeNetwork.value.id,
        lootId
      )
    } catch (e) {
      error.mint = e.message
    } finally {
      loading.value = false
    }
  }

  const multiMint = async (lootIds) => {
    if (!account.value) return open()

    try {
      error.mint = null
      loadingModal.value = true
      loading.value = true
      result.mint = await multiMintToken(
        account.value,
        activeNetwork.value.id,
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
      tokenIds.value = await checkTokenMint(activeNetwork.value.id)
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

async function mintToken(owner, network, lootId) {
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

async function multiMintToken(owner, network, lootIds) {
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

async function checkTokenMint(network) {
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
