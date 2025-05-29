<template>
  <div class="device-name-container border p-3 mb-3">
    <h5 class="mb-2 border-bottom">State</h5>
    <div class="state-list" style="margin-bottom: 0;" ref="stateListRef">
      <div
        v-for="(state, idx) in States"
        :key="state.id"
        :class="{ 
          selected: selectedState === state.id,
          editable: state.id !== 'fallback',
          dragging: draggedState?.id === state.id,
          'drop-target': dropTargetIndex === idx
        }"
        @click="selectedState = state.id"
        @mouseenter="hovered = state.id"
        @mouseleave="hovered = null"
        :draggable="state.id !== 'fallback'"
        @dragstart="handleDragStart(state, idx, $event)"
        @dragend="handleDragEnd"
        @dragover="handleDragOver(idx, $event)"
        @drop="handleDrop(idx, $event)"
      >
        <span class="drag-handle" v-if="state.id !== 'fallback'" title="Drag to reorder">
          <i class="bi bi-grip-vertical"></i>
        </span>
        <template v-if="editing === state.id">
          <input
            v-model="editValue"
            @blur="saveEdit(state)"
            @keyup.enter="saveEdit(state)"
            @keyup.esc="cancelEdit"
            class="edit-input"
            ref="editInput"
          />
        </template>
        <template v-else>
          {{ state.id }}
        </template>
        <span class="actions" v-if="state.id !== 'fallback' && hovered === state.id">
          <i class="bi bi-pencil edit-icon" @click.stop="startEdit(state)" title="Rename"></i>
          <i class="bi bi-trash trash-icon" @click.stop="removeState(state)" title="Delete"></i>
        </span>
      </div>
    </div>
    <div class="bottom-controls">
      <button class="control-btn" @click="addState" title="Add new state">
        <i class="bi bi-plus"></i>
      </button>
      <button 
        class="control-btn" 
        @click="moveSelectedUp" 
        :disabled="!canMoveSelectedUp"
        title="Move selected state up"
      >
        <i class="bi bi-arrow-up"></i>
      </button>
      <button 
        class="control-btn" 
        @click="moveSelectedDown" 
        :disabled="!canMoveSelectedDown"
        title="Move selected state down"
      >
        <i class="bi bi-arrow-down"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'

interface State {
    id: string;
    condition: string;
}

const selectedState = defineModel<string>({
    default: 'fallback',
})

const States = ref<State[]>([
    { id: 'fallback', condition: 'true' },
    { id: 'state1', condition: 'condition1' },
    { id: 'state2', condition: 'condition2' },
    { id: 'state3', condition: 'condition3' },
    { id: 'state4', condition: 'condition4' },
])

const hovered = ref<string | null>(null)
const editing = ref<string | null>(null)
const editValue = ref('')
const editInput = ref<HTMLInputElement>()
const newStateId = ref('')

const canAddState = computed(() =>
  !!newStateId.value.trim() &&
  !States.value.some(s => s.id === newStateId.value.trim()) &&
  newStateId.value.trim() !== 'fallback'
)

const canMoveSelectedUp = computed(() => {
  const idx = States.value.findIndex(s => s.id === selectedState.value)
  return idx > 1 // Can't move fallback or first state after fallback
})

const canMoveSelectedDown = computed(() => {
  const idx = States.value.findIndex(s => s.id === selectedState.value)
  return idx > 0 && idx < States.value.length - 1 // Can't move fallback or last state
})

const stateListRef = ref<HTMLElement>()
const draggedState = ref<State | null>(null)
const draggedFromIndex = ref<number>(-1)
const dropTargetIndex = ref<number>(-1)
const autoScrollInterval = ref<number | null>(null)

function startEdit(state: State) {
  editing.value = state.id
  editValue.value = state.id
  nextTick(() => {
    editInput.value?.focus()
    editInput.value?.select()
  })
}

function saveEdit(state: State) {
  const newId = editValue.value.trim()
  if (newId && newId !== state.id && !States.value.some(s => s.id === newId)) {
    state.id = newId
    // If the renamed state was selected, update selection
    if (selectedState.value === editing.value) {
      selectedState.value = newId
    }
  }
  editing.value = null
}

function cancelEdit() {
  editing.value = null
}

function removeState(state: State) {
  const idx = States.value.findIndex(s => s.id === state.id)
  if (idx !== -1) {
    States.value.splice(idx, 1)
    // If the removed state was selected, fallback to 'fallback'
    if (selectedState.value === state.id) {
      selectedState.value = 'fallback'
    }
  }
}

function addState() {
  const id = newStateId.value.trim()
  if (!id || id === 'fallback' || States.value.some(s => s.id === id)) return
  States.value.push({ id, condition: '' })
  newStateId.value = ''
}

function moveStateUp(idx: number) {
  // Don't move fallback or first after fallback
  if (idx <= 1) return
  const arr = States.value
  const temp = arr[idx]
  arr[idx] = arr[idx - 1]
  arr[idx - 1] = temp
}

function moveStateDown(idx: number) {
  if (idx === 0 || idx === States.value.length - 1) return
  const arr = States.value
  const temp = arr[idx]
  arr[idx] = arr[idx + 1]
  arr[idx + 1] = temp
}

function moveSelectedUp() {
  const idx = States.value.findIndex(s => s.id === selectedState.value)
  if (idx > 1) {
    moveStateUp(idx)
  }
}

function moveSelectedDown() {
  const idx = States.value.findIndex(s => s.id === selectedState.value)
  if (idx > 0 && idx < States.value.length - 1) {
    moveStateDown(idx)
  }
}

