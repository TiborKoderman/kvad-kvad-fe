<template>
  <div class="k-table">
    <div v-if="searchable" class="k-table__search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="k-table__search-input"
        @input="onSearchInput"
      />
    </div>

    <div
      ref="scrollRef"
      class="k-table__scroll"
      :class="{ 'k-table__scroll--bordered': bordered }"
      :style="scrollStyle"
    >
      <table :class="[
        'k-table__table',
        {
          striped,
          bordered,
          hoverable,
          'actions-reveal-on-hover': actionsRevealOnRowHover,
        },
      ]">
        <colgroup>
          <col
            v-for="(column, index) in columns"
            :key="`col-${index}-${column.data}`"
            :style="getColumnStyle(column, index)"
          />
        </colgroup>

        <thead>
          <tr>
            <KTableHeader
              v-for="(column, index) in columns"
              :key="`th-${index}-${column.data}`"
              :index="index"
              :column="column"
              :sortable="sortable && column.type !== 'action'"
              :sortColumn="sortColumn"
              :sortDirection="sortDirection"
              :resizable="resizable"
              @sort="handleSort"
              @resize-start="handleResizeStart"
            />
          </tr>
        </thead>

        <tbody>
          <template v-if="isFetching || loading">
            <tr v-for="index in pageSize" :key="`skeleton-${index}`">
              <td v-for="(_, cellIndex) in columns" :key="`skeleton-cell-${cellIndex}`">
                <div class="k-table__skeleton"></div>
              </td>
            </tr>
          </template>

          <template v-else-if="pagedData.length === 0">
            <tr class="k-table__empty-row">
              <td :colspan="columns.length">No data found</td>
            </tr>
          </template>

          <template v-else>
            <KTableRow
              v-for="(row, rowIndex) in pagedData"
              :key="`row-${getRowKey(row, rowIndex)}`"
              :columns="columns"
              :rowData="row"
              :collapsible="collapsibleRows"
              :expanded="expandedRowKeys.has(getRowKey(row, rowIndex))"
              @toggle-expand="toggleRowExpand(getRowKey(row, rowIndex))"
              @update:row="handleRowUpdate(row._originalIndex, $event)"
            />
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="showPagination" class="k-table__pagination">
      <span class="k-table__page-info">
        {{ pageStart + 1 }}–{{ pageEnd }} of {{ totalCount }}
      </span>
      <div class="k-table__page-controls">
        <button class="k-table__page-btn" :disabled="currentPage === 1" @click="goToPage(1)">
          <i class="bi bi-chevron-double-left"></i>
        </button>
        <button class="k-table__page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button
          v-for="page in pageNumbers"
          :key="page"
          class="k-table__page-btn"
          :class="{ 'k-table__page-btn--active': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button class="k-table__page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
          <i class="bi bi-chevron-right"></i>
        </button>
        <button class="k-table__page-btn" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">
          <i class="bi bi-chevron-double-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CSSProperties, PropType } from 'vue'
import KTableHeader from './KTableHeader.vue'
import KTableRow from './KTableRow.vue'

type Primitive = string | number | boolean | null | undefined

type TableRow = Record<string, unknown> & {
  _originalIndex?: number
}

type ActionConfig = {
  label: string
  variant?: string
  disabled?: boolean
  icon?: string
  handler: (row: Record<string, unknown>) => void
}

export interface Column {
  title: string
  data: string
  type?: 'string' | 'number' | 'boolean' | 'action' | 'time' | 'guid'
  editable?: boolean
  actions?: ActionConfig[]
  revealOnRowHover?: boolean
  precision?: number
  format?: string
  showElapsed?: boolean
  dateOnly?: boolean
  timeOnly?: boolean
  customFormat?: string
  width?: string
}

