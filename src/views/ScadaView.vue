<template>
  <div ref="scadaContainer"></div>
</template>

<script setup lang="ts">
import RectComponent from '@/components/scada/Components/RectComponent'
import Scada from '@/components/scada/Scada'
import SRect from '@/components/scada/SRect'
import { ref, onMounted } from 'vue'

const scadaContainer = ref<HTMLElement | null>(null)

const scada = new Scada()
scada.init()

const rect = new SRect(100, 100, 200, 100)
const rect2 = new SRect(200, 200, 100, 200)
rect.GetComponent<RectComponent>('RectComponent')?.SetRotation(10)
scada.AddObject(rect)
scada.AddObject(rect2)

onMounted(() => {
  if (scadaContainer.value) {
    scadaContainer.value.appendChild(scada.svg.Get())
  }
})
</script>

<style scoped></style>
