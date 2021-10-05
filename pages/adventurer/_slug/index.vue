<template>
  <section>
    <h4 class="text-gray-400">adventurer</h4>
    <h1>{{ shortenHash(slug) }}</h1>
    <div v-if="!$fetchState.pending && !adventurer.l1.id">
      No Loot or Derivatives for this adventurer... yet.
    </div>
    <div v-else-if="!$fetchState.pending && adventurer.l1.bags">
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
          border-gray-500
          w-auto
          border
        "
      >
        <h3>Ethereum Assets</h3>
        <a
          v-if="adventurer.l1.bagsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#loot"
          >Loot: {{ adventurer.l1.bagsHeld }}
        </a>
        <a
          v-if="adventurer.l1.realmsHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#realms"
          >Realms: {{ adventurer.l1.realmsHeld }}</a
        >
        <a
          v-if="adventurer.l1.manasHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#mana"
          >mana: {{ adventurer.l1.manasHeld }}</a
        >
        <a
          v-if="adventurer.l1.treasuresHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#treasure"
          >Treasure: {{ adventurer.l1.treasuresHeld }}</a
        >
        <!-- <a
          v-if="l1Adventurer.wallet.mLootHeld"
          class="hover:bg-gray-900 px-2 py-1 rounded"
          href="#mloot"
          >mLoot: {{ l1Adventurer.wallet.mLootHeld }}</a
        > -->
      </div>
      <div v-if="adventurer.l1.bags.length" id="loot">
        <h3 class="mt-8">Loot: {{ adventurer.l1.bagsHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div
            v-for="(loot, index) in adventurer.l1.bags"
            :key="index"
            class="w-80"
          >
            <LootCard is-o-g :loot="loot" />
          </div>
        </div>
      </div>

      <div v-if="adventurer.l1.realms.length" id="realms">
        <hr />
        <div v-if="openSeaData.length">
          <h3 class="mt-8">Realms: {{ adventurer.l1.realmsHeld }}</h3>
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
      <div v-if="adventurer.l1.manas.length" id="mana">
        <hr />
        <h3 class="mt-8">Mana: {{ adventurer.l1.manas.length }}</h3>
        <div class="flex flex-wrap w-full">
          <div
            v-for="(mana, index) in adventurer.l1.manas"
            :key="index"
            class="w-80"
          >
            <ManaCard :mana="mana" />
          </div>
        </div>
      </div>
      <div v-if="adventurer.l1.treasures.length" id="treasure">
        <hr />
        <h3 class="mt-8">Treasure: {{ adventurer.l1.treasuresHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div
            v-for="treasure in adventurer.l1.treasures"
            :key="treasure.id"
            class="w-80"
          >
            <TreasureCard :treasure="treasure" />
          </div>
        </div>
      </div>
      <!-- <div v-if="l1Adventurer.mloots.length" id="mloot">
        <hr />
        <h3 class="mt-8">mLoot: {{ adventurer.wallet.mLootHeld }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="loot in adventurer.mloots" :key="loot.id" class="w-80">
            <LootCard :loot="loot" />
          </div>
        </div>
      </div> -->
    </div>
    <Loader v-else />
  </section>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  useFetch,
  computed,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import { Contract, ethers } from 'ethers'
import { useFormatting } from '~/composables/useFormatting'
import GoldAbi from '~/abi/gold.json'
import { useAdventurer } from '~/composables/useAdventurer'

import { usePrice, useRarity } from '~/composables'
export default defineComponent({
  setup(props, context) {
    const { checkRealmRarity } = useRarity()
    const { goldPrice } = usePrice()
    const { shortenHash } = useFormatting()
    const { slug } = context.root.$route.params

    const { getAdventurer, adventurer } = useAdventurer()

    const usersGold = ref(null)
    const goldTokenAddress = '0x32353A6C91143bfd6C7d363B546e62a9A2489A20'

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
      if (adventurer.value.l1) {
        openSeaFetch()
      }
    })

    useFetch(async () => {
      await getAdventurer(slug.toLowerCase())
    })

    const openSeaData = ref([])
    const loading = ref()
    const offset = ref(0)
    const openSeaFetch = async (off) => {
      loading.value = true
      const numPages = Math.ceil(adventurer.value.l1.realmsHeld / 50)

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
