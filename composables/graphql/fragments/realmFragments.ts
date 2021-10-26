import { gql } from 'graphql-request'

export const RealmFragment = gql`
  fragment RealmData on Realm {
    id
    tokenURI
  }
`
export const SRealmFragment = gql`
  fragment SRealmData on SRealm {
    id
    ageSettled
    ageClaimed
    name
    regions
    cities
    harbors
    rivers
    resources
    wonder
    order
  }
`
