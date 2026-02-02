<template>
  <th :class="{ sortable: column.type !== 'action' && sortable, resizable: resizable }">
    <div class="th-content">
      <span class="th-title">{{ column.title }}</span>
      <div v-if="column.type !== 'action' && sortable" class="sort-controls">
        <i
          class="bi bi-caret-up-fill sort-arrow"
          :class="{ active: isActiveSort('asc') }"
          @click.stop="$emit('sort', { column, direction: 'asc' })"
        ></i>
        <i
          class="bi bi-caret-down-fill sort-arrow"
          :class="{ active: isActiveSort('desc') }"
          @click.stop="$emit('sort', { column, direction: 'desc' })"
        ></i>
      </div>
    </div>
    <div v-if="resizable" class="resize-handle"></div>
  </th>
</template>

<script setup lang="ts">
import { PropType } from 'vue'

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
  sortable: {
    type: Boolean,
    default: true
  },
  sortColumn: {
    type: String as PropType<string | null>,
    default: null
  },
  sortDirection: {
    type: String as PropType<'asc' | 'desc'>,
    default: 'asc'
  },
  resizable: {
    type: Boolean,
    default: false
  }
})

defineEmits<{
  (e: 'sort', data: { column: Column; direction: 'asc' | 'desc' }): void
}>()

const isActiveSort = (direction: 'asc' | 'desc') => {
  return props.sortColumn === props.column.data && props.sortDirection === direction
}
</script>

<style scoped>
th {
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 600;
  background: var(--bs-body-bg, #ffffff);
  color: var(--bs-emphasis-color, #212529);
  user-select: none;
  font-size: 0.875rem;
  border-right: 1px solid var(--bs-border-color, rgba(0, 0, 0, 0.1));
  border-bottom: 2px solid var(--bs-primary, #0d6efd);
  position: relative;
  transition: all 0.2s ease;
}

th:last-child {
  border-right: none;
}

.th-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.th-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.sort-controls {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-shrink: 0;
  line-height: 0.75;
}

.sort-arrow {
  cursor: pointer;
  font-size: 0.75rem;
  color: var(--bs-secondary, #6c757d);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  opacity: 0.6;
  line-height: 0.75;
}

.sort-arrow:hover {
  color: var(--bs-primary, #0d6efd);
  background: var(--bs-primary-bg-subtle, rgba(13, 110, 253, 0.1));
  opacity: 1;
  transform: scale(1.15);
}

.sort-arrow.active {
  color: var(--bs-primary, #0d6efd);
  background: var(--bs-primary-bg-subtle, rgba(13, 110, 253, 0.15));
  opacity: 1;
  transform: scale(1.1);
}

th.sortable {
  cursor: default;
}


th.resizable {
  position: relative;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
  background: transparent;
  transition: background 0.2s ease;
}

.resize-handle:hover {
  background: var(--bs-primary, #0d6efd);
}
</style>
