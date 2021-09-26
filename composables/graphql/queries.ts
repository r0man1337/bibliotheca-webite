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
const mintedRealmsQuery = gql`
  query mintedRealmsQuery($lastID: String) {
    realms(
      first: 1000
      where: { id_gt: $lastID }
      orderBy: id
      orderDirection: asc
    ) {
      id
    }
  }
`
export { usersRealms, mintedRealmsQuery }
