import { gql } from 'graphql-request'

export const GAdventurerFragment = gql`
  fragment GAdventurerData on GAdventurer {
    order
    orderColor
    orderCount
  }
`
