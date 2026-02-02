<template>
  <td :class="[
        bordered ? 'border' : '',
        hoverable ? 'table-hover' : '',
        striped ? 'table-striped' : ''
    ]">
    <component
      :is="cellComponent"
      :modelValue="cellValue"
      :editable="column.editable"
      :disabled="disabled"
      :actions="column.actions"
      :rowData="rowData"
      :precision="column.precision"
      :format="column.format"
      @update:value="handleUpdate"
    />
  </td>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import StringCell from './cells/StringCell.vue'
import NumberCell from './cells/NumberCell.vue'
import ToggleCell from './cells/ToggleCell.vue'
import ActionCell from './cells/ActionCell.vue'
import TimeCell from './cells/TimeCell.vue'

interface Column {
  title: string
  data: string
  type?: 'string' | 'number' | 'boolean' | 'action' | 'time'
  editable?: boolean
  actions?: any[]
  precision?: number
  format?: string
}

const props = defineProps({
  column: {
    type: Object as PropType<Column>,
    required: true
  },
  rowData: {
    type: Object,
    required: true
  },
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
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'update:cell', data: { column: string; value: any }): void
}>()

const cellComponent = computed(() => {
  const type = props.column.type || 'string'
  const componentMap = {
    string: StringCell,
    number: NumberCell,
    boolean: ToggleCell,
    action: ActionCell,
    time: TimeCell
  }
  return componentMap[type] || StringCell
})

const cellValue = computed(() => {
  if (props.column.type === 'action') return undefined
  return props.rowData[props.column.data]
})

const handleUpdate = (value: any) => {
  emit('update:cell', { column: props.column.data, value })
}
</script>

<style scoped>

</style>

