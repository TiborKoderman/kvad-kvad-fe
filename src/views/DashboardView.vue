<template>
  <div
    v-if="dashboards?.length === 0"
    class="d-flex justify-content-center align-items-center vh-100"
  >
    <div class="text-center">
      <div class="mb-3">
        <strong> No dashboards found </strong>
      </div>
      <button
        class="btn btn-primary"
        @click="modals.open('EditDashboardModal').then(getDashboardItems)"
      >
        Create Dashboard
      </button>
    </div>
  </div>
  <div
    v-else
    class="d-flex flex-wrap justify-content-around align-items-start h-100"
  >
    <DashboardLayout />
    <!-- <VectorDiagram />
    <PowerCalculation /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useRoute, useRouter } from 'vue-router'
import useMenuStore from '@/stores/menu'
import IconButton from '@/components/IconButton.vue'
import VectorDiagram from '@/components/Dashboard/VectorDiagram.vue'
import PowerCalculation from '@/components/Dashboard/PowerCalculation.vue'
import DashboardLayout from '@/components/DashboardLayout.vue'
const menu = useMenuStore()

import { useModalStore, } from '@/stores/modals'
import Swal from 'sweetalert2'
const modals = useModalStore()

const route = useRoute()
const router = useRouter()
const dashboards = ref([])

if (!route.params.id) {
  getDashboardItems()
}

onMounted(() => {
  if (route.params.id) {
    getDashboardItems()
  }
})

function getDashboardItems() {
  api.get('/dashboard/all').then(res => {
    dashboards.value = res.data
    if (dashboards.value.length > 0 && !route.params.id) {
      const firstDashboardId = dashboards.value[0].id
      router.push({ name: 'dashboard', params: { id: firstDashboardId } })
    }
  })
}
</script>

<style scoped></style>
