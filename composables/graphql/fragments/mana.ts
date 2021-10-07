import { gql } from 'graphql-request'

export const ManaFragment = gql`
  fragment ManaData on Mana {
    id
    itemName
    suffixId
    inventoryId
  }
`
