<template>
    <div class="bg-black p-4 rounded-xl mr-8 my-4 text-white transform hover:-translate-y-2 transition duration-150 min-h-80 h-auto hover:shadow-2xl flex flex-col group" >
        <div class="mb-4 flex justify-between">
           #{{ treasure.id }} 
           <slot>
               
           </slot>
        </div>
        <div>
            {{ treasure.asset1 }} <br>
            {{ treasure.asset2 }} <br>
            {{ treasure.asset3 }} <br>
            {{ treasure.asset4 }} <br>
            {{ treasure.asset5 }} <br>
            {{ treasure.asset6 }} <br>
            {{ treasure.asset7 }} <br>
            {{ treasure.asset8 }}
        </div>
        <div class="mt-auto flex justify-between pt-4">
            <span class="group-hover:text-white text-white sm:text-black transition duration-150 underline cursor-pointer" @click="navigate">
                See on Opensea
            </span> 
            <NuxtLink v-if="owner" class="group-hover:text-white text-white sm:text-black transition duration-150 underline " :to="'/adventurer/' + treasure.currentOwner.address">
                View Owner
            </NuxtLink>
            
        </div>
    </div>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting';
export default defineComponent({
    props: {
        treasure: {
            type: Object,
            required: true
        },
        owner: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    setup(props, context) {
        const { shortenHash } = useFormatting();
        const navigate = () =>{
            window.open("https://opensea.io/assets/0xf3dfbe887d81c442557f7a59e3a0aecf5e39f6aa/" + props.treasure.id, '_blank')
        }

        return {
            shortenHash,
            navigate
        }
    }
})
</script>
