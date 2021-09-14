<template>
  <div class="relative inline-block text-left">
    <div>
      <button
        id="menu-button"
        type="button"
        class="
          inline-flex
          justify-center
          w-full
          rounded-md
          shadow-sm
          px-4
          py-2
          bg-black
          text-xl text-white
          hover:bg-gray-800
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-offset-red-100
          focus:ring-red-500
          z-20
          capitalize
        "
        aria-expanded="true"
        aria-haspopup="true"
        @click="active = !active"
      >
        Search by: <span class="w-2" />
        <span class="bold text-red-400">
          {{
            activeElement ? '  ' + activeElement.name : 'Select Loot Item'
          }}</span
        >
        <svg
          class="-mr-1 ml-2 h-5 w-5 self-center"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  -->
    <div
      v-show="active"
      class="
        origin-top-left
        absolute
        left-0
        mt-2
        w-56
        rounded-md
        shadow-lg
        bg-black
        ring-1 ring-black ring-opacity-5
        focus:outline-none
        z-10
        capitalize
      "
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex="-1"
    >
      <div class="py-1" role="none">
        <a
          v-for="(item, index) in items"
          id="menu-item-0"
          :key="index"
          href="#"
          :class="{
            'bg-gray-800 text-white text-red-400':
              item.name === activeElement.name,
          }"
          class="
            bg-black
            block
            px-4
            py-2
            text-md
            hover:bg-gray-900
            rounded
            hover:text-red-400
          "
          role="menuitem"
          tabindex="-1"
          @click="setElement(item)"
          >{{ item.name }}</a
        >
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  props: {
    items: Array,
  },
  setup(props, context) {
    const activeElement = ref(props.items[0])
    const active = ref(false)
    const hide = () => {
      active.value = false
    }

    const setElement = (item) => {
      active.value = false
      activeElement.value = item
      context.emit('itemSelect', item)
    }

    return {
      activeElement,
      active,
      hide,
      setElement,
    }
  },
})
</script>
