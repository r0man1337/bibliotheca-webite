<template>
  <div
    class="
      bg-black
      border-2 border-gray-800
      rounded-xl
      mr-8
      my-4
      text-white
      transform
      hover:-translate-y-2
      transition
      duration-150
      min-h-80
      hover:shadow-2xl
      flex flex-col
      group
    "
  >
    <div v-if="order(realm.traits)" class="flex text-center p-1">
      <OrderChip class="w-full rounded-xl" :order="order(realm.traits).value" />
    </div>
    <div class="relative">
      <img
        v-if="realm.image_url"
        class="rounded-xl px-1 w-full"
        :src="realm.image_url"
      />
      <div
        v-else
        class="
          bg-gray-100
          text-black
          p-2
          rounded
          flex
          self-center
          h-48
          w-full
          justify-between
        "
      >
        no image yet
      </div>
      <RealmRarity class="absolute top-10 right-10" :traits="realm.traits" />
    </div>
    <div class="p-4">
      <div
        v-if="wonder(realm.traits)"
        class="
          text-center text-white
          bg-gradient-to-r
          from-purple-200
          via-pink-200
          to-red-300
          text-red-500
          rounded
          py-1
          mb-2
        "
      >
        {{ wonder(realm.traits).value }}
      </div>
      <div class="flex justify-between">
        <h3>{{ realm.name }}</h3>
        <h3>#{{ realm.token_id }}</h3>
      </div>

      <h6 class="text-gray-500">Realm sales: {{ realm.num_sales }}</h6>
      <h6 v-if="realm.last_sale" class="text-gray-500">
        Last sale price:
        {{ intRoundFloor(realm.last_sale.total_price) / 10 ** 18 }} ETH
      </h6>
    </div>
    <div class="p-2 flex flex-wrap text-xs">
      <ResourceChip
        v-for="(resource, index) in resources(realm.traits)"
        :key="index"
        class="mr-2 my-1"
        :resource="resource"
      />
    </div>

    <div v-if="!stake" class="mt-auto p-4 flex justify-between">
      <span
        class="
          group-hover:text-white
          text-black
          transition
          duration-150
          cursor-pointer
          underline
        "
        @click="navigate"
      >
        See on Opensea
      </span>
      <NuxtLink
        :to="'/realms/' + id"
        class="
          group-hover:text-white
          text-black
          transition
          duration-150
          underline
        "
      >
        See detail
      </NuxtLink>
    </div>
    <div v-else class="mt-auto">
      <div class="p-2 mt-auto">
        <BButton class="w-full" type="primary" @click="stakeRealmPop(id)">
          <span v-if="loading.stake">Settling....</span>
          <span v-else>Settle Realm</span>
        </BButton>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useBigNumber } from '~/composables/web3/useBigNumber'
import { useStaking } from '~/composables/staking/useStaking'
export default defineComponent({
  props: {
    realm: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    stake: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const { shortenHash } = useFormatting()
    const { intRoundFloor } = useBigNumber()
    const {
      stakeRealm,
      claimResources,
      claimBalance,
      realmBalance,
      loading,
      error,
      result,
    } = useStaking()
    const navigate = () => {
      window.open(
        'https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
          props.id,
        '_blank'
      )
    }
    const resources = (traits) => {
      return traits.filter((resource) => resource.trait_type === 'Resource')
    }
    const wonder = (traits) => {
      return traits.find(
        (resource) => resource.trait_type === 'Wonder (translated)'
      )
    }
    const order = (traits) => {
      return traits.find((resource) => resource.trait_type === 'Order')
    }

    const stakeRealmPop = async (id) => {
      try {
        await stakeRealm(id)
      } catch (e) {
        console.log(e)
      } finally {
        context.emit('realmSettled', id)
      }
    }
    return {
      shortenHash,
      navigate,
      resources,
      wonder,
      order,
      intRoundFloor,
      stakeRealm,
      claimResources,
      claimBalance,
      realmBalance,
      loading,
      error,
      result,
      stakeRealmPop,
    }
  },
})
</script>
