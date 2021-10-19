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
    requirements: ['N/A'],
  },
  {
    title: '$ATIME',
    slug: 'atime-claim',
    type: 'Claim',
    status: 'Available',
    requirements: ['Realm'],
  },
]

export function useClaims() {
  return {
    claimsList,
  }
}
