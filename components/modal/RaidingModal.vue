<template>
  <div class="container bg-gray-900 flex p-8">
    <div class="w-4/12">
      <h3>Choose Your Realm</h3>
      <div class="flex justify-between flex-wrap">
        <div v-if="sRealms" class="overflow-scroll h-screen">
          <StakedRealm
            v-for="(realm, index) in sRealms"
            :key="index"
            :realm="realm"
          />
        </div>
      </div>
    </div>
    <div class="w-4/12 flex">
      <WarriorStanding class="self-center mx-auto" />
      <BButton class="self-center mx-auto" type="primary"> Raid</BButton>
      <WarriorStanding inverse class="self-center mx-auto" />
    </div>
    <div class="w-4/12">
      <h3>Raiding Realm</h3>
      <div class="flex justify-between flex-wrap">
        <StakedRealm class="ml-auto" :realm="raidedRealm" />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, computed } from '@vue/composition-api'
import { useWeb3 } from '@instadapp/vue-web3'
import { useAdventurer } from '~/composables/useAdventurer'
export default defineComponent({
  props: {
    raidedRealm: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { getAdventurer, adventurer } = useAdventurer()
    const { account } = useWeb3()
    onMounted(async () => {
      await getAdventurer(account.value, 'l2')
    })
    const sRealms = computed(() => {
      return adventurer.value.l2?.srealms || []
    })
    return {
      adventurer,
      sRealms,
    }
  },
})
</script>
