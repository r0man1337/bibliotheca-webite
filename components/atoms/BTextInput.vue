<template>
  <FormulateInput
    :id="id"
    v-model="model"
    :value="value"
    :wrapper-class="['relative']"
    :input-class="[
      'appearance-none rounded-md shadow-sm border text-gray-600 mb-1 leading-tight focus:ring-primary focus:border-primary w-full bg-gray-50 transition-all duration-150 font-semibold tracking-wide',
      inputClass,
      isFullInput,
    ]"
    :label-class="[
      'block text-xs leading-5 font-medium text-gray-500 transform translate-y-6 ml-4 opacity-0 uppercase ease-in-out transition-all duration-150 font-semibold',
      isFull,
    ]"
    :help-class="['text-xs text-red-300 ']"
    :errors-class="['text-red-300 font-semibold']"
    :label="label"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    :help="help"
    v-bind="$attrs"
    :validation="validation"
    :validation-messages="validationMessages"
    @input="
      $emit('input', $event)
      inputChanged($event)
    "
  />
</template>
<script>
import { computed, ref } from '@vue/composition-api'

export default {
  props: {
    label: {
      type: String,
      required: false,
      default: null,
    },
    value: {
      type: [String, Array, Number],
      default: null,
    },
    help: {
      type: String,
      required: false,
      default: null,
    },
    placeholder: {
      type: String,
      required: false,
      default: null,
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    name: {
      type: String,
      required: false,
      default: 'text',
    },
    // eslint-disable-next-line vue/require-default-prop
    validation: {
      type: String,
      required: false,
    },
    // eslint-disable-next-line vue/require-default-prop
    validationMessages: {
      type: Object,
      required: false,
    },
    id: {
      type: String,
      required: false,
      default: 'text',
    },
    inputClass: {
      type: String,
      default: null,
    },
  },
  setup(props) {
    const model = ref(props.value)

    const inputChanged = (value) => {
      model.value = value
    }

    const isFull = computed(() => {
      if (model.value) {
        return 'opacity-100'
      }
      return ''
    })

    const isFullInput = computed(() => {
      if (model.value) {
        return 'px-4 pt-6 pb-2'
      } else {
        return 'px-4 py-4'
      }
    })

    return {
      inputChanged,
      model,
      isFullInput,
      isFull,
    }
  },
}
</script>
<style lang="postcss" scoped>
.base-input {
  min-height: 3.5rem;
}

.is-full {
  label {
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
  input {
    padding: 30px 15px 15px 15px;
  }
}
</style>
