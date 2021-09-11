<template>
    <div class="border-r border-black p-4 bg-gray-1000 transform duration-300 ease-in-out transition-all left-0 z-10  " :class="sideBarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'">
        
        <div class="sm:sticky top-10 flex flex-col z-30">
            
            <div class="sm:hidden w-full">
                <button class="ml-auto" @click="toggleSideBar"><Close class="w-6 h-6"/></button>
            </div>
            
            <h2><NuxtLink to="/"><Book class="w-12 h-12 mx-auto sm:mt-12"/></NuxtLink></h2>
            <span class="text-xl text-center"><span class="text-yellow-400">${{ goldPrice}}</span> $AGLD</span>
            
            <nav class="flex flex-col p-2 text-center capitalize">
                <NuxtLink v-for="(link, index) in sideLinks" :key="index" class="w-full text-xl rounded-xl hover:bg-black p-2" :to="link.page" @click.native="toggleSideBar">{{ link.title }}</NuxtLink>
            </nav>
            
            <div class="mx-auto my-20">
                <a class="hover:bg-gracy-700 " href="https://github.com/BibliothecaForAdventurers/nuxt-frontend"><Github class="w-8 h-8"/></a>
                <a class="hover:bg-gracy-700 " href="https://discord.gg/8NS4JxGmUC"><Discord class="w-8 h-8 fill-current mt-4"/></a>
                <a class="hover:bg-gracy-700 " target="blank_" href="https://medium.com/@bibliotheca">
                <Medium class="w-8 h-8 fill-current mt-4"/>
                </a>                
            </div>
            <p class="text-center">Data on this site may be delayed.</p>
        </div>
    </div>
</template>
<script>
import { onMounted } from '@vue/composition-api';
import { useUiState, usePrice } from '~/composables';
import Book from '~/assets/img/book-open.svg?inline'
import Close from '~/assets/img/x-square.svg?inline'
import Github from '~/assets/img/github.svg?inline'
import Discord from '~/assets/img/discord.svg?inline'
import Medium from '~/assets/img/medium.svg?inline'
export default {
    name: "SideBar",
    components: {
        Book,
        Close,
        Github,
        Discord,
        Medium
    },
    setup() {
        const { toggleSideBar, sideBarOpen } = useUiState();
        const { goldPrice, getGoldPrice } = usePrice();

        const sideLinks = [
            {
                page: "/adventurer",
                title: "Adventurers"
            },
            {
                page: "/realms",
                title: "Realms"
            },
            {
                page: "/realms/mint",
                title: "Mint realms"
            },
            {
                page: "/treasure",
                title: "Treasure"
            }
        ]

        onMounted(()=>{
            getGoldPrice()
            window.setInterval(() => {
                getGoldPrice()
            }, 20000)
            
        })
        return {
            toggleSideBar,
            sideBarOpen,
            goldPrice,
            getGoldPrice,
            sideLinks
        }
        
    },
}
</script>
