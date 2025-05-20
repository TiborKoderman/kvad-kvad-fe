<template>
  <div class="tile" :class="{ active: selected }" @mouseover="hovering = true" @mouseleave="hovering = false">
    <div class="obj-toolbox" v-show="hovering">
      <i class="bi bi-download" @click="downloadFile"></i>
      <i class="bi bi-copy" @click="copyToClipboard"></i>
      <i class="bi bi-pencil-square" @click="modals.open('ScadaObjectConfigurator', { deviceTemplate: props.object }).then(() => emit('reload'))"></i>
      <i class="bi bi-trash"></i>
    </div>
    <div class="obj-icon" v-html="props.object.data.svg"></div>
    <div class="obj-name">{{ props.object.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ScadaObjectTemplate } from '../ScadaTypes'
import { useModalStore } from '@/stores/modals'

const modals = useModalStore()

const emit = defineEmits(['reload'])

const hovering = ref(false)

const props = defineProps<{
  object: ScadaObjectTemplate
  selected: boolean
}>()

const copyToClipboard = () => {
  const svgString = JSON.stringify(props.object, null, 2)
  navigator.clipboard.writeText(svgString).then(() => {
    console.log('Object copied to clipboard')
  }).catch(err => {
    console.error('Failed to copy Object: ', err)
  })
}

const downloadFile = () => {
  const svgString = JSON.stringify(props.object)
  const blob = new Blob([svgString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.object.name}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

</script>

<style scoped>
.tile {
  aspect-ratio: 1;
  min-width: 250px;
  min-height: 250px;
  max-width: 10vw;
  max-height: 10vw;
  border-radius: 10px;
  border: 2px solid #ccc;
  background-color: #f0f0f0;
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.tile:hover {
  background-color: #e0e0e0;
  cursor: pointer;
}

.active {
  border: 4px solid var(--bs-primary);
}

.obj-icon {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.obj-icon :deep(svg) {
  width: 90%;
  height: 90%;
  max-width: 100%;
  max-height: 100%;
  display: block;
  object-fit: contain;
}

.obj-name {
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 5px;
  text-align: center;
  z-index: 1;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  font-weight: bold;  /* Added font-weight for emphasis */
}

.obj-toolbox {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 5px;
  font-size: 1.25rem;
  gap: 5px;
  display: flex;
}

.bi-trash:hover {
  color: var(--bs-danger);
}

.bi-pencil-square:hover, .bi-copy:hover, .bi-floppy:hover {
  color: var(--bs-primary);
}

.obj-toolbox-icon {
  font-size: 1.5rem;
  color: var(--bs-primary);
  cursor: pointer;
}

.obj-toolbox-icon i {
  font-size: 1.5rem;
}
</style>
