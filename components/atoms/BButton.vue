<template>
  <component
    :is="tag"
    class="button ease-in-out font-display text-center disabled:opacity-25"
    :class="[buttonColor, btnClass]"
    v-bind="$attrs"
    :disabled="disabled"
    :to="to"
    v-on="$listeners"
    @click="externalSite()"
  >
    <slot v-if="!loading" />
    <span v-else><LoadingRings class="mx-auto w-7 h-7" /></span>
  </component>
</template>
<script>
import { ButtonColors } from '@/validators/Button'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'
export default {
  components: {
    LoadingRings,
  },
  props: {
    to: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    href: {
      type: String,
      default: null,
    },
    block: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      required: false,
      type: String,
      default: 'default',
      validator: (value) => {
        return Object.keys(ButtonColors).includes(value)
      },
    },
  },
  computed: {
    buttonColor() {
      return ButtonColors[this.type]
    },
    tag() {
      return this.to ? 'nuxt-link' : 'button'
    },
    btnClass() {
      const classes = []
      if (this.block) {
        classes.push('w-full')
      }
      if (this.type === 'link') {
        classes.push('bg-nude-100')
      }
      if (this.disabled && this.block) {
        classes.push('bg-red-400')
      }
      return classes.join(' ')
    },
  },
  methods: {
    externalSite() {
      if (this.href) {
        window.location = this.href
      }
    },
  },
}
</script>
