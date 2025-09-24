<template>
  <td :class="[
        bordered ? 'border' : '',
        hoverable ? 'table-hover' : '',
        striped ? 'table-striped' : ''
    ]">
        <slot></slot>


  </td>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
    striped: {
        type: Boolean,
        default: false
    },
    bordered: {
        type: Boolean,
        default: false
    },
    hoverable: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>

</style>

