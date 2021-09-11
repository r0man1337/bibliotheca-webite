<template>
  <div
    v-show="open"
    :class="{ 'opacity-75': open }"
    class="fixed inset-0 transition-opacity bg-gray-200 opacity-0"
  />
</template>
<script>
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    }
  }
}
</script>
