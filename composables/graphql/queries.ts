import { gql } from 'graphql-request'

const usersRealms = gql`
  query usersRealms($address: String!) {
    realms(first: 100, where: { currentOwner: $address }) {
      id
      tokenURI
      currentOwner {
        address
        bagsHeld
        joined
      }
    }
  }
`
export { usersRealms }
