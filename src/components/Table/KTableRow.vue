<template>
  <tr :class="[
        bordered ? 'border' : '',
        hoverable ? 'table-hover' : '',
        striped ? 'table-striped' : ''
    ]">
    <KTableCell
      v-if="loading"
      v-for="(col, index) in columns"
      :key="`loading-${index}`"
      :column="col"
      :rowData="{}"
      :striped="striped"
      :bordered="bordered"
      :hoverable="hoverable"
    >
      <div class="loading-placeholder"></div>
    </KTableCell>
    <KTableCell
      v-else
      v-for="(col, index) in columns"
      :key="`data-${index}`"
      :column="col"
      :rowData="rowData"
      :striped="striped"
      :bordered="bordered"
      :hoverable="hoverable"
      @update:cell="handleCellUpdate"
    />
  </tr>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import KTableCell from './KTableCell.vue'

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
  columns: {
    type: Array as PropType<Column[]>,
    required: true
  },
  rowData: {
    type: Object,
    default: () => ({})
  },
  loading: {
    type: Boolean,
    default: false
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
  }
})

const emit = defineEmits<{
  (e: 'update:row', data: { column: string; value: any }): void
}>()

const handleCellUpdate = (data: { column: string; value: any }) => {
  emit('update:row', data)
}
</script>

<style scoped>
.loading-placeholder {
  height: 1.5rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 0.25rem;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

