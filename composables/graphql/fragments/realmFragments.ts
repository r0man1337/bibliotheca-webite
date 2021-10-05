import { gql } from 'graphql-request'

export const RealmFragment = gql`
  fragment RealmData on Realm {
    id
    tokenURI
  }
`
