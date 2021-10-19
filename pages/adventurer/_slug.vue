<template>
  <section>
    <h4 class="text-gray-400">adventurer</h4>
    <h1>{{ shortenHash(slug) }}</h1>
    <div v-if="!$fetchState.pending && !adventurer.wallet">
      No Loot or Derivatives for this adventurer... yet.
    </div>
    <div v-else-if="!$fetchState.pending && adventurer.wallet">
      <h3>
        <span class="text-2xl">
          <span v-if="usersGold" class="text-yellow-400">{{ usersGold }}</span>
          <span v-else>...</span>
          Adventurers Gold</span
        >
        <br />
        <span class="text-xl text-gray-400"
          >${{
            (usersGold * goldPrice)
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }}
          USD
        </span>
      </h3>
      <div
        class="
          bg-black
          sticky
          top-10
          z-10
          rounded
          px-4
          py-2
          space-x-6
          border-gray-800
          w-auto
          border
          shadow-xl
        "
      >
        <a
          v-if="adventurer.wallet.bagsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#loot"
          >Loot: {{ adventurer.wallet.bagsHeld }}
        </a>
        <a
          v-if="adventurer.wallet.realmsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#realms"
          >Realms: {{ adventurer.wallet.realmsHeld }}</a
        >
        <a
          v-if="adventurer.wallet.manasHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#mana"
          >mana: {{ adventurer.wallet.manasHeld }}</a
        >
        <a
          v-if="adventurer.wallet.gAdventurersHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#ga"
          >Genesis Adventurers: {{ adventurer.wallet.gAdventurersHeld }}</a
        >
        <a
          v-if="adventurer.wallet.mLootsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#mloot"
          >mLoot: {{ adventurer.wallet.mLootsHeld }}</a
        >
      </div>
      <div v-if="adventurer.bags.length" id="loot">
        <h3 class="mt-8">Loot: {{ adventurer.wallet.bagsHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div
            v-for="(loot, index) in adventurer.bags"
            :key="index"
            class="w-80"
          >
            <LootCard is-o-g :loot="loot" />
          </div>
        </div>
      </div>

      <div v-if="adventurer.realms.length" id="realms">
        <hr />
        <div v-if="openSeaData.length">
          <h3 class="mt-8">Realms: {{ adventurer.wallet.realmsHeld }}</h3>
          <div class="flex flex-wrap w-full">
            <div v-for="realm in sortedRealms" :key="realm.id" class="w-80">
              <RealmCard :id="realm.token_id" :realm="realm" />
            </div>
          </div>
        </div>
        <div v-else class="flex flex-wrap mt-4">
          <Loader v-for="(loader, index) in 4" :key="index" class="mr-3 mb-3" />
        </div>
      </div>
      <div v-if="adventurer.gadventurers.length" id="ga">
        <hr />
        <h3 class="mt-8">
          Genesis Adventurers: {{ adventurer.wallet.gAdventurersHeld }}
        </h3>
        <div class="flex flex-wrap w-full">
          <div
            v-for="loot in adventurer.gadventurers"
            :key="loot.id"
            class="w-96"
          >
            <GACard :loot="loot" />
          </div>
        </div>
      </div>
      <div v-if="adventurer.manas.length" id="mana">
        <hr />
        <h3 class="mt-8">Mana: {{ adventurer.manas.length }}</h3>
        <div class="flex flex-wrap w-full">
          <div
            v-for="(mana, index) in adventurer.manas"
            :key="index"
            class="w-80"
          >
            <ManaCard :mana="mana" />
          </div>
        </div>
      </div>

      <div v-if="adventurer.mloots.length" id="mloot">
        <hr />
        <h3 class="mt-8">mLoot: {{ adventurer.wallet.mLootsHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="loot in adventurer.mloots" :key="loot.id" class="w-80">
            <LootCard :loot="loot" />
          </div>
        </div>
      </div>
    </div>
    <Loader v-else />
  </section>
</template>

<script>
import { gql } from 'nuxt-graphql-request'
import {
  defineComponent,
  onMounted,
  ref,
  useContext,
  useFetch,
  computed,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import { Contract, ethers } from 'ethers'
import { useFormatting } from '~/composables/useFormatting'
import GoldAbi from '~/abi/gold.json'
import { usePrice, useRarity } from '~/composables'
export default defineComponent({
  setup(props, context) {
    const { $graphql } = useContext()
    const { checkRealmRarity } = useRarity()
    const { goldPrice } = usePrice()
    const { shortenHash } = useFormatting()
    const { slug } = context.root.$route.params
    const variables = ref({ slug: slug.toLowerCase() })
    const adventurer = ref(null)
    const usersGold = ref(null)
    const goldTokenAddress = '0x32353A6C91143bfd6C7d363B546e62a9A2489A20'

    const query = ref(gql`
      query userSlug($slug: String!) {
        wallet(id: $slug) {
          realmsHeld
          bagsHeld
          gAdventurersHeld
          mLootsHeld
          manasHeld
        }
        manas(first: 30, where: { currentOwner: $slug }) {
          id
          itemName
          suffixId
          inventoryId
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
        realms(first: 30, where: { currentOwner: $slug }) {
          id
          tokenURI
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
        gadventurers(first: 30, where: { currentOwner: $slug }) {
          id
          head
          neck
          chest
          hand
          ring
          weapon
          waist
          foot
          order
          orderColor
          orderCount
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
        bags(first: 30, where: { currentOwner: $slug }) {
          id
          head
          neck
          chest
          hand
          ring
          weapon
          waist
          foot
          chestSuffixId
          footSuffixId
          handSuffixId
          headSuffixId
          neckSuffixId
          ringSuffixId
          waistSuffixId
          weaponSuffixId
          manasClaimed
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
        mloots(first: 30, where: { currentOwner: $slug }) {
          id
          head
          neck
          chest
          hand
          ring
          weapon
          waist
          foot
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
      }
    `)

    // eslint-disable-next-line
    const provider = new ethers.getDefaultProvider('mainnet', {
      etherscan: process.env.ETHER_SCAN,
      alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      infura: process.env.INFURA_ID,
    })

    const options = {
      address: slug,
      provider,
    }

    const getBalance = async (options) => {
      const contract = new Contract(goldTokenAddress, GoldAbi, options.provider)
      const balance = await contract.balanceOf(options.address)
      return ethers.utils.formatEther(balance)
    }

    onMounted(async () => {
      usersGold.value = await getBalance(options)
      if (adventurer.value) {
        openSeaFetch()
      }
    })

    useFetch(async () => {
      adventurer.value = await $graphql.mainnet.request(
        query.value,
        variables.value
      )
    })

    const openSeaData = ref([])
    const loading = ref()
    const offset = ref(0)
    const openSeaFetch = async (off) => {
      loading.value = true
      const numPages = Math.ceil(adventurer.value.wallet.realmsHeld / 50)

      for (let page = 0; page < numPages; page++) {
        try {
          const response = await axios.get(
            'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&limit=50&owner=' +
              slug +
              '&offset=' +
              page * 50,
            {
              headers: {
                'X-API-KEY': process.env.OPENSEA,
              },
            }
          )
          openSeaData.value = openSeaData.value.concat(response.data.assets)
        } catch (e) {
          console.log(e)
        } finally {
          loading.value = false
        }
      }
    }

    const realmOpenSea = (id) => {
      return openSeaData.value.find((realm) => realm.token_id === id)
    }

    const rariety = ref(null)

    const lootRariety = (id) => {
      return rariety.value.find((loot) => loot.id.toString() === id)
    }

    const sortedRealms = computed(() => {
      return openSeaData.value
        ? openSeaData.value.sort((a, b) => {
            return checkRealmRarity(b.traits) - checkRealmRarity(a.traits)
          })
        : null
    })

    return {
      adventurer,
      slug,
      shortenHash,
      goldPrice,
      usersGold,
      openSeaData,
      loading,
      realmOpenSea,
      rariety,
      lootRariety,
      sortedRealms,
      offset,
    }
  },
})
</script>
