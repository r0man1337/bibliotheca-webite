<template>
  <section>
    <div >
        <h1 class="mt-8">Realms</h1>
        
        <form  method="POST" @submit.prevent="submitSearch">
          <input v-model="search" placeholder="insert realm id" class="bg-black rounded px-4 py-2 text-xl" type="text">
          <button class="px-4" type="submit">find realm</button>
        </form>
        <h3 class="my-2">Higher the number, the rarer the Realm.</h3>
        <div v-if="!$fetchState.pending" class="flex flex-wrap w-full">
          <div v-for="realm in openSeaData" :key="realm.id" class="w-80 ">
            <RealmCard :id="realm.token_id" :realm="realm">
                <div class="relative">
                  <img v-if="realm.image_url" class="rounded-xl p-1" :src="realm.image_url" />
                  <div v-else class="bg-gray-100 text-black p-2 rounded flex self-center h-48 w-full justify-between">
                    no image yet
                  </div>
                  <RealmRarity class="absolute top-10 right-10 " :traits="realm.traits"/>
                </div>


                <div class="p-2 flex flex-wrap text-xs">
                  <ResourceChip v-for="(resource, index) in resources(realm.traits)" :key="index"  class="mr-2 my-1" :resource="resource"/>
                </div>
                <div v-if="wonder(realm.traits)" class="px-2 text-center border-white rounded py-1 border mx-2 mb-2">{{ wonder(realm.traits).value }}</div>
                <div class="px-4">
                  <h4 >{{ realm.name }} - #{{ realm.token_id }}</h4>
                  <h6 class="text-gray-500">Realm sales: {{ realm.num_sales }}</h6>
                </div>
                                
            </RealmCard>
          </div>
        </div>
        <div v-else class="flex flex-wrap">
          <Loader v-for="(loader, index) in 6" :key="index" class="mr-3 mb-3" />
        </div>
        
        <div v-if="!$fetchState.pending">
          <button class="bg-black rounded px-4 py-2 hover:bg-gray-700" @click="fetchMoreRealms">{{ loading ? "loading" : "Load More Realms" }}</button>
        </div>
    </div>
    
  </section>
</template>

<script>
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
import axios from 'axios'
import { useFormatting } from '~/composables/useFormatting';
export default defineComponent({
  setup(props, context) {
    const { shortenHash } = useFormatting();
    const adventurer = ref(null)
    const usersGold = ref(null)
    const search = ref()

    useFetch(async () => {
        const response = await axios.get('https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&limit=50')
        openSeaData.value = response.data.assets
    })

    const openSeaData = ref()
    
    const loading = ref()

    const submitSearch = () => {
      context.root.$router.push(`/realms/${search.value}`)
    }

    const resources = (traits) => {
        return traits.filter(resource => resource.trait_type === 'Resource')
    }

    const wonder = (traits) => {
        return traits.find(resource => resource.trait_type === 'Wonder (translated)')
    }
    
    const fetchMoreRealms = async () => {
      loading.value = true
      try {
        const response = await axios.get('https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&limit=50&offset=50')
        const newRealms = response.data.assets
        openSeaData.value = openSeaData.value.concat(newRealms)
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }

    }

    return {
      adventurer,
      shortenHash,
      usersGold,
      openSeaData,
      loading,
      submitSearch,
      search,
      resources,
      fetchMoreRealms,
      wonder
    }
    
  },
})
</script>
