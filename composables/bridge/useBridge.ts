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
    withdrawL2: null,
  })

  const loading = reactive({
    depositL1: null,
    withdrawL2: null,
  })
  const result = reactive({
    realmsOnL2: null,
  })

  const { times, plus, ensureValue } = useBigNumber()
  const { provider, library, account, activate } = useWeb3()
  const { networks, partnerNetwork, useL1Network, useL2Network } = useNetwork()

  const ethProvider = ref(null)
  const arbProvider = ref(null)
  const l1Signer = ref(null)
  const l2Signer = ref(null)

  const bridge = ref(null)
  const transactionCount = ref(null)

  const initBridge = async () => {
    if (!process.server) {
      console.log(useL1Network.value.url)
      console.log(useL2Network.value.url)
      console.log(window.ethereum)

      if (!activeNetwork.value.isArbitrum) {
        console.log('not arb')
        ethProvider.value = new ethers.providers.Web3Provider(window.ethereum)
        arbProvider.value = new ethers.providers.JsonRpcProvider(
          useL2Network.value.url
        )
      } else {
        ethProvider.value = new ethers.providers.JsonRpcProvider(
          useL1Network.value.url
        )
        console.log(provider.value)
        arbProvider.value = new ethers.providers.Web3Provider(provider.value)
      }

      l1Signer.value = ethProvider.value.getSigner(account.value)
      l2Signer.value = arbProvider.value.getSigner(account.value)
      console.log(l1Signer.value)
      console.log(l2Signer.value)
      bridge.value = await Bridge.init(
        l1Signer.value,
        l2Signer.value,
        RINKEBY_L1_BRIDGE_ADDRESS,
        ARB_RINKEBY_L2_BRIDGE_ADDRESS
      )
    }
  }

  const depositRealm = async (id) => {
    // eslint-disable-next-line prefer-const
    if (!process.server) {
      loadingBridge.value = true
      try {
        // Calculate the amount of data to be sent to L2 (see LootRealmsLockbox)
        console.log(l1Signer.value)
        const calldataBytes = ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256'],
          [bridge.value.l1Bridge.l1Signer._address, 1011]
        )
        const calldataBytesLength = hexDataLength(calldataBytes) + 4 // 4 bytes func identifier
        console.log(`Calldata size: ${calldataBytesLength}`)
        console.log('deposting id' + id)
        const [_submissionPriceWei, nextUpdateTimestamp] =
          await bridge.value.l2Bridge.getTxnSubmissionPrice(calldataBytesLength)
        const submissionPriceWei = _submissionPriceWei + 5
        const timeNow = Math.floor(new Date().getTime() / 1000)
        const gasPriceBid = await bridge.value.l2Provider.getGasPrice()
        console.log(submissionPriceWei)
        console.log(`L2 gas price: ${gasPriceBid.toString()}`)

        // Hardcoded for now
        const maxGas = 200000000
        // eslint-disable-next-line prettier/prettier
      const callValue = (gasPriceBid * maxGas) + parseInt(submissionPriceWei)
        console.log(`Call value to L2: ${callValue.toString()}`)

        const lootRealmsLockbox = new ethers.Contract(
          RINKEBY_L1_BRIDGE_ADDRESS,
          realmsLockBoxABI,
          l1Signer.value
        )
        const tokensArr = erc721tokens[activeNetwork.value.id].allTokens
        const tokensAddrArr = tokensArr.map((a) => a.address)

        const realmsContract = new ethers.Contract(
          tokensAddrArr[0],
          lootRealmsABI,
          l1Signer.value
        )

        const checkApproval = await realmsContract.isApprovedForAll(
          RINKEBY_L1_BRIDGE_ADDRESS,
          account.value
        )
        console.log(checkApproval)

        if (!checkApproval) {
          const approve = await realmsContract.setApprovalForAll(
            RINKEBY_L1_BRIDGE_ADDRESS,
            true
          )
          await approve.wait()
        }

        const tx = await lootRealmsLockbox.depositToL2(
          id,
          submissionPriceWei,
          maxGas,
          gasPriceBid,
          { value: callValue }
        )
        console.log(tx)

        const receipt = await tx.wait()

        const event = receipt.events[receipt.events.length - 1]
        const ticketId = event.args[0]

        const ticketIdBigNumber = ethers.BigNumber.from(ticketId.toString())

        console.log(`Ticket Id: ${ticketId}`)

        const autoRedeemHash =
          await bridge.value.calculateRetryableAutoRedeemTxnHash(
            ticketIdBigNumber
          )
        const autoRedeemRec = await arbProvider.value.getTransactionReceipt(
          autoRedeemHash
        )
        console.log(
          `AutoRedeem https://rinkeby-explorer.arbitrum.io/tx/${autoRedeemHash}`
        )
        console.log(autoRedeemRec)

        const redeemTxnHash =
          await bridge.value.calculateL2RetryableTransactionHash(
            ticketIdBigNumber
          )
        const redeemTxnRec = await arbProvider.value.getTransactionReceipt(
          redeemTxnHash
        )
        console.log(
          `RedeemTxn https://rinkeby-explorer.arbitrum.io/tx/${redeemTxnHash}`
        )
        console.log(redeemTxnRec)

        const retryableTicketHash =
          await bridge.value.calculateL2TransactionHash(ticketIdBigNumber)
        const retryableTicketRec =
          await arbProvider.value.getTransactionReceipt(retryableTicketHash)
        console.log(
          `RetryableTicket https://rinkeby-explorer.arbitrum.io/tx/${retryableTicketHash}`
        )
        console.log(retryableTicketRec)

        // Arbitrum logic for getting mapping between L1 -> L2 transactions
        const inboxSeqNums =
          (await bridge.value.getInboxSeqNumFromContractTransaction(
            receipt
          )) as any

        console.log(`Seq: ${inboxSeqNums}`)

        const ourMessagesSequenceNum = inboxSeqNums[0]

        const retryableTxnHash =
          await bridge.value.calculateL2RetryableTransactionHash(
            ourMessagesSequenceNum
          )

        console.log(`Waiting L2 tx: ${retryableTxnHash}`)

        // Wait for L2
        const retryRec = await arbProvider.value.waitForTransaction(
          retryableTxnHash
        )

        console.log(`L2 retryable txn executed: ${retryRec.transactionHash}`)
        await getUserRealms()
      } catch (e) {
        console.log(e)
      } finally {
        loadingBridge.value = false
      }
    }
  }
  const withDrawFromL2 = async (id) => {
    // eslint-disable-next-line prefer-const
    if (!process.server) {
      loadingBridge.value = true
      try {
        // Calculate the amount of data to be sent to L2 (see LootRealmsLockbox)
        console.log(l2Signer.value)
        const calldataBytes = ethers.utils.defaultAbiCoder.encode(
          ['address', 'uint256'],
          [bridge.value.l2Bridge.l2Signer._address, 1011]
        )
        const calldataBytesLength = hexDataLength(calldataBytes) + 4 // 4 bytes func identifier
        console.log(`Calldata size: ${calldataBytesLength}`)
        console.log('withdrawing id:' + id)
        const [_submissionPriceWei, nextUpdateTimestamp] =
          await bridge.value.l2Bridge.getTxnSubmissionPrice(calldataBytesLength)
        const submissionPriceWei = _submissionPriceWei + 5

        const gasPriceBid = await bridge.value.l2Provider.getGasPrice()
        console.log(submissionPriceWei)
        console.log(`L2 gas price: ${gasPriceBid.toString()}`)

        // Hardcoded for now
        const maxGas = 200000000
        // eslint-disable-next-line prettier/prettier
      const callValue = (gasPriceBid * maxGas) + parseInt(submissionPriceWei)
        console.log(`Call value to L2: ${callValue.toString()}`)

        const lootRealmsL2 = new ethers.Contract(
          ARB_RINKEBY_L2_BRIDGE_ADDRESS,
          lootRealmsL2ABI,
          l2Signer.value
        )

        const checkApproval = await lootRealmsL2.isApprovedForAll(
          ARB_RINKEBY_L2_BRIDGE_ADDRESS,
          account.value
        )
        console.log(checkApproval)

        if (!checkApproval) {
          console.log('approving')
          const approve = await lootRealmsL2.setApprovalForAll(
            ARB_RINKEBY_L2_BRIDGE_ADDRESS,
            true
          )
          await approve.wait()
        }
        console.log(lootRealmsL2)

        const tx = await lootRealmsL2.withdrawToL1(id)
        console.log(tx)

        const receipt = await tx.wait()

        const event = receipt.events[receipt.events.length - 1]
        const ticketId = event.args[0]

        const ticketIdBigNumber = ethers.BigNumber.from(ticketId.toString())

        console.log(`Ticket Id: ${ticketId}`)

        const autoRedeemHash =
          await bridge.value.calculateRetryableAutoRedeemTxnHash(
            ticketIdBigNumber
          )
        const autoRedeemRec = await arbProvider.value.getTransactionReceipt(
          autoRedeemHash
        )
        console.log(
          `AutoRedeem https://rinkeby-explorer.arbitrum.io/tx/${autoRedeemHash}`
        )
        console.log(autoRedeemRec)

        const redeemTxnHash =
          await bridge.value.calculateL2RetryableTransactionHash(
            ticketIdBigNumber
          )
        const redeemTxnRec = await arbProvider.value.getTransactionReceipt(
          redeemTxnHash
        )
        console.log(
          `RedeemTxn https://rinkeby-explorer.arbitrum.io/tx/${redeemTxnHash}`
        )
        console.log(redeemTxnRec)

        const retryableTicketHash =
          await bridge.value.calculateL2TransactionHash(ticketIdBigNumber)
        const retryableTicketRec =
          await arbProvider.value.getTransactionReceipt(retryableTicketHash)
        console.log(
          `RetryableTicket https://rinkeby-explorer.arbitrum.io/tx/${retryableTicketHash}`
        )
        console.log(retryableTicketRec)

        // Arbitrum logic for getting mapping between L1 -> L2 transactions
        const inboxSeqNums =
          (await bridge.value.getInboxSeqNumFromContractTransaction(
            receipt
          )) as any

        console.log(`Seq: ${inboxSeqNums}`)

        const ourMessagesSequenceNum = inboxSeqNums[0]

        const retryableTxnHash =
          await bridge.value.calculateL2RetryableTransactionHash(
            ourMessagesSequenceNum
          )

        console.log(`Waiting L2 tx: ${retryableTxnHash}`)

        // Wait for L2
        const retryRec = await arbProvider.value.waitForTransaction(
          retryableTxnHash
        )

        console.log(`L2 retryable txn executed: ${retryRec.transactionHash}`)
        await getUserRealms()
      } catch (e) {
        console.log(e)
      } finally {
        loadingBridge.value = false
      }
    }
  }
  const getL2Realms = async () => {
    console.log('getting l2 realms')
    const l2RealmsContract = new ethers.Contract(
      ARB_RINKEBY_L2_BRIDGE_ADDRESS,
      lootRealmsL2ABI,
      l2Signer.value
    )
    const connect = await l2RealmsContract.connect(arbProvider.value)
    // console.log(connect)
    result.realmsOnL2 = await connect.balanceOf(account.value)
    // console.log(balance)
    return result.realmsOnL2
  }

  return {
    initBridge,
    getL2Realms,
    depositRealm,
    withDrawFromL2,
    error,
    bridge,
    result,
    loading,
    partnerNetwork,
    loadingBridge,
  }
}
