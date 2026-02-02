<template>
  <div class="table-wrapper">
    <div v-if="searchable" class="search-container">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="search-input"
      />
    </div>
    <div class="table-scroll" :style="maxHeight ? { maxHeight, overflow: 'auto' } : {}">
      <table
        class="table"
        :class="{
          striped: striped,
          bordered: bordered,
          hoverable: hoverable
        }"
      >
      <thead>
        <tr>
          <KTableHeader
            v-for="(column, index) in columns"
            :key="index"
            :column="column"
            :sortable="sortable"
            :sortColumn="sortColumn"
            :sortDirection="sortDirection"
            :resizable="resizable"
            @sort="handleSort"
          />
        </tr>
      </thead>
      <tbody>
        <KTableRow
          v-if="loading"
          :columns="columns"
          :loading="loading"
          :striped="striped"
          :bordered="bordered"
          :hoverable="hoverable"
        />
        <KTableRow
          v-else
          v-for="(row, rowIndex) in filteredAndSortedData"
          :key="rowIndex"
          :columns="columns"
          :rowData="row"
          :striped="striped"
          :bordered="bordered"
          :hoverable="hoverable"
          @update:row="handleRowUpdate(row._originalIndex, $event)"
        />
        <tr v-if="!loading && filteredAndSortedData.length === 0">
          <td :colspan="columns.length" class="no-data">
            No data found
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue'
import KTableRow from './KTableRow.vue'
import KTableHeader from './KTableHeader.vue'

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
  data: {
    type: Array as PropType<Array<Record<string, any>>>,
    required: true
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
  },
  sortable: {
    type: Boolean,
    default: true
  },
  searchable: {
    type: Boolean,
    default: true
  },
  maxHeight: {
    type: String,
    default: null
  },
  resizable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (e: 'update:data', data: Array<Record<string, any>>): void
}>()

const searchQuery = ref('')
const sortColumn = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const handleSort = (data: { column: Column; direction: 'asc' | 'desc' }) => {
  if (sortColumn.value === data.column.data && sortDirection.value === data.direction) {
    // Clear sort if clicking same direction
    sortColumn.value = null
    sortDirection.value = 'asc'
  } else {
    sortColumn.value = data.column.data
    sortDirection.value = data.direction
  }
}

const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query) return true

  const textLower = String(text).toLowerCase()
  const queryLower = query.toLowerCase()

  // Exact match
  if (textLower.includes(queryLower)) return true

  // Fuzzy match - check if all characters in query appear in order in text
  let queryIndex = 0
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++
    }
  }

  return queryIndex === queryLower.length
}

const filteredAndSortedData = computed(() => {
  let result = props.data.map((row, index) => ({ ...row, _originalIndex: index }))

  // Apply search filter
  if (searchQuery.value && props.searchable) {
    const query = searchQuery.value.trim()
    result = result.filter(row => {
      return props.columns.some(col => {
        if (col.type === 'action') return false
        const value = row[col.data]
        if (value === null || value === undefined) return false
        return fuzzyMatch(value, query)
      })
    })
  }

  // Apply sorting
  if (sortColumn.value && props.sortable) {
    const column = props.columns.find(col => col.data === sortColumn.value)
    if (column) {
      result.sort((a, b) => {
        const aVal = a[sortColumn.value!]
        const bVal = b[sortColumn.value!]

        // Handle null/undefined
        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        let comparison = 0

        if (column.type === 'number') {
          comparison = Number(aVal) - Number(bVal)
        } else if (column.type === 'boolean') {
          comparison = (aVal === bVal) ? 0 : aVal ? -1 : 1
        } else if (column.type === 'time') {
          const dateA = new Date(aVal).getTime()
          const dateB = new Date(bVal).getTime()
          comparison = dateA - dateB
        } else {
          // String comparison
          comparison = String(aVal).localeCompare(String(bVal))
        }

        return sortDirection.value === 'asc' ? comparison : -comparison
      })
    }
  }

  return result
})

const handleRowUpdate = (rowIndex: number, updateData: { column: string; value: any }) => {
  const updatedData = [...props.data]
  updatedData[rowIndex] = {
    ...updatedData[rowIndex],
    [updateData.column]: updateData.value
  }
  emit('update:data', updatedData)
}
</script>

<style scoped>
.table-wrapper {
  overflow-x: auto;
}

.search-container {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--bs-border-color, #dee2e6);
  border-radius: 0.375rem;
  background: var(--bs-body-bg, white);
  color: var(--bs-body-color, black);
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--bs-primary, #0d6efd);
  box-shadow: 0 0 0 0.25rem var(--bs-primary-bg-subtle, rgba(13, 110, 253, 0.25));
}

.table-scroll {
  position: relative;
  border-radius: 0.375rem;
  overflow-x: auto;
}

.table-scroll::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-scroll::-webkit-scrollbar-track {
  background: var(--bs-tertiary-bg, #f8f9fa);
  border-radius: 4px;
}

.table-scroll::-webkit-scrollbar-thumb {
  background: var(--bs-secondary, #6c757d);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.table-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--bs-emphasis-color, #495057);
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 0.375rem;
  overflow: hidden;
}

.table.resizable {
  table-layout: auto;
}

.table.bordered {
  border: 1px solid var(--bs-border-color, #dee2e6);
}

.table.bordered th,
.table.bordered td {
  border: 1px solid var(--bs-border-color, rgba(0, 0, 0, 0.08));
}

.table td {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background: var(--bs-body-bg, #ffffff);
  color: var(--bs-body-color, #212529);
  transition: all 0.15s ease;
  border-bottom: 1px solid var(--bs-border-color, rgba(0, 0, 0, 0.05));
}

.table.striped tbody tr:nth-child(odd) td {
  background: var(--bs-tertiary-bg, #f8f9fa);
}

.table.hoverable tbody tr:hover td {
  background: var(--bs-primary-bg-subtle, rgba(13, 110, 253, 0.08));
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--bs-secondary, #6c757d);
  font-style: italic;
  font-size: 0.875rem;
}
</style>
