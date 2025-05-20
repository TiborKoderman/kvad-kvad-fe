<template>
  <div class="container-fluid d-flex flex-column h-100 p-2">
    <div class="d-flex justify-content-between align-items-center p-2">
      <button
        @click="
          modalStore
            .open('ScadaObjectSelector')
            .then((selectedObject) => {
              console.log('Selected object:', selectedObject)
              if (selectedObject) {
                const no = new SObject()
                no.AddComponent('RectComponent', 300, 300, 100, 100)
                no.AddComponent('SvgComponent', selectedObject.data.svg)
                scada.AddObject(no)
              }
            })
        "
        class="btn btn-primary"
      >
        Add
      </button>
    </div>
    <div
      ref="scadaContainer"
      class="flex-grow-1 flex-fill scada-container"
    ></div>
  </div>
</template>

<script setup lang="ts">
import RectComponent from '@/components/scada/Components/RectComponent'
import Scada from '@/components/scada/Scada'
import { ScadaObjectTemplate } from '@/components/scada/ScadaTypes'
import SObject from '@/components/scada/SObject'
import SRect from '@/components/scada/SRect'
import { useModalStore } from '@/stores/modals'
import { ref, onMounted, nextTick } from 'vue'

const modalStore = useModalStore()

const scadaContainer = ref<HTMLElement | null>(null)

const scada = new Scada({
  border: '1px solid black',
  autoresize: true,
  backgroundColor: '#FFFFFF00',
  width: '100%',
  height: '100%',
  viewBox: '0 0 1600 900 ',
})
scada.init()

// const rect = new SRect(100, 100, 200, 100)
const rect2 = new SRect(200, 200, 100, 200)
// rect.GetComponent<RectComponent>('RectComponent')?.SetRotation(40)
// scada.AddObject(rect)
scada.AddObject(rect2)

function scaleSvgToFitContainer() {
  const svgEl = scada.svg.Get()
  const container = scadaContainer.value
  if (!svgEl || !container) return

  // Get container and SVG viewBox sizes
  const viewBox = svgEl.getAttribute('viewBox')?.split(' ').map(Number) || [
    0, 0, 500, 500,
  ]
  const vbWidth = viewBox[2]
  const vbHeight = viewBox[3]
  const cWidth = container.clientWidth
  const cHeight = container.clientHeight

  if (!vbWidth || !vbHeight || !cWidth || !cHeight) return

  // Calculate scale to fit, constrained by the smaller ratio
  const scale = Math.min(cWidth / vbWidth, cHeight / vbHeight)

  // Center the SVG in the container
  svgEl.style.display = 'block'
  svgEl.style.margin = 'auto'
  svgEl.style.width = `${vbWidth * scale}px`
  svgEl.style.height = `${vbHeight * scale}px`
}

onMounted(() => {
  if (scadaContainer.value) {
    scadaContainer.value.appendChild(scada.svg.Get())
    nextTick(() => {
      scaleSvgToFitContainer()
    })
    // Re-scale on resize
    window.addEventListener('resize', scaleSvgToFitContainer)
  }
})
</script>

<style scoped>
.scada-container {
  max-height: 100%;
  max-width: 100%;
  overflow: auto;
  /* Ensures SVG does not overflow its parent */
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}
</style>
