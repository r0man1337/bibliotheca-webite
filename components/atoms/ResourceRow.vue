<template>
  <tr class="text-xl">
    <td class="p-2">
      {{ resource.trait }}
    </td>
    <td class="p-2">{{ balance }}</td>
    <td class="p-2">0</td>
  </tr>
</template>
<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { useResources } from '~/composables/resources/useResources'
export default defineComponent({
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const { fetchResource } = useResources()
    const balance = ref()
    onMounted(async () => {
      balance.value = await fetchResource(props.resource.id)
    })
    return {
      fetchResource,
      balance,
    }
  },
})
</script>
