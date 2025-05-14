<template>
  <div ref="scadaContainer">

  </div>
</template>

<script setup lang="ts">
import Scada from "@/components/scada/Scada";
import { ref, onMounted } from "vue";

const scadaContainer = ref<HTMLElement | null>(null);

const scada = new Scada();
scada.init();

onMounted(() => {
  if (scadaContainer.value) {
    scadaContainer.value.appendChild(scada.svg.Get());
  }
});




</script>

<style scoped></style>
