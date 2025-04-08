<template>
  <div v-if="!node?.children">
    <button class="btn btn-primary" @click="addRow">Add row</button>
  </div>
  <div v-else>
    <div class="layout">
      <div class="grid">
        <div
          v-for="(cell, index) in node.children"
          :key="index"
          class="grid-cell"
        >
          <DashboardLayout v-model="node.children[index]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const node = ref(props.modelValue)

const addRow = () => {
  const newRow = {
    id: Date.now(),
    children: [],
  }
  node.value.children.push(newRow)
  emit('update:modelValue', node.value)
}

const removeRow = index => {
  node.value.children.splice(index, 1)
  emit('update:modelValue', node.value)
}

const addColumn = index => {
  const newColumn = {
    id: Date.now(),
    children: [],
  }
  node.value.children[index].children.push(newColumn)
  emit('update:modelValue', node.value)
}

const removeColumn = (rowIndex, columnIndex) => {
  node.value.children[rowIndex].children.splice(columnIndex, 1)
  emit('update:modelValue', node.value)
}
</script>

<style scoped>
.layout {
  border: 1px solid #ccc;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%; /* Fill the parent's height */
  width: 100%; /* Fill the parent's width */
  box-sizing: border-box; /* Ensure borders are included in the size */
}

.layout:hover {
  background-color: #f0f0f0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr); /* 12 equal columns */
  gap: 0; /* Remove gaps to align grid lines */
  width: 100%; /* Ensure grid spans the full width */
  height: 100%; /* Ensure grid spans the full height */
  border: 1px solid #000; /* Outer grid border */
}

.grid-cell {
  background-color: #e0e0e0;
  aspect-ratio: 1 / 1; /* Make each cell a square */
  border: 1px solid #000; /* Draw grid lines */
}
</style>
