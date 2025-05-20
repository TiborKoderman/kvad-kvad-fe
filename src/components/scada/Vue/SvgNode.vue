<template>
  <div
    :style="{ paddingLeft: `${depth * 1.2}em` }"
    :class="{ selected: isSelected }"
    class="nodeLine"
  >
    <span
      v-if="hasChildren"
      @click.stop="toggle"
      style="cursor: pointer; user-select: none"
    >
      <i
        class="bi"
        :class="expanded ? 'bi-caret-down-fill' : 'bi-caret-right-fill'"
      ></i>
    </span>
    <span v-else style="display: inline-block; width: 1.2em"></span>
    <span
      class="nameLine"
      @click.stop="svg.toggleSelect($event, props.node)"
      @dblclick.stop="editing = true"
    >
      <i class="bi" :class="folderIconClass"></i>
      <template v-if="editing">
        <input
          v-model="editValue"
          @blur="saveEdit"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          ref="editInput"
          class="edit-input"
          :style="{ width: sizerWidth + 'px' }"
        />
        <span ref="sizer" class="input-sizer">{{ editValue || ' ' }}</span>
      </template>
      <template v-else>
        {{ props.node.getAttribute('inkscape:label') || props.node.id }}
      </template>
      <span
        class="hide-eye"
        @click.stop="
          svg.getNode(node).style.display =
            node.style.display === 'none' ? '' : 'none'
        "
      >
        <i
          class="bi"
          :class="{
            'bi-eye-slash': svg.getNode(node).style.display === 'none',
            'bi-eye': svg.getNode(node).style.display !== 'none',
          }"
        ></i>
      </span>
    </span>
  </div>
  <div v-if="expanded">
    <SvgNode
      v-for="child in Array.from(props.node.children).reverse()"
      :key="child.id || child.tagName"
      :node="child as SVGElement"
      :depth="depth + 1"
      @expand="(emit('expand'), (expanded = true))"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, inject, Ref } from 'vue'
import SvgNode from './SvgNode.vue'
import Svg from '../Svg'

const editing = ref(false)
const editValue = ref('')
const editInput = ref<HTMLInputElement>()
const sizer = ref<HTMLElement>()
const sizerWidth = ref(0)

const svg = inject<Ref<Svg>>('svg', null)

const emit = defineEmits(['expand'])

const props = defineProps({
  node: {
    type: SVGElement,
    required: true,
  },
  depth: {
    type: Number,
    default: 0,
  },
})

function saveEdit() {
  editing.value = false
  if (editValue.value.trim() !== '') {
    props.node.setAttribute('inkscape:label', editValue.value)
  }
}
function cancelEdit() {
  editing.value = false
  editValue.value = props.node.getAttribute('inkscape:label') || props.node.id
}

watch(editValue, () => {
  nextTick(() => {
    if (sizer.value) {
      sizerWidth.value = sizer.value.offsetWidth + 8 // add a little padding
    }
  })
})
watch(editing, val => {
  if (val) {
    editValue.value = props.node.getAttribute('inkscape:label') || props.node.id
    nextTick(() => {
      editInput.value?.focus()
      editInput.value?.select()
      if (sizer.value) {
        sizerWidth.value = sizer.value.offsetWidth + 8
      }
    })
  }
})

const isSelected = computed(() => svg.isSelected(props.node))

watch(isSelected, (val) => {
  if (val) emit('expand')
}, { immediate: true })

const iconMap = {
  g: 'bi-folder',
  text: 'bi-fonts',
  rect: 'bi-square',
  circle: 'bi-circle',
  path: 'bi-vector-pen',
  polygon: 'bi-star',
  tspan: 'bi-file-font',
}

const expanded = ref(props.depth === 0)

const hasChildren = computed(() => props.node.children.length > 0)
function toggle() {
  if (expanded.value) {
    emit('expand')
  }
  expanded.value = !expanded.value
}

const folderIconClass = computed(() => {
  if (props.node.tagName === 'g') {
    return expanded.value ? 'bi-folder2-open' : 'bi-folder'
  }
  return iconMap[props.node.tagName] || 'bi-file-earmark'
})
</script>

<style scoped>
/* Optionally, you can add more styling here */

.bi {
  margin-right: 0.5em;
}
.bi-folder,
.bi-folder2-open {
  color: #007bff;
}
.nodeLine {
  display: flex;
  align-items: center;
  margin: 0.1em 0;
  font-size: 1rem;
  color: #333;
  font-family: sans-serif;
  border: 1px solid transparent;
  border-radius: 3px;
  min-width: 0;
}
.nameLine {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  cursor: pointer;
  user-select: none;
  width: 100%;
  min-width: 0;
  position: relative;
}
.nameLine:hover {
  background-color: color-mix(in srgb, var(--bs-secondary) 10%, white 30%);
  border-radius: 3px;
}
.selected {
  background-color: color-mix(in srgb, var(--bs-secondary) 40%, white 30%);
  border: 1px solid gray;
  border-radius: 3px;
}
.edit-input {
  font: inherit;
  padding: 0 0.2em;
  border: 1px solid #aaa;
  border-radius: 3px;
  background: #fff;
  color: #222;
  margin-left: 0.2em;
  min-width: 6ch;
  max-width: 100%;
  box-sizing: border-box;
  /* width is now set inline */
}
.input-sizer {
  position: absolute;
  visibility: hidden;
  height: 0;
  overflow: scroll;
  white-space: pre;
  font: inherit;
  padding: 0 0.2em;
  /* match .edit-input styles */
}
.nameLine:hover .hide-eye {
  opacity: 1;
}
.hide-eye {
  margin-left: auto;
  margin-right: 0.2em;
  opacity: 0;
  display: flex;
  align-items: center;
  transition: opacity 0.15s;
}
.hide-eye .bi {
  font-size: 1.4em;
  font-weight: bold;
  stroke: #333;
  stroke-width: 2.5;
  /* For thicker icon, but may require SVG icons for true thickness */
}
.hide-eye:hover .bi {
  color: #b00b69;
}
/* Optionally, add a left border or guide for tree lines if desired */
</style>
