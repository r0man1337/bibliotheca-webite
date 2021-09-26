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
import { useNetwork, activeNetwork } from './useNetwork'
import { useWeb3 } from './useWeb3'
import { useGraph } from './useGraph'
import { useBigNumber } from './useBigNumber'
import { mintedRealmsQuery } from './../graphql/queries'
import realmsABI from '~/abi/lootRealms.json'
import erc721tokens from '~/constant/erc721tokens'
import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'

const error = reactive({
  mint: null,
})

const result = reactive({ mint: null })

const availableTokenIds = ref(null)

export function useMint() {
  const loading = reactive({
    mint: false,
    getAvailableTokenIds: false,
  })
  const loadingModal = ref(false)
  const { times, plus, ensureValue } = useBigNumber()
  const { provider, account, activate } = useWeb3()
  const { open } = useWeb3Modal()
  const { gqlRequest } = useGraph()
  const mintedRealmIds = ref([])

  const flatObject = (arr) => {
    const flatArray = []
    for (let i = 0; i < arr.length; i++) {
      console.log(typeof arr[i].id)
      flatArray[i] = parseInt(arr[i].id)
    }
    return flatArray
  }

  const checkTokenMint = async () => {
    let lastFetchedId = '0'
    let mintedRealms = []
    for (let i = 0; i < 8; i++) {
      try {
        const { realms } = await gqlRequest(
          mintedRealmsQuery,
          { lastID: lastFetchedId },
          activeNetwork.value.id
        )
        lastFetchedId = realms[realms.length - 1].id
        mintedRealms = [...mintedRealms, ...realms]
      } catch (e) {
        console.log('all fetched')
      }
    }
    return flatObject(mintedRealms).sort(function (a, b) {
      return a - b
    })
  }

  const { useL1Network, useL2Network } = useNetwork()
  const mint = async (lootId) => {
    if (!account.value) return open()
    try {
      error.mint = null
      loading.mint = true
      loadingModal.value = true
      result.mint = await mintToken(
        account.value,
        activeNetwork.value.id,
        lootId
      )
    } catch (e) {
      error.mint = e.message
    } finally {
      loading.mint = false
      await getAvailableTokenIds()
    }
  }

  const multiMint = async (lootIds) => {
    if (!account.value) return open()

    try {
      error.mint = null
      loadingModal.value = true
      loading.mint = true
      result.mint = await multiMintToken(
        account.value,
        activeNetwork.value.id,
        lootIds
      )
    } catch (e) {
      console.log(e)
      error.mint = e.message
    } finally {
      loading.mint = false
      await getAvailableTokenIds()
    }
  }
  const findMissing = (num) => {
    const max = Math.max(...num) // Will find highest number
    const min = Math.min(...num) // Will find lowest number
    const missing = []

    for (let i = min; i <= max; i++) {
      if (!num.includes(i)) {
        // Checking whether i(current value) present in num(argument)
        missing.push(i) // Adding numbers which are not in num(argument) array
      }
    }
    return missing
  }

  const getAvailableTokenIds = async () => {
    console.log('2')
    try {
      loading.getAvailableTokenIds = true
      error.mint = null
      const mintedTokens = await checkTokenMint()
      availableTokenIds.value = findMissing(mintedTokens)
    } catch (e) {
      error.mint = e
      console.log(e)
    } finally {
      loading.getAvailableTokenIds = false
    }
    return availableTokenIds.value
  }

  return {
    mint,
    multiMint,
    error,
    result,
    loading,
    loadingModal,
    mintedRealmIds,
    availableTokenIds,
    getAvailableTokenIds,
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

/* function checkTokenMint(network) {
  try {
    const provider = new ethers.providers.JsonRpcProvider(network.url)
    console.log(provider)
    const tokensArr = erc721tokens[network.id].allTokens
    const signer = provider.getSigner()
    const tokensAddrArr = tokensArr.map((a) => a.address)
    const tokenContract = new ethers.Contract(
      tokensAddrArr[0],
      realmsABI,
      signer
    )
    const ids = []
    Promise.all(
      Array.from(Array(8000)).map(async (_, i) => {
        try {
          const owner = await tokenContract.ownerOf(i)
          if (owner) {
            ids.push(i)
          }
        } catch (e) {}
      })
    ).then((values) => {
      console.log(ids)
      console.log('promise all ends')
      return ids
    })
  } catch (e) {
    error.mint = e
  }
} */
