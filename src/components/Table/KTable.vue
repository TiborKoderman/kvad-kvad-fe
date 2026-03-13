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
      class="k-table__scroll"
      :class="{ 'k-table__scroll--bordered': bordered }"
      :style="maxHeight ? { maxHeight, overflowY: 'auto' } : {}"
    >
      <table :class="['k-table__table', { striped, bordered, hoverable }]">
        <thead>
          <tr>
            <KTableHeader
              v-for="(col, i) in columns"
              :key="i"
              :column="col"
              :sortable="sortable && col.type !== 'action'"
              :sortColumn="sortColumn"
              :sortDirection="sortDirection"
              :resizable="resizable"
              @sort="handleSort"
            />
          </tr>
        </thead>
        <tbody>
          <template v-if="isFetching || loading">
            <tr v-for="i in props.pageSize" :key="`sk-${i}`">
              <td v-for="(_, j) in columns" :key="`sk-td-${j}`">
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
              v-for="(row, i) in pagedData"
              :key="i"
              :columns="columns"
              :rowData="row"
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
          v-for="p in pageNumbers"
          :key="p"
          class="k-table__page-btn"
          :class="{ 'k-table__page-btn--active': p === currentPage }"
          @click="goToPage(p)"
        >{{ p }}</button>
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
import { computed, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import KTableRow from './KTableRow.vue'
import KTableHeader from './KTableHeader.vue'

export interface Column {
  title: string
  data: string
  type?: 'string' | 'number' | 'boolean' | 'action' | 'time' | 'guid'
  editable?: boolean
  actions?: Array<{
    label: string
    variant?: string
    disabled?: boolean
    handler: (row: any) => void
  }>
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
  // Accepts both object rows (Record<string,any>[]) and array rows (any[][])
  data: { type: Array as PropType<any[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  striped: { type: Boolean, default: false },
  bordered: { type: Boolean, default: false },
  hoverable: { type: Boolean, default: false },
  sortable: { type: Boolean, default: true },
  searchable: { type: Boolean, default: true },
  maxHeight: { type: String, default: null },
  paginated: { type: Boolean, default: false },
  pageSize: { type: Number, default: 10 },
  resizable: { type: Boolean, default: false },
  // When set, the table fetches data from this URL and handles server-side pagination
  fetchUrl: { type: String, default: null },
})

const emit = defineEmits<{
  (e: 'update:data', data: Record<string, any>[]): void
}>()

// --- Search ---
const searchQuery = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

const onSearchInput = () => {
  if (!props.fetchUrl) return
  clearTimeout(searchTimer!)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 300)
}

// --- Sort ---
const sortColumn = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')

const handleSort = ({ column, direction }: { column: Column; direction: 'asc' | 'desc' }) => {
  if (sortColumn.value === column.data && sortDirection.value === direction) {
    sortColumn.value = null
    sortDirection.value = 'asc'
  } else {
    sortColumn.value = column.data
    sortDirection.value = direction
  }
  if (props.fetchUrl) {
    currentPage.value = 1
    fetchData()
  }
}

// --- Server-side fetch ---
const serverData = ref<Record<string, any>[]>([])
const serverTotal = ref(0)
const isFetching = ref(false)

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
    const res = await fetch(`${props.fetchUrl}?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const raw: any[] = Array.isArray(json) ? json : json.data
    const total: number = Array.isArray(json) ? json.length : json.total
    serverData.value = normalizeRows(raw).map((row, i) => ({ ...row, _originalIndex: i }))
    serverTotal.value = total
  } catch (e) {
    console.error('[KTable] fetch error:', e)
    serverData.value = []
    serverTotal.value = 0
  } finally {
    isFetching.value = false
  }
}

onMounted(() => {
  if (props.fetchUrl) fetchData()
})

// --- Data normalization: array-of-arrays → object rows ---
const normalizeRows = (rows: any[]): Record<string, any>[] => {
  if (!rows.length || !Array.isArray(rows[0])) return rows as Record<string, any>[]
  return (rows as any[][]).map(row =>
    Object.fromEntries(props.columns.map((col, i) => [col.data, row[i]]))
  )
}

const normalizedData = computed(() => normalizeRows(props.data))

// --- Client-side filter ---
const filteredData = computed(() => {
  const rows = normalizedData.value.map((row, i) => ({ ...row, _originalIndex: i }))
  if (!searchQuery.value || !props.searchable || props.fetchUrl) return rows
  const q = searchQuery.value.trim().toLowerCase()
  return rows.filter(row =>
    props.columns.some(col => {
      if (col.type === 'action') return false
      const v = row[col.data]
      if (v == null) return false
      const t = String(v).toLowerCase()
      if (t.includes(q)) return true
      let qi = 0
      for (let k = 0; k < t.length && qi < q.length; k++) if (t[k] === q[qi]) qi++
      return qi === q.length
    })
  )
})

// --- Client-side sort ---
const sortedData = computed(() => {
  if (!sortColumn.value || !props.sortable || props.fetchUrl) return filteredData.value
  const col = props.columns.find(c => c.data === sortColumn.value)!
  return [...filteredData.value].sort((a, b) => {
    const av = a[sortColumn.value!], bv = b[sortColumn.value!]
    if (av == null) return 1
    if (bv == null) return -1
    let cmp = 0
    if (col.type === 'number') cmp = Number(av) - Number(bv)
    else if (col.type === 'boolean') cmp = av === bv ? 0 : av ? -1 : 1
    else if (col.type === 'time') cmp = new Date(av).getTime() - new Date(bv).getTime()
    else cmp = String(av).localeCompare(String(bv))
    return sortDirection.value === 'asc' ? cmp : -cmp
  })
})

// --- Pagination ---
const currentPage = ref(1)
const activeData = computed(() => props.fetchUrl ? serverData.value : sortedData.value)
const totalCount = computed(() => props.fetchUrl ? serverTotal.value : activeData.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / props.pageSize)))
const showPagination = computed(() => props.paginated || !!props.fetchUrl)
const pageStart = computed(() => (currentPage.value - 1) * props.pageSize)
const pageEnd = computed(() => Math.min(pageStart.value + props.pageSize, totalCount.value))

const pagedData = computed(() => {
  if (!showPagination.value) return activeData.value
  return activeData.value.slice(pageStart.value, pageEnd.value)
})

const pageNumbers = computed(() => {
  const cur = currentPage.value
  const min = Math.max(1, cur - 2)
  const max = Math.min(totalPages.value, cur + 2)
  return Array.from({ length: max - min + 1 }, (_, i) => min + i)
})

const goToPage = (p: number) => {
  currentPage.value = Math.min(Math.max(1, p), totalPages.value)
  if (props.fetchUrl) fetchData()
}

watch(() => props.data, () => { if (!props.fetchUrl) currentPage.value = 1 })
watch(searchQuery, () => { if (!props.fetchUrl) currentPage.value = 1 })

// --- Row update ---
const handleRowUpdate = (originalIndex: number | undefined, update: { column: string; value: any }) => {
  if (props.fetchUrl || originalIndex === undefined) return
  const isArrayData = Array.isArray(props.data[0])
  if (isArrayData) {
    const updated = (props.data as any[][]).map((row, i) => {
      if (i !== originalIndex) return row
      const newRow = [...row]
      const colIdx = props.columns.findIndex(c => c.data === update.column)
      if (colIdx >= 0) newRow[colIdx] = update.value
      return newRow
    })
    emit('update:data', updated as any)
  } else {
    const updated = normalizedData.value.map((row, i) =>
      i === originalIndex ? { ...row, [update.column]: update.value } : row
    )
    emit('update:data', updated)
  }
}
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
  /* overflow-y only applied via :style when maxHeight prop is set */
}

.k-table__scroll--bordered {
  border: 1px solid var(--t-table-border-color);
}

/* Use separate borders so we can fully control each edge independently.
   This is required for sticky headers to work with a clean bottom border. */
:deep(.k-table__table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

/* Sticky header.
   box-shadow replaces border-bottom: with border-collapse:separate the cell
   border would be clipped by the overflow container when the header sticks.
   box-shadow is painted above the stacking context and remains visible. */
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

/* Body cells */
:deep(.k-table__table tbody td) {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  overflow: hidden;
  background: var(--t-table-body-bg);
  color: var(--t-body-color);
  border-bottom: 1px solid var(--t-table-border-color);
}

/* Editing state: highlight the whole td instead of an inner box */
:deep(.k-table__table tbody td:focus-within) {
  box-shadow: inset 0 0 0 2px var(--t-primary);
  background: var(--t-input-bg) !important;
}

/* Last row: no bottom border (wrapper or table edge serves as boundary) */
:deep(.k-table__table tbody tr:last-child td) {
  border-bottom: none;
}

/* Bordered: add column separators */
:deep(.k-table__table.bordered thead th) {
  border-right: 1px solid var(--t-table-border-color);
}

:deep(.k-table__table.bordered thead th:last-child) {
  border-right: none;
}

:deep(.k-table__table.bordered tbody td) {
  border-right: 1px solid var(--t-table-border-color);
}

:deep(.k-table__table.bordered tbody td:last-child) {
  border-right: none;
}

/* Striped (skip the empty-state row) */
:deep(.k-table__table.striped tbody tr:nth-child(odd):not(.k-table__empty-row) td) {
  background: var(--t-table-body-striped-bg);
}

/* Hoverable */
:deep(.k-table__table.hoverable tbody tr:not(.k-table__empty-row):hover td) {
  background: var(--t-table-hover-bg);
}

:deep(.k-table__table.hoverable.striped tbody tr:nth-child(odd):not(.k-table__empty-row):hover td) {
  background: var(--t-table-hover-striped-bg);
}

/* Empty state */
:deep(.k-table__empty-row td) {
  text-align: center;
  padding: 2rem 0.75rem;
  color: var(--t-body-color);
  opacity: 0.5;
  font-style: italic;
  font-size: 0.875rem;
}

/* Skeleton loading shimmer */
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
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Pagination */
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
