<template>
  <tr
    :class="{
      'is-collapsible': collapsible,
      'is-expanded': expanded,
    }"
    @click="handleRowClick"
  >
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
  collapsible: { type: Boolean, default: false },
  expanded: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'update:row', data: { column: string; value: any }): void
  (e: 'toggle-expand'): void
}>()

const interactiveSelector = 'button, a, input, select, textarea, [contenteditable="true"], .action-cell, .guid-cell'

const handleRowClick = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target.closest(interactiveSelector)) return
  emit('toggle-expand')
}
</script>



