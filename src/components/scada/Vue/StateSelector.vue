<template>
    <div class="state-list">
        <div
          v-for="(state, idx) in States"
          :key="state.id"
          :class="{ selected: selectedState === state.id, editable: state.id !== 'fallback' }"
          @click="selectedState = state.id"
          @mouseenter="hovered = state.id"
          @mouseleave="hovered = null"
        >
            <span class="move-actions" v-if="state.id !== 'fallback'">
              <i class="bi bi-caret-up-fill move-carat"
                 @click.stop="moveStateUp(idx)"
                 :class="{ disabled: idx === 1 }"
                 title="Move up"
              ></i>
              <i class="bi bi-caret-down-fill move-carat"
                 @click.stop="moveStateDown(idx)"
                 :class="{ disabled: idx === States.length - 1 }"
                 title="Move down"
              ></i>
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
    <div class="add-row-fixed">

      <button class="add-btn" @click="addState" :disabled="!canAddState || editing !== null">
        <i class="bi bi-plus"></i> Add
      </button>
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
</script>

<style scoped>
.state-list {
  height: calc(5 * 2em);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid #bdbdbd;
  background: #f8fff8;
  box-shadow: 0 1px 4px 0 #0001;
  padding: 0.25em 0;
  margin: 0.5em 0;
}
.state-list > div {
  min-height: 2em;
  display: flex;
  align-items: center;
  padding: 0 0.75em;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.15s, color 0.15s;
  position: relative;
}
.state-list > div:last-child {
  border-bottom: none;
}
.state-list > div.selected {
  background: #43a047;
  color: #fff;
  font-weight: bold;
  border-radius: 4px;
}
.state-list > div:hover:not(.selected) {
  background: #e8f5e9;
  color: #222;
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
.move-actions {
  display: flex;
  gap: 0.1em;
  margin-right: 0.5em;
  align-items: center;
}
.move-carat {
  font-size: 1.2em;
  color: #888;
  cursor: pointer;
  opacity: 0.8;
  transition: color 0.15s, opacity 0.15s;
}
.move-carat:hover:not(.disabled) {
  color: #43a047;
  opacity: 1;
}
.move-carat.disabled {
  opacity: 0.3;
  pointer-events: none;
}
.edit-icon, .trash-icon {
  font-size: 1.1em;
  cursor: pointer;
  opacity: 0.8;
  transition: color 0.15s, opacity 0.15s;
}
.edit-icon:hover {
  color: #1976d2;
  opacity: 1;
}
.trash-icon:hover {
  color: #b71c1c;
  opacity: 1;
}
.edit-input {
  font: inherit;
  padding: 0 0.2em;
  border: 1px solid #aaa;
  border-radius: 3px;
  background: #fff;
  color: #222;
  min-width: 6ch;
  max-width: 100%;
  box-sizing: border-box;
}
.add-row-fixed {
  min-height: 2em;
  display: flex;
  align-items: center;
  padding: 0 0.75em;
  border-top: 1px solid #e0e0e0;
  background: #f4fff4;
  gap: 0.5em;
  cursor: default;
  position: sticky;
  bottom: 0;
  z-index: 2;
}
.add-input {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0.3em 0.5em;
  border: 1px solid #bdbdbd;
  border-radius: 4px;
  font: inherit;
  background: #fff;
}
.add-btn {
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.3em 0.7em;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
}
.add-btn:disabled {
  background: #bdbdbd;
  cursor: not-allowed;
  color: #eee;
}
.add-btn .bi-plus {
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 0.2em;
}
</style>