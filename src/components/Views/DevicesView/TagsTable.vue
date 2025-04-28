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
          <td v-for="(column, colIndex) in columns" :key="colIndex">
            <input
              v-if="column.editable"
              type="text"
              class="form-control"
              v-model="row[column.key]"
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
import { ref } from 'vue'

const tableData = ref([
  { id: 1, name: 'Tag 1', description: 'Description 1' },
  { id: 2, name: 'Tag 2', description: 'Description 2' },
])

const columns = [
  { key: 'id', title: 'ID', editable: false },
  { key: 'name', title: 'Name', editable: true },
  { key: 'description', title: 'Description', editable: true },
]

const options = {
  paging: true,
  searching: true,
  ordering: true,
}

const layout = {
  theme: 'bootstrap',
}

const tableKey = ref(0) // Add a reactive key for the table

function addTag() {
  tableData.value.push({ id: tableData.value.length + 1, name: '', description: '' })
  tableKey.value++ // Increment the key to force re-rendering
}
</script>

<style scoped>
</style>