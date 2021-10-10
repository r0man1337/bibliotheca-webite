import { computed, ref } from '@nuxtjs/composition-api'
import NetworksMismatchDialog from '~/components/modal/NetworksMismatchDialog.vue'
import AssetBridgeModal from '~/components/modal/AssetBridgeModal.vue'

export type Claim = {
  title: string
  slug: string
  type: string
  status: string
  requirements: string[]
}

const claimsList: Claim[] = [
  {
    title: 'Realms',
    slug: 'realms-mint',
    type: 'Mint',
    status: 'Completed',
    requirements: null,
  },
  {
    title: 'ATIME',
    slug: 'atime-claim',
    type: 'Claim',
    status: 'Completed',
    requirements: ['Realm'],
  },
]

export function useClaims() {
  return {
    claimsList,
  }
}
