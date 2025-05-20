<template>
  <div 
    class="icon-configurator"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="dragging = false"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
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
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Svg from '@/components/scada/Svg'

// Use defineModel for v-model:svg
const svg = defineModel<Svg>()

const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)

const svgContainer = ref<HTMLElement | null>(null)

const hasSvg = computed(() => {
  return !svg.value.isEmpty()
})

onMounted(() => {

})

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
  reader.onload = (e) => {
    const svgContent = e.target?.result as string
    svg.value.Load(svgContent)
    svgContainer.value.appendChild(svg.value.Get())
    console.log('SVG content:', svg.value)
  }
  reader.readAsText(file)
}
</script>

<style scoped>
.icon-configurator {
  aspect-ratio: 1/1;
  min-width: 150px;
  min-height: 150px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
  background-color: #f8f9fa;
  transition: all 0.2s ease;
}

.icon-configurator:hover {
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
</style>