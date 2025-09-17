<template>
  <div class="h-100">
    <div class="card h-100">
      <div class="card-header">
        <h3 class="card-title">Users</h3>
      </div>
      <div class="card-body">
        <button class="btn btn-primary mb-3" @click="modalStore.open('AddUserModal').then(() => getUsers())">
          New User
        </button>
        <DataTable
          :columns="columns"
          :data="data"
          :options="options"
          class="table table-bordered table-hover"
        >
          <template #action="props">
            <i
              class="bi bi-pencil-square pointer-event"
              @click="modalStore.open('AddUserModal', { editUser: props.rowData }).then(() => getUsers())"
            />
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useModalStore } from '@/stores/modals'

import api from '@/api'

const modalStore = useModalStore()

const columns = ref([
  { title: 'Username', data: 'username' },
  { title: 'Roles', data: 'userRoles' },
  { title: 'Actions', data: null, render: '#action' },
])

const options = ref({
  // pageLength: 10,
  autoresize: false,
  // responsive: true, // Temporarily disabled until responsive extension is fixed
  lengthChange: false,
  scrollY: '100%',
  scrollCollapse: true,
})

const data = ref([])

function getUsers() {
  api.get('/User/table').then(res => {
    data.value = res.data
  })
}

onMounted(() => {
  getUsers()
})
</script>

<style scoped></style>