const props = defineProps({
  columns: { type: Array as PropType<Column[]>, required: true },
  data: { type: Array as PropType<unknown[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  striped: { type: Boolean, default: false },
  bordered: { type: Boolean, default: false },
  hoverable: { type: Boolean, default: false },
  sortable: { type: Boolean, default: true },
  searchable: { type: Boolean, default: true },
  maxHeight: { type: String, default: null },
  maxRows: { type: Number, default: null },
  rowHeight: { type: Number, default: 42 },
  paginated: { type: Boolean, default: false },
  pageSize: { type: Number, default: 10 },
  resizable: { type: Boolean, default: false },
  fetchUrl: { type: String, default: null },
  tableId: { type: String, default: null },
  actionsRevealOnRowHover: { type: Boolean, default: false },
  collapsibleRows: { type: Boolean, default: true },
  actionColumnMinWidth: { type: String, default: '3rem' },
})

const emit = defineEmits<{
  (e: 'update:data', data: unknown[]): void
}>()

const scrollRef = ref<HTMLElement | null>(null)

const searchQuery = ref('')
const sortColumn = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const isFetching = ref(false)
const serverData = ref<TableRow[]>([])
const serverTotal = ref(0)
const expandedRowKeys = ref<Set<number>>(new Set())

let searchTimer: ReturnType<typeof setTimeout> | null = null

const isArrayRow = (row: unknown): row is unknown[] => Array.isArray(row)
const normalizeRows = (rows: unknown[]): TableRow[] => {
  if (!rows.length) return []

  if (isArrayRow(rows[0])) {
    return (rows as unknown[][]).map((row) =>
      Object.fromEntries(props.columns.map((column, index) => [column.data, row[index]]))
    ) as TableRow[]
  }

  return rows as TableRow[]
}

const normalizedData = computed<TableRow[]>(() => normalizeRows(props.data))

const fuzzyMatch = (value: Primitive, query: string): boolean => {
  if (value === null || value === undefined) return false
  const text = String(value).toLowerCase()
  const needle = query.toLowerCase()

  if (text.includes(needle)) return true

  let queryIndex = 0
  for (let index = 0; index < text.length && queryIndex < needle.length; index++) {
    if (text[index] === needle[queryIndex]) queryIndex++
  }

  return queryIndex === needle.length
}

const filteredData = computed<TableRow[]>(() => {
  const rows = normalizedData.value.map((row, index) => ({ ...row, _originalIndex: index }))

  if (!searchQuery.value || !props.searchable || props.fetchUrl) {
    return rows
  }

  const query = searchQuery.value.trim()
  if (!query.length) return rows

  return rows.filter(row => props.columns.some(column => {
    if (column.type === 'action') return false
    return fuzzyMatch(row[column.data] as Primitive, query)
  }))
})

const sortedData = computed<TableRow[]>(() => {
  if (!sortColumn.value || !props.sortable || props.fetchUrl) return filteredData.value

  const selectedColumn = props.columns.find(column => column.data === sortColumn.value)
  if (!selectedColumn) return filteredData.value

  return [...filteredData.value].sort((a, b) => {
    const aValue = a[sortColumn.value!]
    const bValue = b[sortColumn.value!]

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    let result = 0
    if (selectedColumn.type === 'number') {
      result = Number(aValue) - Number(bValue)
    } else if (selectedColumn.type === 'boolean') {
      result = aValue === bValue ? 0 : aValue ? -1 : 1
    } else if (selectedColumn.type === 'time') {
      result = new Date(String(aValue)).getTime() - new Date(String(bValue)).getTime()
    } else {
      result = String(aValue).localeCompare(String(bValue))
    }

    return sortDirection.value === 'asc' ? result : -result
  })
})

const activeData = computed<TableRow[]>(() => props.fetchUrl ? serverData.value : sortedData.value)
const showPagination = computed(() => props.paginated || !!props.fetchUrl)
const totalCount = computed(() => props.fetchUrl ? serverTotal.value : activeData.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / props.pageSize)))
const pageStart = computed(() => (currentPage.value - 1) * props.pageSize)
const pageEnd = computed(() => Math.min(pageStart.value + props.pageSize, totalCount.value))

const pagedData = computed<TableRow[]>(() => {
  if (!showPagination.value) return activeData.value
  return activeData.value.slice(pageStart.value, pageEnd.value)
})

const pageNumbers = computed(() => {
  const min = Math.max(1, currentPage.value - 2)
  const max = Math.min(totalPages.value, currentPage.value + 2)
  return Array.from({ length: max - min + 1 }, (_, index) => min + index)
})

const scrollStyle = computed<CSSProperties>(() => {
  if (props.maxHeight) {
    return { maxHeight: props.maxHeight, overflowY: 'auto' }
  }

  if (props.maxRows && props.maxRows > 0) {
    const estimatedHeaderHeight = props.rowHeight
    return {
      maxHeight: `${props.maxRows * props.rowHeight + estimatedHeaderHeight}px`,
      overflowY: 'auto',
    }
  }

  return {}
})

