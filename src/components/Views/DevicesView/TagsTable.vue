<template>
  <div>
    <table class="table table-bordered table-hover">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" class="text-center">
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in device.tags" :key="rowIndex">
          <td
            v-for="(column, colIndex) in columns"
            :key="colIndex"
            :class="['text-center', { 'shrink': ['enabled', 'historicize'].includes(column.key) }]"
            @click="editCell(rowIndex, colIndex)"
          >
            <template v-if="['enabled', 'historicize'].includes(column.key)">
              <input
                type="checkbox"
                v-model="row[column.key]"
                @change="stopEditing"
              />
            </template>
            <template v-else-if="column.key === 'source'">
              <select
                class="form-select"
                v-model="row[column.key]"
                @change="stopEditing"
              >
                <option value="mqtt">MQTT</option>
                <option value="modbus">Modbus</option>
                <option value="http">HTTP</option>
                <option value="websocket">WebSocket</option>
                <option value="constant">Constant</option>
                <option value="computed">Computed</option>
                <option value="random">Random</option>
              </select>
            </template>
            <template v-else>
              <input
                v-if="isEditing(rowIndex, colIndex) && column.editable"
                type="text"
                class="form-control"
                v-model="row[column.key]"
                @blur="stopEditing"
              />
              <span v-else>{{ row[column.key] }}</span>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="text-center mt-3">
      <button @click="addTag" class="btn btn-primary">Add New Tag</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const device = ref({
  ...props.modelValue,
  tags: props.modelValue.tags || [], // Ensure tags is initialized as an array
})

watch(device, (newValue) => {
  emit('update:modelValue', newValue)
})

const columns = [
  { title: 'ID', key: 'id', editable: true },
  { title: 'Unit', key: 'unit', editable: true },
  { title: 'Source', key: 'source', editable: true },
  { title: 'Enabled', key: 'enabled', editable: true },
  { title: 'Historicize', key: 'historicize', editable: true },
]

// data
interface Tag {
  id: string
  unit: string
  source: string
  virtual: boolean
  enabled: boolean
  historicize: boolean
}

function fullId(tagId) {
  return `${device.value.id}.${tagId}`
}

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
  return (
    editingCell.value?.rowIndex === rowIndex &&
    editingCell.value?.colIndex === colIndex
  )
}

function editCell(rowIndex: number, colIndex: number) {
  editingCell.value = { rowIndex, colIndex }
}

function stopEditing() {
  editingCell.value = null
}

// Debugging: Log tableData and columns to ensure they are correct

function addTag() {
  const newTag: Tag = {
    id: '',
    unit: '',
    source: '',
    virtual: false,
    enabled: false,
    historicize: false,
  }

  device.value.tags.push(newTag)
  tableKey.value += 1 // Trigger re-render
}
</script>

<style scoped>
/* Center checkboxes and shrink specific columns */
.text-center {
  text-align: center;
}

.shrink {
  width: 1%;
  white-space: nowrap;
}
</style>
