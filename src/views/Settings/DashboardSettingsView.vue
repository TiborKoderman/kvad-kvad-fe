<template>
  <main class="con">
    <div class="container-fluid">
      <h1>My Dashboards</h1>
      <KTable
        :columns="columns"
        :data="dashboards"
        :striped="true"
        :hoverable="true"
        :searchable="false"
        :sortable="false"
        @update:data="dashboards = $event"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import KTable from '@/components/Table/KTable.vue'

const dashboards = ref<Record<string, unknown>[]>([
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Sales Dashboard', description: 'Overview of sales metrics and KPIs.' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Marketing Dashboard', description: 'Track marketing campaigns and performance.' },
])

const columns = [
  { title: 'ID', data: 'id', type: 'guid' as const },
  { title: 'Name', data: 'name', type: 'string' as const, editable: true },
  { title: 'Description', data: 'description', type: 'string' as const, editable: true },
  {
    title: '', data: 'actions', type: 'action' as const, actions: [
      { label: 'Configure', icon: 'bi-pencil', variant: 'primary', handler: (row: Record<string, unknown>) => console.log('Configure', row) },
    ],
  },
]
</script>

<style scoped></style>
