/* eslint-disable max-depth */
import {
  computed,
  reactive,
  onMounted,
  useContext,
  watch
} from '@nuxtjs/composition-api';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import { Network } from './useNetwork';
import { useWeb3 } from './useWeb3';
import { useBigNumber } from './useBigNumber';
import balanceABI from './abi/balance.json';
import { createTokenUtils } from '~/utils/create-token-utils';

const balances = reactive({
  user: null
});

const tokens = {
  mainnet: createTokenUtils([
    { key: 'cost', type: 'token', symbol: 'AGLD', name: 'Adventure Gold', address: '0x32353A6C91143bfd6C7d363B546e62a9A2489A20', decimals: 18, isStableCoin: false }
  ]),
};
const prices = reactive({
  mainnet: {}
});

export function useBalances() {
  const { times, plus, ensureValue } = useBigNumber();
  const { account, networkName } = useWeb3();

  const fetchBalances = async (refresh = false) => {
    console.log(networkName.value);
    if (!balances.user || refresh) {
      if (!account.value) return;
      balances.user = {
        mainnet:
          networkName.value === Network.Mainnet
            ? await getBalances(account.value, Network.Mainnet, ethers)
            : {},
      };
    }
  };

  /*
  const getBalanceByAddress = (address, network = null, type = 'dsa') => {
    return (
      balances[type]?.[network || networkName.value][address]?.balance || '0'
    );
  };

  const getBalanceByKey = (tokenKey, network = null, type = 'dsa') => {
    return getBalanceByAddress(getTokenByKey(tokenKey)?.address, network, type);
  };

  const getBalanceRawByKey = (tokenKey, network = null, type = 'dsa') => {
    return (
      balances[type]?.[network || networkName.value][
        getTokenByKey(tokenKey)?.address
      ]?.raw || '0'
    );
  };
*/
  watch(ethers, () => {
    fetchBalances(true);
  });
  return {
    balances,
    fetchBalances,

    /*  getBalanceByKey,
    getBalanceRawByKey,*/
    prices

  };
}

async function getBalances(
  owner,
  network: Network,
  ethers,
  additionalTokens = []
) {
  try {

    const tokensArr = tokens[network].allTokens;
    console.log(tokensArr);

    const tokensAddrArr = tokensArr.map(a => a.address);

    const tokenContract = new ethers.Contract(tokensAddrArr[0], balanceABI );

    const tokensAddrArrLength = tokensAddrArr.length;

    console.log(owner);
    const tokenBalances = await tokenContract.methods
      .balanceOf(owner)
      .call();
    console.log(tokenBalances);

    const tokensBalObj = new BigNumber(tokenBalances).dividedBy(10 ** tokensArr[0].decimals).toFixed();

    return tokensBalObj;
  } catch (error) {
    return Promise.reject(error);
  }
}

