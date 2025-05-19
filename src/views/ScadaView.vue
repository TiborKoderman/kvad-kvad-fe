<template>
  <button @click="modalStore.open('ScadaObjectSelector')" class="btn btn-primary">
    Add
  </button>
  <div ref="scadaContainer"></div>
</template>

<script setup lang="ts">
import RectComponent from '@/components/scada/Components/RectComponent'
import Scada from '@/components/scada/Scada'
import SRect from '@/components/scada/SRect'
import { useModalStore } from '@/stores/modals'
import { ref, onMounted } from 'vue'

const modalStore = useModalStore()

const scadaContainer = ref<HTMLElement | null>(null)

const scada = new Scada({
  border: "1px solid black",
  autoresize: true,
  backgroundColor: "#FFFFFF00",
  width: 500,
  height: 500,
})
scada.init()

const rect = new SRect(100, 100, 200, 100)
const rect2 = new SRect(200, 200, 100, 200)
rect.GetComponent<RectComponent>('RectComponent')?.SetRotation(40)
scada.AddObject(rect)
scada.AddObject(rect2)

onMounted(() => {
  if (scadaContainer.value) {
    scadaContainer.value.appendChild(scada.svg.Get())
  }
})
</script>

<style scoped></style>
