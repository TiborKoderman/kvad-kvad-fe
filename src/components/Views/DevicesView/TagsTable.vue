<template>
  <div>
    <DataTable
      :data="tableData"
      :columns="columns"
      :options="options"
      :layout="layout"
      :key="tableKey"
      class="table table-bordered table-hover"
    >
      <template #body>
        <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
          <td
            v-for="(column, colIndex) in columns"
            :key="colIndex"
            @click="editCell(rowIndex, colIndex)"
          >
            <input
              v-if="isEditing(rowIndex, colIndex) && column.editable"
              type="text"
              class="form-control"
              v-model="row[column.key]"
              @blur="stopEditing"
            />
            <span v-else>{{ row[column.key] }}</span>
          </td>
        </tr>
      </template>
      <tfoot>
        <tr>
          <td :colspan="columns.length" class="text-center">
            <button @click="addTag" class="btn btn-primary">Add Tag</button>
          </td>
        </tr>
      </tfoot>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const tableData = ref([
  { id: 1, name: 'Tag 1', description: 'Description 1' },
  { id: 2, name: 'Tag 2', description: 'Description 2' },
])

const columns = [
  { key: 'id', title: 'ID', data: 'id', editable: false },
  { key: 'name', title: 'Name', data: 'name', editable: true },
  { key: 'description', title: 'Description', data: 'description', editable: true },
]

const options = {
  paging: true,
  searching: true,
  ordering: true,
}

const layout = {
  theme: 'bootstrap',
}

const tableKey = ref(0)

// Reactive properties to track the currently edited cell
const editingCell = ref<{ rowIndex: number; colIndex: number } | null>(null)

function isEditing(rowIndex: number, colIndex: number) {
  return editingCell.value?.rowIndex === rowIndex && editingCell.value?.colIndex === colIndex
}

function editCell(rowIndex: number, colIndex: number) {
  editingCell.value = { rowIndex, colIndex }
}

function stopEditing() {
  editingCell.value = null
}

// Debugging: Log tableData and columns to ensure they are correct
watch(tableData, (newData) => {
  console.log('Updated tableData:', newData)
})
watch(columns, (newColumns) => {
  console.log('Updated columns:', newColumns)
})

function addTag() {
  tableData.value.push({ id: tableData.value.length + 1, name: '', description: '' })
  tableKey.value++ // Increment the key to force re-rendering
}
</script>

<style scoped>
</style>