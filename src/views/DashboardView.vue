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
        @click="modals.open('edit-dashboard').then(getDashboardItems)"
      >
        Create Dashboard
      </button>
    </div>
  </div>
  <div
    v-else
    v-for="dashboard in dashboards"
    :key="dashboard.id"
    class="d-flex"
  >
    <div class="card">
      <div class="card-header">
        <h5>
          {{ dashboard.name }}
          <IconButton
            icon="pencil"
            v-if="menu.editMode"
            class="float-end"
            @click="
              modals
                .open('edit-dashboard', { id: dashboard.id })
                .then(getDashboardItems)
            "
          />
          <IconButton
            icon="trash"
            hcolor="var(--bs-danger)"
            v-if="menu.editMode"
            class="float-end"
            @click="
              modals
                .open('edit-dashboard', { id: dashboard.id })
                .then(getDashboardItems)
            "
          />
        </h5>
      </div>
      <div class="card-body">
        {{ dashboard.description }}
      </div>
    </div>
    <div v-if="menu.editMode" class="flex-grow">+</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
import { useRoute } from 'vue-router'
import { useModalStore } from '@/stores/modals'
import { useMenuStore } from '@/stores/menu'
import IconButton from '@/components/IconButton.vue'
const modals = useModalStore()
const menu = useMenuStore()

modals.register(
  'edit-dashboard',
  () => import('@/components/Modals/EditDashboardModal.vue'),
  {},
)

const route = useRoute()
const dashboards = ref([])


if (!route.params.id) {
  getDashboardItems()
}

function getDashboardItems() {
  api.get('/dashboard/all').then(res => {
    dashboards.value = res.data
  })
}
</script>

<style scoped></style>
