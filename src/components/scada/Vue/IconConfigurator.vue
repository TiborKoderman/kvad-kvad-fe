<template>
  <div
    class="icon-configurator"
    :class="{ 'icon-configurator-hover': !hasSvg }"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="dragging = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <!-- Trash button (top right, only when SVG is present and hovering) -->

    <i class="bi bi-trash" @click.stop="clearSvg"></i>
    <!-- Display SVG if available -->
    <div v-show="hasSvg" class="svg-container" ref="svgContainer"></div>
    <!-- Upload placeholder if no SVG -->
    <div v-show="!hasSvg" class="upload-placeholder" :class="{ dragging }">
      <i class="bi bi-cloud-arrow-up"></i>
      <p>Drag & drop or click to upload SVG</p>
      <input
        type="file"
        ref="fileInput"
        accept=".svg"
        @change="handleFileUpload"
        class="file-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, Reactive, watch } from 'vue'
import Svg from '@/components/scada/Svg'

// Use defineModel for v-model:svg
const props = defineProps<{
  svg: Reactive<Svg>
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

const svgContainer = ref<HTMLElement | null>(null)

const hasSvg = ref(false)

props.svg.enableSelectMode()

watch(
  () => props.svg.isEmpty,
  (val) => {
    hasSvg.value = !val
  },
  { immediate: true }
)

onMounted(() => {})

function handleDragOver(event: DragEvent) {
  dragging.value = true
}

function handleDrop(event: DragEvent) {
  dragging.value = false
  if (!event.dataTransfer?.files.length) return

  const file = event.dataTransfer.files[0]
  if (file.type === 'image/svg+xml') {
    processFile(file)
  }
}

function triggerFileInput() {
  if (!hasSvg.value) {
    fileInput.value?.click()
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return

  const file = target.files[0]
  if (file.type === 'image/svg+xml') {
    processFile(file)
  }
}

function processFile(file: File) {
  const reader = new FileReader()
  reader.onload = e => {
    const svgContent = e.target?.result as string
    props.svg.Load(svgContent)
    svgContainer.value.appendChild(props.svg.svg)
    hasSvg.value = true
    console.log('SVG content:', props.svg)
  }
  reader.readAsText(file)
}

function clearSvg() {
  svgContainer.value?.removeChild(props.svg.svg)
  props.svg.Clear()
  hasSvg.value = false
  if (!hasSvg.value) return
}
</script>

<style scoped>
.icon-configurator {
  aspect-ratio: 1/1;
  min-width: 150px;
  min-height: 150px;
  border-radius: 8px;
  border: 1px solid #ccc;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  background-color: #f8f9fa;
  transition: all 0.2s ease;
  position: relative;
}
.icon-configurator-hover {
  border: 1px dashed #ccc;
}
.icon-configurator-hover:hover {
  border-color: #666;
  background-color: #f0f0f0;
}

.svg-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.svg-container :deep(svg) {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: block;
  object-fit: contain;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  text-align: center;
}

.upload-placeholder i {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #6c757d;
}

.upload-placeholder p {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
}

.dragging {
  border-color: var(--bs-primary);
  background-color: rgba(13, 110, 253, 0.05);
}

.file-input {
  display: none;
}

.bi-trash {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  z-index: 2;
  cursor: pointer;
  transition: opacity 0.15s;
  font-size: 1.5rem;
  color: var(--bs-dark);
}
.icon-configurator:hover .bi-trash {
  opacity: 1;
}
.bi-trash:hover {
  color: var(--bs-danger);
}
</style>
