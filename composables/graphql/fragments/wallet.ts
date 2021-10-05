import { gql } from 'graphql-request'

export const WalletFragment = gql`
  fragment WalletData on Wallet {
    realmsHeld
    bagsHeld
    treasuresHeld
    manasHeld
  }
`
