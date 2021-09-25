/* eslint-disable max-depth */
import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { hexDataLength } from '@ethersproject/bytes'
import { ethers } from 'ethers'
import { Bridge } from 'arb-ts'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3/useWeb3'
import { useBigNumber } from '../web3/useBigNumber'
import realmsLockBoxABI from '~/abi/realmsLockBox.json'
import lootRealmsABI from '~/abi/lootRealms.json'
import lootRealmsL2ABI from '~/abi/lootRealmsL2.json'
import erc721tokens from '~/constant/erc721tokens'
import { useRealms } from '~/composables/web3/useRealms'

const RINKEBY_L1_BRIDGE_ADDRESS = '0x2a8Bd12936BD5fC260314a80D51937E497523FCC'
const ARB_RINKEBY_L2_BRIDGE_ADDRESS =
  '0x5fAe6B0BE396B9541D5Cc8D50a98168b790d0d7e'
interface AppProps {
  bridge: Bridge
}

interface newProviderClass extends Ref {
  getSigner: () => string
}

export function useBridge() {
  const { getUserRealms } = useRealms()
  const loadingBridge = ref(false)
  const error = reactive({
    depositL1: null,
  })
}
