import { useModal } from '../useModal'
import Web3Connect from '~/components/modal/Web3Connect.vue'

export const useWeb3Modal = () => {
  const { showComponent } = useModal()

  return {
    open: () => showComponent(Web3Connect),
  }
}
