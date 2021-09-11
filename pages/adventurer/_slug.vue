<template>
  <section>
    <div v-if="!$fetchState.pending">
      <h4 class="text-gray-400">adventurer</h4>
      <h1>{{ shortenHash(slug) }}</h1>

      <h3>  
        <span class="text-2xl"> 
          <span v-if="usersGold" class="text-yellow-400 ">{{ usersGold }}</span>
          <span v-else>...</span>  
        
        Adventurers Gold</span>  <br>
        <span class="text-xl text-gray-400">${{ (usersGold * goldPrice).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }} USD </span>
      </h3>
      <div class="bg-black sticky top-10 z-20 rounded px-4 py-2 space-x-6 border-white w-auto border">
        <a class="hover:bg-gray-900 px-2 py-1 rounded" href="#loot">Loot: {{ adventurer.bags.length }} </a>
        <a v-if="adventurer.realms.length" class="hover:bg-gray-900 px-2 py-1 rounded" href="#realms">Realms: {{ adventurer.realms.length }}</a>
        <a v-if="adventurer.treasures.length" class="hover:bg-gray-900 px-2 py-1 rounded" href="#treasure">Treasure: {{ adventurer.treasures.length }}</a>
      </div>
      <div v-if="adventurer.bags.length" id="loot">
        <h3 class="mt-8">Loot: {{ adventurer.bags.length }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="(loot, index) in adventurer.bags" :key="index" class="w-80 ">
            <LootCard :loot="loot">
              <div>
                Score: <span v-if="rariety" class="ml-auto">{{ lootRariety(loot.id).score }}</span> <span v-else class="h-5 w-8 bg-gray-500 rounded animate-pulse"></span> 
              </div>
              <div>
                Rank: <span v-if="rariety" class="ml-auto">{{ lootRariety(loot.id).rarest }}</span> <span v-else class="h-5 w-8 bg-gray-500 rounded animate-pulse"></span> 
              </div>
            </LootCard>
          </div>
        </div>
      </div>

      
      <div v-if="adventurer.realms.length" id="realms">
        <hr>
        <h3 class="mt-8">Realms: {{ adventurer.realms.length }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="realm in adventurer.realms" :key="realm.id" class="w-80 ">
            <RealmCard :id="realm.id" :realm="realm">
              <div v-if="openSeaData">
                <div class="relative">
                  <img v-if="realmOpenSea(realm.id).image_url" class="rounded-xl p-1" :src="realmOpenSea(realm.id).image_url" />
                    <div v-else class="bg-gray-100 text-black p-2 rounded flex self-center h-48 w-full justify-between">
                      no image yet
                    </div>
                  <RealmRarity v-if="realmOpenSea(realm.id).traits" class="absolute top-10 right-10 " :traits="realmOpenSea(realm.id).traits"/>
                </div>
                
                <div v-if="realmOpenSea(realm.id).traits" class="p-2 flex flex-wrap text-xs">
                  <ResourceChip  v-for="(resource, index) in resources(realmOpenSea(realm.id).traits)" :key="index"  class="mr-2 my-1" :resource="resource"/>
                </div>
                <div v-if="wonder(realmOpenSea(realm.id).traits)" class="px-2 text-center border-white rounded py-1 border mx-2">{{ wonder(realmOpenSea(realm.id).traits).value }}</div>
                <div v-if="realmOpenSea(realm.id).name" class="px-4 pt-4">
                  <h4 >{{ realmOpenSea(realm.id).name }}  - #{{ realm.id }}</h4>
                </div>
              </div>
              <div v-else class=" h-32 p-2">
                <div class=" animate-pulse flex space-x-4 bg-gray-700 h-32 rounded-xl p-1"/>
              </div>                     
            </RealmCard>
          </div>
        </div>
      </div>
      <div v-if="adventurer.treasures.length" id="treasure">
        <hr>
        <h3 class="mt-8">Treasure: {{ adventurer.treasures.length }}</h3>
        <div class="flex flex-wrap w-full">
          <div v-for="treasure in adventurer.treasures" :key="treasure.id" class="w-80 ">
            <TreasureCard :treasure="treasure"/>
          </div>
        </div>
      </div>
    </div>
    <Loader v-else/>
  </section>
</template>

<script>
import { gql } from 'nuxt-graphql-request'
import { computed, defineComponent, onMounted, ref, useContext, useFetch } from '@nuxtjs/composition-api'
import axios from 'axios'
import { Contract, ethers } from 'ethers';
import { useFormatting } from '~/composables/useFormatting';
import GoldAbi from '~/abi/gold.json'
import { usePrice } from '~/composables';
export default defineComponent({
  setup(props, context) {
    const { $graphql } = useContext()
    const { goldPrice } = usePrice();
    const { shortenHash } = useFormatting();
    const { slug } = context.root.$route.params
    const variables = ref({ slug })
    const adventurer = ref(null)
    const usersGold = ref(null)
    const goldTokenAddress = '0x32353A6C91143bfd6C7d363B546e62a9A2489A20'

    const query = ref(gql`
      query userSlug($slug: String!){
        realms (first:30, where: {currentOwner: $slug }) {
          id
          tokenURI
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
        treasures (first:30, where: {currentOwner: $slug }) {
          id
          asset1
          asset2
          asset3
          asset4
          asset5
          asset6
          asset7
          asset8
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
        bags(first:30, where: {currentOwner: $slug }) {
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

    const provider = new ethers.getDefaultProvider('mainnet', {
        etherscan: process.env.ETHER_SCAN,
        alchemy: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        infura: process.env.INFURA_ID,
    });

    const options = {
      address: slug, 
      provider,
    }

    const getBalance = async (options) => {
      const contract = new Contract(goldTokenAddress, GoldAbi, options.provider);
      const balance = await contract.balanceOf(options.address);
      return ethers.utils.formatEther(balance);
    };

    onMounted(async()=> {
      usersGold.value = await getBalance(options)
      openSeaFetch()
      rarietyFetch()
    })

    useFetch(async () => {
        adventurer.value = await $graphql.default.request(query.value, variables.value)
    })

    const openSeaData = ref()
    const loading = ref()

    const openSeaFetch = async () => {
      loading.value = true

      const idString = adventurer.value ? adventurer.value.realms.map((realm)=>{
        return 'token_ids=' + realm.id + "&"
      }).join('') : ""

      if(idString !== '') {
        try {
          const response = await axios.get('https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&' + idString + 'order_direction=desc&offset=0&limit=30')
          openSeaData.value = response.data.assets
        } catch(e) {
          console.log(e)
        } finally {
          loading.value = false
        }
      }

    }

    const realmOpenSea = (id) => {
      return openSeaData.value.find(realm => realm.token_id === id)
    }
    
    const rariety = ref()

    const rarietyFetch = async () => {
      const idString = adventurer.value ? adventurer.value.bags.map((bag)=>{
        return 'id=' + bag.id + "&"
      }).join('').slice(0, -1): ""

      if(idString !== '') {
        try {
          const response = await axios.get('/api/rare?' + idString)
          rariety.value = response.data
        } catch (e) {
          console.log(e)
        }
      }

    }

    const lootRariety = (id) => {
      return rariety.value.find(loot => loot.id.toString() === id)
    }

    const resources = (traits) => {
        return traits.filter(resource => resource.trait_type === 'Resource')
    }

    const wonder = (traits) => {
        return traits.find(resource => resource.trait_type === 'Wonder (translated)')
    }

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
      resources,
      wonder
    }
    
  },
})
</script>