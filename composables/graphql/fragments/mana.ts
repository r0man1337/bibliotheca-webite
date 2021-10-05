import { gql } from 'graphql-request'

export const ManaFragment = gql`
  fragment ManaData on Mana {
    id
    lootTokenId {
      id
    }
    itemName
    suffixId
    inventoryId
  }
`
