<template>
  <section>
    <div v-if="!$fetchState.pending">
      <RealmRarity class="mb-8 text-xl" :traits="openSeaData.traits" />
      <h1>{{ openSeaData.name }}</h1>
      <a
        class="pb-1"
        :href="
          'https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
          openSeaData.token_id
        "
        target="_blank"
        >View Realm on Open Sea</a
      >
      <hr />
      <h3 class="mt-3">
        Realm lord:
        <NuxtLink
          class="hover:underline"
          :to="'/adventurer/' + openSeaData.owner.address"
          >{{ shortenHash(openSeaData.owner.address) }}</NuxtLink
        >
      </h3>

      <div>
        <h4>Sales: {{ openSeaData.num_sales }}</h4>
      </div>

      <div v-if="resources" class="my-4">
        <h3>Resources</h3>
        <div class="flex my-2 flex-wrap">
          <ResourceChip
            v-for="(resource, index) in resources"
            :key="index"
            :resource="resource"
          />
        </div>
      </div>
      <div v-if="cities" class="my-4">
        <h3>Traits</h3>
        <Levels
          :cities="cities"
          :harbours="harbours"
          :regions="regions"
          :rivers="rivers"
        />
      </div>

      <img
        v-if="openSeaData.image_url"
        class="w-full relative rounded-2xl"
        :src="openSeaData.image_url"
        alt=""
      />
      <h4 v-else class="my-5">No image yet</h4>
    </div>
    <div v-else>
      <Loader />
    </div>
  </section>
</template>
<script>
import {
  computed,
  defineComponent,
  ref,
  useFetch,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import { useFormatting } from '~/composables/useFormatting'
export default defineComponent({
  setup(props, context) {
    const { shortenHash } = useFormatting()
    const { id } = context.root.$route.params
    const adventurer = ref(null)

    useFetch(async () => {
      const response = await axios.get(
        'https://api.opensea.io/api/v1/asset/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
          id
      )
      openSeaData.value = response.data
    })

    const openSeaData = ref()
    const loading = ref()

    const resources = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.filter(
            (resource) => resource.trait_type === 'Resource'
          )
        : null
    })
    const cities = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.find(
            (resource) => resource.trait_type === 'Cities'
          )
        : null
    })
    const harbours = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.find(
            (resource) => resource.trait_type === 'Harbors'
          )
        : null
    })
    const regions = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.find(
            (resource) => resource.trait_type === 'Regions'
          )
        : null
    })
    const rivers = computed(() => {
      return openSeaData.value.traits.length
        ? openSeaData.value.traits.find(
            (resource) => resource.trait_type === 'Rivers'
          )
        : null
    })

    return {
      adventurer,
      shortenHash,
      openSeaData,
      loading,
      resources,
      cities,
      harbours,
      regions,
      rivers,
    }
  },
})
</script>
