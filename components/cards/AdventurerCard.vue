<template>
    <div class="bg-black p-4 rounded-xl mr-8 my-4 text-white transform hover:-translate-y-2 transition duration-150  h-80 cursor-pointer hover:shadow-2xl hover:opacity-70 hover:border flex flex-col" @click="navigate">
        <div>
            <h3>{{ shortenHash(adventurer.address) }}</h3>
            <span>Loots: {{ adventurer.bagsHeld ? adventurer.bagsHeld: 0 }}</span> <br>
            <span>Realms: {{ adventurer.realmsHeld ? adventurer.realmsHeld : 0 }}</span> <br>
            <span>Treasure: {{ adventurer.treasuresHeld ? adventurer.treasuresHeld : 0 }}</span>
        </div>
        <div class="mt-auto flex text-gray-300">
          Visit Adventurers Profile <ArrowRight class="ml-4 w-4 h-4 self-center"/>
        </div>



    </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting';
import ArrowRight from '~/assets/img/arrow-right.svg?inline'
export default defineComponent({
    components: {
        ArrowRight
    },
    props: {
        adventurer: {
            type: Object,
            required: true
        }
    },
    setup(props, context) {
        const { shortenHash } = useFormatting();
        const navigate = () =>{
            context.root.$router.push(`/adventurer/${props.adventurer.address}`)
        }
        return {
            shortenHash,
            navigate
        }
    }
})
</script>
