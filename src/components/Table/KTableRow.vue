<template>
  <tr>
    <KTableCell
      v-for="(col, index) in columns"
      :key="index"
      :column="col"
      :rowData="rowData"
      @update:cell="emit('update:row', $event)"
    />
  </tr>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import KTableCell from './KTableCell.vue'
import type { Column } from './KTable.vue'

defineProps({
  columns: { type: Array as PropType<Column[]>, required: true },
  rowData: { type: Object, default: () => ({}) },
})

const emit = defineEmits<{
  (e: 'update:row', data: { column: string; value: any }): void
}>()
</script>



