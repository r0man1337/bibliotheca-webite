/* eslint-disable max-depth */
import {
  computed,
  reactive,
  onMounted,
  useContext,
  ref,
  watch,
  Ref,
} from '@nuxtjs/composition-api'
import { hexDataLength } from '@ethersproject/bytes'
import { BigNumber, ethers } from 'ethers'
import { Bridge } from 'arb-ts'
import { useNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3/useWeb3'
import { useBigNumber } from '../web3/useBigNumber'
import { LootRealmsLockbox } from '~/typechain/LootRealmsLockbox'

const RINKEBY_L1_BRIDGE_ADDRESS = '0x2a8Bd12936BD5fC260314a80D51937E497523FCC'
const ARB_RINKEBY_L2_BRIDGE_ADDRESS =
  '0x5fAe6B0BE396B9541D5Cc8D50a98168b790d0d7e'
interface AppProps {
  bridge: Bridge
}

interface newProviderClass extends Ref {
  getSigner: () => string
}
const error = reactive({
  depositL1: null,
  withdrawL2: null,
})

const loading = reactive({
  depositL1: null,
  withdrawL2: null,
})
const result = reactive({
  deposit: null,
})

export function useBridge() {
  const loadingModal = ref(false)

  const { times, plus, ensureValue } = useBigNumber()
  const { provider, account, networkName, activate } = useWeb3()
  const { activeNetwork, networks } = useNetwork()

  const partnerNetwork = computed(() =>
    networks.find((n) => n.chainId === activeNetwork.value.partnerChainID)
  )
  console.log(partnerNetwork)
  console.log(account.value)
  const useL1Network = computed(() => {
    if (!activeNetwork.value.isArbitrum) {
      return activeNetwork
    } else {
      return partnerNetwork
    }
  })

  const useL2Network = computed(() => {
    if (activeNetwork.value.isArbitrum) {
      return activeNetwork
    } else {
      return partnerNetwork
    }
  })
  const ethProvider = !process.server
    ? new ethers.providers.Web3Provider(window.ethereum)
    : null
  const arbProvider = new ethers.providers.JsonRpcProvider(
    partnerNetwork.value.url
  )
  /* const l1NetworkID = useL1Network.value.chainId as string
    const l2NetworkID = useL2Network.value.chainId as string */
  // console.log(ethProvider.getSigner())
  const l1Signer = ethProvider.getSigner(account.value)
  const l2Signer = arbProvider.getSigner(account.value)

  const bridge = ref(null)
  const transactionCount = ref(null)

  const initBridge = async () => {
    bridge.value = await Bridge.init(
      l1Signer,
      l2Signer,
      RINKEBY_L1_BRIDGE_ADDRESS,
      ARB_RINKEBY_L2_BRIDGE_ADDRESS
    )
    // transactionCount.value = bridge.l2Signer.getTransactionCount()
  }
  // Calculate the amount of data to be sent to L2 (see LootRealmsLockbox)
  const calldataBytes = ethers.utils.defaultAbiCoder.encode(
    ['address', 'uint256'],
    [l1Signer._address, 1011]
  )
  const calldataBytesLength = hexDataLength(calldataBytes) + 4 // 4 bytes func identifier
  console.log(`Calldata size: ${calldataBytesLength}`)
  const submissionPriceWei = ref(null)
  const getTxnSubmissionPrice = async () => {
    submissionPriceWei.value =
      await bridge.value.l2Bridge.getTxnSubmissionPrice(calldataBytesLength)
  }

  const depositRealm = async (lootId) => {
    /*  if (!account.value) return activate()
    try {
      error.depositL1 = null
      loading.depositL1.value = true
      loadingModal.value = true
      const result.deposit = await depositToken(account.value, networkName.value, lootId)
    } catch (e) {
      error.depositL1 = e.message
    } finally {
      loading.depositL1.value = false
    } */
  }

  return {
    initBridge,
    getTxnSubmissionPrice,
    submissionPriceWei,
    depositRealm,
    error,
    bridge,
    result,
    loading,
    partnerNetwork,
    loadingModal,
  }
}