function handleDragStart(state: State, idx: number, event: DragEvent) {
  if (state.id === 'fallback') return
  draggedState.value = state
  draggedFromIndex.value = idx
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', state.id)
  }
}

function handleDragEnd() {
  draggedState.value = null
  draggedFromIndex.value = -1
  dropTargetIndex.value = -1
  clearAutoScroll()
}

function handleDragOver(targetIdx: number, event: DragEvent) {
  if (!draggedState.value || targetIdx === 0) return // Can't drop on fallback
  event.preventDefault()
  dropTargetIndex.value = targetIdx
  
  // Auto-scroll logic
  const listElement = stateListRef.value
  if (!listElement) return
  
  const rect = listElement.getBoundingClientRect()
  const mouseY = event.clientY
  const scrollThreshold = 50
  
  if (mouseY - rect.top < scrollThreshold) {
    // Near top, scroll up
    startAutoScroll('up')
  } else if (rect.bottom - mouseY < scrollThreshold) {
    // Near bottom, scroll down
    startAutoScroll('down')
  } else {
    clearAutoScroll()
  }
}

function handleDrop(targetIdx: number, event: DragEvent) {
  event.preventDefault()
  clearAutoScroll()
  
  if (!draggedState.value || targetIdx === 0 || targetIdx === draggedFromIndex.value) {
    dropTargetIndex.value = -1
    return
  }
  
  const draggedIdx = draggedFromIndex.value
  const newStates = [...States.value]
  
  // Remove dragged item
  const [draggedItem] = newStates.splice(draggedIdx, 1)
  
  // Insert at new position (adjust index if dragging down)
  const insertIdx = draggedIdx < targetIdx ? targetIdx - 1 : targetIdx
  newStates.splice(insertIdx, 0, draggedItem)
  
  States.value = newStates
  dropTargetIndex.value = -1
}

function startAutoScroll(direction: 'up' | 'down') {
  if (autoScrollInterval.value) return
  
  autoScrollInterval.value = window.setInterval(() => {
    const listElement = stateListRef.value
    if (!listElement) return
    
    const scrollAmount = 5
    if (direction === 'up') {
      listElement.scrollTop = Math.max(0, listElement.scrollTop - scrollAmount)
    } else {
      listElement.scrollTop = Math.min(
        listElement.scrollHeight - listElement.clientHeight,
        listElement.scrollTop + scrollAmount
      )
    }
  }, 16) // ~60fps
}

function clearAutoScroll() {
  if (autoScrollInterval.value) {
    clearInterval(autoScrollInterval.value)
    autoScrollInterval.value = null
  }
}
</script>

<style scoped>
.state-list {
  height: calc(5 * 2em);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--bs-border-color);
  background: var(--bs-body-bg);
  padding:0;
  margin: 0;
}
.state-list > div {
  min-height: 2em;
  display: flex;
  align-items: center;
  padding: 0 0.75em;
  cursor: pointer;
  border-bottom: 1px solid var(--bs-border-color);
  transition: background 0.15s, color 0.15s;
  position: relative;
}
.state-list > div:last-child {
  border-bottom: none;
}
.state-list > div.selected {
  background: var(--bs-primary);
  color: white;
  font-weight: bold;
  border-radius: 4px;
}
.state-list > div:hover:not(.selected) {
  background: var(--bs-primary-bg-subtle);
  color: var(--bs-emphasis-color);
}
.state-list > div.editable .actions {
  display: flex;
  gap: 0.5em;
  margin-left: auto;
  opacity: 1;
  align-items: center;
}
.state-list > div .actions {
  display: none;
}
.state-list > div.editable:hover .actions {
  display: flex;
}
.drag-handle {
  display: flex;
  align-items: center;
  margin-right: 0.5em;
  color: var(--bs-secondary);
  cursor: grab;
  opacity: 0.6;
  transition: opacity 0.15s, color 0.15s;
}
.drag-handle:hover {
  color: var(--bs-primary);
  opacity: 1;
}
.drag-handle:active {
  cursor: grabbing;
}
.edit-icon, .trash-icon {
  font-size: 1.1em;
  cursor: pointer;
  opacity: 0.8;
  transition: color 0.15s, opacity 0.15s;
}
.edit-icon:hover {
  color: var(--bs-info);
  opacity: 1;
}
.trash-icon:hover {
  color: var(--bs-danger);
  opacity: 1;
}
.edit-input {
  font: inherit;
  padding: 0 0.2em;
  border: 1px solid var(--bs-border-color);
  border-radius: 3px;
  background: var(--bs-body-bg);
  color: var(--bs-body-color);
  min-width: 6ch;
  max-width: 100%;
  box-sizing: border-box;
}
.bottom-controls {
  display: flex;
  gap: 0.5em;
  justify-content: center;
  padding: 0.5em;
  border: 1px solid var(--bs-border-color);
  background: var(--bs-secondary-bg);
}
.control-btn {
  background: var(--bs-primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5em 0.75em;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5em;
}
.control-btn:hover:not(:disabled) {
  background: var(--bs-primary-dark, var(--bs-primary));
  opacity: 0.9;
}
.control-btn:disabled {
  background: var(--bs-secondary);
  cursor: not-allowed;
  opacity: 0.5;
}
.state-list > div.dragging {
  opacity: 0.5;
  transform: rotate(2deg);
}
.state-list > div.drop-target {
  border-top: 3px solid var(--bs-primary);
  margin-top: -1px;
}
.state-list > div[draggable="true"] {
  cursor: grab;
}
.state-list > div[draggable="true"]:active {
  cursor: grabbing;
}
</style>