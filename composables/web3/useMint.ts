/* eslint-disable max-depth */
import {
  computed,
  reactive,
  onMounted,
  useContext,
  ref,
  watch
} from '@nuxtjs/composition-api';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Network } from './useNetwork';
import { useWeb3 } from './useWeb3';
import { useBigNumber } from './useBigNumber';
import realmsABI from './abi/lootRealms.json';
import { createTokenUtils } from '~/utils/create-token-utils';

const error = reactive({
  mint: null
});

const erc721tokens = {
  mainnet: createTokenUtils([
    { key: 'LootRealms', type: 'token', symbol: 'LootRealms', name: 'Realms (for Adventurers)', address: '0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d' }
  ]),
  rinkeby: createTokenUtils([
    { key: 'LootRealms', type: 'token', symbol: 'LootRealms', name: 'Realms (for Adventurers)', address: '0x6B13F1C319c2DdA7Ae15c04f540671B8A0E2AE9B' }
  ]),
};
const result = reactive({ mint: null });

const tokenIds = ref(null);

export function useMint() {
  const loading = ref(false)
  const loadingModal = ref(false)
  const { times, plus, ensureValue } = useBigNumber();
  const { ethersProviders, account, networkName, activate } = useWeb3();

  const mint = async (lootId) => {
    if (!account.value) return activate();
    try {
      error.mint = null
      loading.value = true
      loadingModal.value = true
      result.mint = await mintToken(account.value, networkName.value, lootId)
    } catch (e) {
      error.mint = e.message
    } finally {
      loading.value = false
    }
  };

  const multiMint = async (lootIds) => {
    if (!account.value) return activate();

    try {
      error.mint = null
      loadingModal.value = true
      loading.value = true
      result.mint = await multiMintToken(account.value, networkName.value, lootIds)
    } catch (e) {
      console.log(e)
      error.mint = e.message
    } finally {
      loading.value = false
    }
  };

  const ids = async () => {
    if (!account.value) return;

    try {
      error.mint = null
      tokenIds.value = await checkTokenMint(networkName.value)
      console.log(tokenIds.value)
    } catch (e) {
      error.mint = e.parse()
      console.log(e)
    } finally {
      loading.value = false
    }
  };



  return {
    mint,
    multiMint,
    error,
    result,
    loading,
    loadingModal,
    ids
  };
}

async function mintToken(
  owner,
  network: Network,
  lootId
) {

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = erc721tokens[network].allTokens;
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map(a => a.address);

  const tokenContract = new ethers.Contract(tokensAddrArr[0], realmsABI, signer);
  console.log(tokensAddrArr)
  console.log(owner);
  const overrides = {
    // To convert Ether to Wei:
    value: ethers.utils.parseEther("0.1")
  }
  const mint = await tokenContract.mint(lootId, overrides)
  await mint.wait();

  return mint;
}

async function multiMintToken(
  owner,
  network: Network,
  lootIds
) {


  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = erc721tokens[network].allTokens;
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map(a => a.address);

  const tokenContract = new ethers.Contract(tokensAddrArr[0], realmsABI, signer);

  const wei = 0.1 * lootIds.length
  const overrides = {
    // To convert Ether to Wei:
    value: ethers.utils.parseEther(wei.toString())
  }
  console.log()
  const mint = await tokenContract.multiMint(lootIds, overrides)
  await mint.wait();

  return mint;

}

async function checkTokenMint(
  network: Network
) {
  try {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const tokensArr = erc721tokens[network].allTokens;
    const signer = provider.getSigner()
    const tokensAddrArr = tokensArr.map(a => a.address);
    const tokenContract = new ethers.Contract(tokensAddrArr[0], realmsABI, signer);

    const ids = []

    for (let step = 1; step < 8000; step++) {
      const mint = await tokenContract.tokenByIndex(step.toString())

      await mint.wait();

      if (mint) {
        console.log(step)
        ids.push(step)
      }

    }
    console.log(ids)

    return ids;
  } catch (e) {
    error.mint = e
  }
}  