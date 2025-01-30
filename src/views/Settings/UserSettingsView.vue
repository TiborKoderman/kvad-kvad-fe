<template>
  <main>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Users</h3>
      </div>
      <div class="card-body">
        <button class="btn btn-primary mb-3" @click="newUser">New User</button>
        <DataTable
          :columns="columns"
          :data="data"
          :options="options"
          class="table table-bordered table-hover"
        >
          <template #action="props">
            <i
              class="bi bi-pencil-square pointer-event"
              @click="editUser(props)"
            />
          </template>
        </DataTable>
      </div>
    </div>
    <AddUserModal ref="addusermodal" @close="getUsers"/>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AddUserModal from '@/components/Modals/AddUserModal.vue';
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'
DataTable.use(DataTablesCore)

import api from '@/api'

// const addusermodal = ref(AddUserModal)
import type { Ref } from 'vue'
import type AddUserModalType from '@/components/Modals/AddUserModal.vue'

const addusermodal: Ref<InstanceType<typeof AddUserModalType> | null> = ref(null)

const columns = ref([
  { title: 'Username', data: 'username' },
  { title: 'Roles', data: 'userRoles' },
  { title: 'Actions', data: null, render: '#action' },
])

const options = ref({
  pageLength: 10
})

const data = ref([])

function newUser() {
  if (addusermodal.value !== null) {
    addusermodal.value.open()
  }
}

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