const getRowKey = (row: TableRow, rowIndex: number) => {
  if (typeof row._originalIndex === 'number') {
    return props.fetchUrl ? pageStart.value + row._originalIndex : row._originalIndex
  }
  return pageStart.value + rowIndex
}

const toggleRowExpand = (key: number) => {
  const next = new Set(expandedRowKeys.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  expandedRowKeys.value = next
}

const goToPage = (page: number) => {
  currentPage.value = Math.min(Math.max(1, page), totalPages.value)
  expandedRowKeys.value = new Set()
  if (props.fetchUrl) fetchData()
}

const onSearchInput = () => {
  if (!props.fetchUrl) return
  if (searchTimer) clearTimeout(searchTimer)

  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 300)
}

const handleSort = (payload: { column: Column; direction: 'asc' | 'desc' }) => {
  if (sortColumn.value === payload.column.data && sortDirection.value === payload.direction) {
    sortColumn.value = null
    sortDirection.value = 'asc'
  } else {
    sortColumn.value = payload.column.data
    sortDirection.value = payload.direction
  }

  currentPage.value = 1
  expandedRowKeys.value = new Set()

  if (props.fetchUrl) {
    fetchData()
  }
}

const fetchData = async () => {
  if (!props.fetchUrl) return

  isFetching.value = true
  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      limit: String(props.pageSize),
      ...(sortColumn.value ? { sort: sortColumn.value, order: sortDirection.value } : {}),
      ...(searchQuery.value ? { search: searchQuery.value } : {}),
    })

    const response = await fetch(`${props.fetchUrl}?${params}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const json = await response.json()
    const rows = Array.isArray(json) ? json : json?.data
    const total = Array.isArray(json) ? json.length : Number(json?.total ?? 0)

    serverData.value = normalizeRows(Array.isArray(rows) ? rows : []).map((row, index) => ({ ...row, _originalIndex: index }))
    serverTotal.value = total
  } catch (error) {
    console.error('[KTable] fetch error:', error)
    serverData.value = []
    serverTotal.value = 0
  } finally {
    isFetching.value = false
  }
}

const handleRowUpdate = (rowIndex: number | undefined, payload: { column: string; value: unknown }) => {
  if (props.fetchUrl || rowIndex === undefined) return

  if (Array.isArray(props.data[0])) {
    const updated = (props.data as unknown[][]).map((row, index) => {
      if (index !== rowIndex) return row

      const next = [...row]
      const columnIndex = props.columns.findIndex(column => column.data === payload.column)
      if (columnIndex >= 0) {
        next[columnIndex] = payload.value
      }
      return next
    })

    emit('update:data', updated)
    return
  }

  const updated = normalizedData.value.map((row, index) => {
    if (index !== rowIndex) return row
    return {
      ...row,
      [payload.column]: payload.value,
    }
  })

  emit('update:data', updated)
}

const isFixedWidthColumn = (column: Column) => typeof column.width === 'string' && column.width.trim().length > 0
const isResizableColumn = (index: number) => {
  const column = props.columns[index]
  if (!column) return false
  return !isFixedWidthColumn(column) && column.type !== 'action'
}

const columnRatios = ref<number[]>([])
const userResizedColumns = ref(false)
const loadedRatiosFromStorage = ref(false)
const measuredFromData = ref(false)

const columnsSignature = computed(() => props.columns.map(column => `${column.data}:${column.width ?? ''}`).join('|'))
const ratioStorageKey = computed(() => {
  const identity = props.tableId || columnsSignature.value
  return `k-table-ratios:${identity}`
})

const createMeasuredRatios = () => {
  const sampleRows = activeData.value.slice(0, 200)

  const weights = props.columns.map(column => {
    if (isFixedWidthColumn(column) || column.type === 'action') return 0

    let longest = Math.max(6, column.title.length)
    for (const row of sampleRows) {
      const value = row[column.data]
      longest = Math.max(longest, String(value ?? '').length)
    }

    if (column.type === 'guid') {
      longest = Math.max(longest, 12)
    }

    return Math.min(40, longest)
  })

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)

  if (!totalWeight) {
    const resizableCount = props.columns.filter((column, index) => isResizableColumn(index)).length
    return props.columns.map((_, index) => isResizableColumn(index) ? 1 / Math.max(1, resizableCount) : 0)
  }

  return weights.map(weight => weight > 0 ? weight / totalWeight : 0)
}

const saveRatios = () => {
  if (!props.resizable) return
  localStorage.setItem(ratioStorageKey.value, JSON.stringify(columnRatios.value))
}

const loadRatios = () => {
  if (!props.resizable) return false

  try {
    const raw = localStorage.getItem(ratioStorageKey.value)
    if (!raw) return false

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== props.columns.length) return false

    const valid = parsed.every((value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0)
    if (!valid) return false

    columnRatios.value = parsed as number[]
    loadedRatiosFromStorage.value = true
    return true
  } catch {
    return false
  }
}

const initializeRatios = () => {
  if (loadRatios()) return

  columnRatios.value = createMeasuredRatios()
  measuredFromData.value = activeData.value.length > 0
}

const findNextResizableIndex = (index: number) => {
  for (let current = index + 1; current < props.columns.length; current++) {
    if (isResizableColumn(current)) return current
  }
  return -1
}

type ResizeState = {
  leftIndex: number
  rightIndex: number
  startX: number
  startLeftRatio: number
  startRightRatio: number
  tableWidth: number
}

const resizeState = ref<ResizeState | null>(null)

const handleResizeMove = (event: MouseEvent) => {
  const state = resizeState.value
  if (!state) return

  const deltaRatio = (event.clientX - state.startX) / Math.max(state.tableWidth, 1)
  const pairTotal = state.startLeftRatio + state.startRightRatio
  const minRatio = 0.04

  let nextLeft = state.startLeftRatio + deltaRatio
  nextLeft = Math.max(minRatio, Math.min(pairTotal - minRatio, nextLeft))
  const nextRight = pairTotal - nextLeft

  const nextRatios = [...columnRatios.value]
  nextRatios[state.leftIndex] = nextLeft
  nextRatios[state.rightIndex] = nextRight

  columnRatios.value = nextRatios
  userResizedColumns.value = true
  saveRatios()
}

const stopResize = () => {
  resizeState.value = null
  window.removeEventListener('mousemove', handleResizeMove)
  window.removeEventListener('mouseup', stopResize)
}

const handleResizeStart = ({ index, event }: { index: number; event: MouseEvent }) => {
  if (!props.resizable) return
  if (!isResizableColumn(index)) return

  const rightIndex = findNextResizableIndex(index)
  if (rightIndex < 0) return

  if (columnRatios.value.length !== props.columns.length) {
    columnRatios.value = createMeasuredRatios()
  }

  const tableWidth = scrollRef.value?.querySelector('table')?.clientWidth || scrollRef.value?.clientWidth || 1
  resizeState.value = {
    leftIndex: index,
    rightIndex,
    startX: event.clientX,
    startLeftRatio: columnRatios.value[index] || 0,
    startRightRatio: columnRatios.value[rightIndex] || 0,
    tableWidth,
  }

  window.addEventListener('mousemove', handleResizeMove)
  window.addEventListener('mouseup', stopResize)
}

const getColumnStyle = (column: Column, index: number): CSSProperties => {
  if (isFixedWidthColumn(column)) {
    return {
      width: column.width,
      minWidth: column.width,
      maxWidth: column.width,
    }
  }

  if (column.type === 'action') {
    return {
      width: '1%',
      minWidth: props.actionColumnMinWidth,
    }
  }

  const ratio = columnRatios.value[index] || 0
  if (ratio <= 0) return {}

  return {
    width: `${(ratio * 100).toFixed(3)}%`,
  }
}

watch(() => props.data, () => {
  if (!props.fetchUrl) {
    currentPage.value = 1
    expandedRowKeys.value = new Set()
  }
})

watch(searchQuery, () => {
  if (!props.fetchUrl) {
    currentPage.value = 1
    expandedRowKeys.value = new Set()
  }
})

watch(columnsSignature, () => {
  userResizedColumns.value = false
  loadedRatiosFromStorage.value = false
  measuredFromData.value = false
  initializeRatios()
}, { immediate: true })

watch(() => activeData.value.length, (count) => {
  if (loadedRatiosFromStorage.value || userResizedColumns.value || measuredFromData.value) return
  if (count <= 0) return

  columnRatios.value = createMeasuredRatios()
  measuredFromData.value = true
})

onMounted(() => {
  if (props.fetchUrl) {
    fetchData()
  }
})

onBeforeUnmount(() => {
  stopResize()
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
.k-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.k-table__search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--t-border-color);
  background: var(--t-input-bg);
  color: var(--t-input-color);
  font-size: 0.875rem;
}

.k-table__search-input:focus {
  outline: none;
  border-color: var(--t-primary);
  border-width: 2px;
  padding: calc(0.4rem - 1px) calc(0.75rem - 1px);
}

.k-table__scroll {
  overflow-x: auto;
}

.k-table__scroll--bordered {
  border: 1px solid var(--t-table-border-color);
}

:deep(.k-table__table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
}

:deep(.k-table__table thead th) {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background: var(--t-table-header-bg);
  color: var(--t-body-color);
  box-shadow: 0 1px 0 var(--t-table-border-color);
}

:deep(.k-table__table tbody td) {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  overflow: hidden;
  background: var(--t-table-body-bg);
  color: var(--t-body-color);
  border-bottom: 1px solid var(--t-table-border-color);
}

:deep(.k-table__table tbody td:focus-within) {
  box-shadow: inset 0 0 0 2px var(--t-primary);
  background: var(--t-input-bg) !important;
}

:deep(.k-table__table tbody tr:last-child td) {
  border-bottom: none;
}

:deep(.k-table__table.bordered thead th),
:deep(.k-table__table.bordered tbody td) {
  border-right: 1px solid var(--t-table-border-color);
}

:deep(.k-table__table.bordered thead th:last-child),
:deep(.k-table__table.bordered tbody td:last-child) {
  border-right: none;
}

:deep(.k-table__table th[data-col-type='action']),
:deep(.k-table__table td[data-col-type='action']) {
  width: 1%;
  white-space: nowrap;
}

:deep(.k-table__table.striped tbody tr:nth-child(odd):not(.k-table__empty-row) td) {
  background: var(--t-table-body-striped-bg);
}

:deep(.k-table__table.hoverable tbody tr:not(.k-table__empty-row):hover td) {
  background: var(--t-table-hover-bg);
}

:deep(.k-table__table.hoverable.striped tbody tr:nth-child(odd):not(.k-table__empty-row):hover td) {
  background: var(--t-table-hover-striped-bg);
}

:deep(.k-table__table.actions-reveal-on-hover tbody td[data-col-type='action'] .action-cell),
:deep(.k-table__table tbody td[data-reveal-on-hover='true'] .action-cell) {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

:deep(.k-table__table.actions-reveal-on-hover tbody tr:hover td[data-col-type='action'] .action-cell),
:deep(.k-table__table tbody tr:hover td[data-reveal-on-hover='true'] .action-cell),
:deep(.k-table__table.actions-reveal-on-hover tbody tr:focus-within td[data-col-type='action'] .action-cell),
:deep(.k-table__table tbody tr:focus-within td[data-reveal-on-hover='true'] .action-cell) {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

:deep(.k-table__table tbody tr.is-collapsible:not(.is-expanded)) {
  cursor: pointer;
}

:deep(.k-table__table tbody tr.is-collapsible:not(.is-expanded) td > :not(.action-cell)) {
  max-height: 1.5rem;
  overflow: hidden;
}

:deep(.k-table__table tbody tr.is-collapsible:not(.is-expanded) td[data-col-type='action']) {
  cursor: default;
}

:deep(.k-table__empty-row td) {
  text-align: center;
  padding: 2rem 0.75rem;
  color: var(--t-body-color);
  opacity: 0.5;
  font-style: italic;
  font-size: 0.875rem;
}

.k-table__skeleton {
  height: 0.875rem;
  background: linear-gradient(
    90deg,
    var(--t-table-border-color) 25%,
    var(--t-card-bg) 50%,
    var(--t-table-border-color) 75%
  );
  background-size: 200% 100%;
  animation: k-shimmer 1.4s infinite;
}

@keyframes k-shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.k-table__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--t-body-color);
  opacity: 0.85;
}

.k-table__page-controls {
  display: flex;
  gap: 0.25rem;
}

.k-table__page-btn {
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.4rem;
  border: 1px solid var(--t-table-border-color);
  background: var(--t-table-body-bg);
  color: var(--t-body-color);
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s, border-color 0.12s;
}

.k-table__page-btn:hover:not(:disabled) {
  background: var(--t-table-hover-bg);
  border-color: var(--t-primary);
}

.k-table__page-btn--active {
  background: var(--t-primary) !important;
  color: var(--txt-primary) !important;
  border-color: var(--t-primary) !important;
}

.k-table__page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
