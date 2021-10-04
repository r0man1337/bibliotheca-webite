import { gql } from 'graphql-request'

const usersSRealms = gql`
  query usersSRealms($address: String!) {
    srealms(first: 100, where: { currentOwner: $address }) {
      id
    }
  }
`

const usersRealms = gql`
  query usersRealms($address: String!) {
    realms(first: 100, where: { currentOwner: $address }) {
      id
      tokenURI
      currentOwner {
        address
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
export { usersRealms, mintedRealmsQuery, usersSRealms }
