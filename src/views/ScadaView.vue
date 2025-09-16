<template>
  <div class="container-fluid d-flex flex-column h-100 p-2">
    <div class="d-flex justify-content-between align-items-center p-2">
      <button
        @click="
          modalStore
            .open('ScadaObjectSelector')
            .then((selectedObject) => {
              console.log('Selected object:', selectedObject)
              if (selectedObject !=null ) {
                const no = new SObject()
                no.AddComponent('RectComponent', 300, 300, 100, 100)
                no.AddComponent('SvgComponent', selectedObject.data.svg)
                no.AddComponent('OnClickComponent', () => {
                  console.log('Clicked on object:', no)
                })
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
scada.Init()


onMounted(() => {
  if (scadaContainer.value) {
    scadaContainer.value.appendChild(scada.svg.svg)

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
