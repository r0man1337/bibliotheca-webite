import { gql } from 'graphql-request'
import { WalletFragment } from './fragments/wallet'
import { RealmFragment, SRealmFragment } from './fragments/realmFragments'
import { BagFragment, defaultLoot } from './fragments/loot'
import { TreasureFragment } from './fragments/treasure'
import { ManaFragment } from './fragments/mana'
import { GAdventurerFragment } from './fragments/gadventurer'

const getSRealmsQuery = gql`
  query getSRealms(
    $address: String
    $resources: [Int]
    $first: Int
    $skip: Int
  ) {
    srealms(
      first: $first
      where: {
        currentOwner_contains: $address
        currentOwner_not: "0x0000000000000000000000000000000000000000"
        resourceIds_contains: $resources
      }
      skip: $skip
    ) {
      id
      ageSettled
      ageClaimed
      name
      resources {
        id
        resource {
          name
        }
        level
        resourceUpgrades {
          id
        }
      }
      wonder
      order
      traits {
        name
        value
        buildings {
          name
          value
          buildingUpgrades {
            id
            address {
              id
            }
          }
        }
      }
      currentOwner {
        id
        address
      }
    }
  }
`
const getRealms = gql`
  query usersRealms($address: String) {
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
const getResourceListQuery = gql`
  query getResourceListQuery {
    resources(first: 25) {
      id
      name
      stakedRealms
      totalRealms
    }
  }
`
const getl1Adventurer = gql`
  ${WalletFragment}
  ${RealmFragment}
  ${BagFragment}
  ${TreasureFragment}
  ${defaultLoot}
  ${ManaFragment}
  ${GAdventurerFragment}

  query getAdventurer($address: String!) {
    wallet(id: $address) {
      id
      realmsHeld
      realms(first: 30) {
        ...RealmData
      }
      bagsHeld
      bags(first: 30) {
        ...BagData
      }
      treasuresHeld
      treasures(first: 30) {
        ...TreasureData
      }
      mLootsHeld
      mLoot(first: 30) {
        id
        head
        neck
        chest
        hand
        ring
        weapon
        waist
        foot
      }
      manasHeld
      manas(first: 30) {
        ...ManaData
      }
      gAdventurers(first: 30) {
        ...DefaultBagData
        ...GAdventurerData
      }
    }
  }
`
const getl2Adventurer = gql`
  ${RealmFragment}
  ${SRealmFragment}
  query adventurer($address: String!) {
    wallet(id: $address) {
      id
      realmsHeld
      realms(first: 30) {
        ...RealmData
      }
      srealmsHeld
      srealms(first: 30) {
        ...SRealmData
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
const lastOutboxEntryQuery = gql`
  query lastOutboxEntry {
    outboxEntries(orderBy: outboxEntryIndex, orderDirection: desc, first: 1) {
      outboxEntryIndex
    }
  }
`
const getWithdrawalsQuery = gql`
  query getWithdrawalsQuery($sender: String, $fromBlock: Int, $toBlock: Int) {
    withdrawals(
      where: {
        from: $sender
        l2BlockNum_gte: $fromBlock
        l2BlockNum_lt: $toBlock
      }
      orderBy: l2BlockNum
      orderDirection: desc
    ) {
      l2ToL1Event {
        id
        caller
        destination
        batchNumber
        indexInBatch
        arbBlockNum
        ethBlockNum
        timestamp
        callvalue
        data
      }
      realmId
    }
  }
`
const messageHasExecutedQuery = gql`
  query messageHasExecutedQuery(
    $path: Int
    batchHexString: String
  ) {
    outboxOutputs(where: {path: $path, outboxEntry: $batchHexString, spent:true }) {
      id,
    }
  }
`
export {
  getRealms,
  mintedRealmsQuery,
  getSRealmsQuery,
  getl1Adventurer,
  getl2Adventurer,
  lastOutboxEntryQuery,
  getWithdrawalsQuery,
  messageHasExecutedQuery,
  getResourceListQuery,
}
