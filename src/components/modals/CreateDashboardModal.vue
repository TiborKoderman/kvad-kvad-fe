<template>
  <form @submit.prevent="submit">
    <div class="form-group">
      <label for="dashboard_name">Dashboard Name</label>
      <input
        type="text"
        class="form-control"
        id="dashboard_name"
        v-model="dashboardName"
        placeholder="e.g., Analytics Dashboard"
        required
        autocomplete="off"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dashboardName = ref('')

interface Page {
  name: string
  link: string
  icon?: string
  children?: Page[]
  isExpanded?: boolean
}

async function submit(): Promise<Page> {
  // Placeholder for submit logic
  console.log('Dashboard Name:', dashboardName.value)

  return Promise.resolve({
    name: dashboardName.value,
    link: `/dashboards/${dashboardName.value
      .toLowerCase()
      .replace(/\s+/g, '-')}`,
    icon: 'bi bi-file-earmark',
  })
}

defineExpose({ submit })
</script>

<style scoped></style>
