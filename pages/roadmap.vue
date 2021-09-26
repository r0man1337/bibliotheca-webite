<template>
  <section class="w-full">
    <div class="text-center sm:w-1/2 mx-auto">
      <h1>Realms P2E Roadmap</h1>
      <p class="my-4 text-xl">
        We are designing this game in the open, and all contracts and UI will be
        open source for the community to freely contribute. This roadmap is just
        an outline and may change course with feedback from the community.
      </p>
    </div>

    <div class="flex flex-col space-y-8">
      <div
        v-for="(stage, index) in mapStages"
        :key="index"
        class="
          mx-auto
          bg-black
          p-8
          rounded-xl
          shadow-xl
          w-1/2
          hover:border-red
          transform
          hover:-translate-y-2 hover:bg-red-500
          transition
          duration-150
          group
          cursor-pointer
        "
      >
        <h5
          class="
            uppercase
            group-hover:text-white
            text-red-400
            mb-1
            tracking-widest
          "
        >
          {{ stage.time }}
        </h5>
        <h2>{{ stage.title }}</h2>
        <p class="text-2xl group-hover:text-white text-gray-400">
          {{ stage.description }}
        </p>
      </div>
    </div>
    <div class="py-8 sm:w-1/2 mx-auto">
      <div class="bg-gray-800 mx-auto rounded-xl shadow-2xl text-white p-8">
        <h2>Design philosophy and process</h2>
        <p class="text-2xl">
          All contracts will be deployed on Rinkby for testing and allow for all
          Adventurers to use them and give feedback on the game before
          production is deployed.
        </p>
        <div class="text-2xl my-8 flex flex-wrap justify-around">
          <span class="text-red-800 bg-red-400 rounded p-2 px-4"
            >Open Beta</span
          >
          <span class="mx-4">testing</span>
          <span class="text-blue-800 bg-blue-400 rounded p-2 px-4"
            >Production</span
          >
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const mapStages = [
      {
        time: 'Late September - Early October',
        title: 'The Arbitrum Beta Bridge',
        description:
          'The first step in this adventure is the bridge into Arbitrum. Arbitrum will allow the Realms P2E universe to florish with very cheap & fast transactions.',
        active: 'true',
      },
      {
        time: 'Mid-late October',
        title: 'Staking Beta & Arbitrum Bridge Production',
        description:
          'Whilst the Arbitrum bridge is in beta, the staking contracts and associated contracts are being developed and tested. These will be deployed on Rinkeby in Mid October for user testing.',
        active: 'true',
      },
      {
        time: 'Late October - Early November',
        title:
          'Resources Automated Market Maker (AMM) Beta & Construction on your Realms',
        description:
          'The AMM for the resources will be deployed shortly after the beta production is live. This will give all beta testers the ability to trade the resources and build up their Realms in a testing enviroment.',
        active: 'true',
      },
      {
        time: 'November',
        title: 'Staking Live, Construction Live, AMM Live',
        description:
          'Production staking will go live once there has been sufficent testing on all the contracts platform by the community.',
        active: 'true',
      },
      {
        time: 'December',
        title: 'PvP Contracts',
        description: 'Bridge',
        active: 'true',
      },
    ]
    return {
      mapStages,
    }
  },
})
</script>
