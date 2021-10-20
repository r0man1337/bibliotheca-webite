import { gql } from 'graphql-request'
import { WalletFragment } from './fragments/wallet'
import { RealmFragment } from './fragments/realmFragments'
import { BagFragment, defaultLoot } from './fragments/loot'
import { TreasureFragment } from './fragments/treasure'
import { ManaFragment } from './fragments/mana'
import { GAdventurerFragment } from './fragments/gadventurer'

const usersSRealms = gql`
  query usersSRealms($address: String!) {
    srealms(first: 100, where: { currentOwner: $address }) {
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
  query adventurer($address: String!) {
    wallet(id: $address) {
      id
      realmsHeld
      realms(first: 30) {
        ...RealmData
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
  usersRealms,
  mintedRealmsQuery,
  usersSRealms,
  getl1Adventurer,
  getl2Adventurer,
  lastOutboxEntryQuery,
  getWithdrawalsQuery,
  messageHasExecutedQuery,
}
