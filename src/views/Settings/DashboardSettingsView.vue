<template>
  <main class="con">
    <div class="container-fluid">
      <h1>My Dashboards</h1>

      <div class="row">
        <div
          class="col-md-4"
          v-for="dashboard in dashboards"
          :key="dashboard.id"
        >
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="card-title">{{ dashboard.name }}</h5>
            </div>
            <div class="card-body">
              <p class="card-text">{{ dashboard.description }}</p>
              <button class="btn btn-primary">Configure</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Dashboard {
  id: number
  name: string
  description: string
  enabled?: boolean
}

const dashboards = ref<Dashboard[]>([
  {
    id: 1,
    name: 'Sales Dashboard',
    description: 'Overview of sales metrics and KPIs.',
  },
  {
    id: 2,
    name: 'Marketing Dashboard',
    description: 'Track marketing campaigns and performance.',
  },
])
</script>

<style scoped></style>
