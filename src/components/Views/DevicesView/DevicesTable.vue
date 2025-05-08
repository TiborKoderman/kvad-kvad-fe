<template>
  <div class="d-flex flex-row">
    <button
      class="btn btn-primary me-2"
      @click="modalStore.open('EditDeviceModal')"
    >
      Add Device
    </button>
    <button
      class="btn btn-primary"
      @click="
        modalStore
          .open('EditDeviceModal', { virtual: true })
          .then(() => getDevices())
      "
    >
      Add Virtual Device
    </button>
  </div>
  <div class="d-flex flex-column">
    <DataTable
      :data="data"
      :columns="columns"
      :options="options"
      :layout="layout"
      class="table table-bordered table-hover display nowrap"
    >
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'

import { useModalStore } from '@/stores/modals'

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/api'

const modalStore = useModalStore()

DataTable.use(DataTablesCore)

const columns = ref([
  { title: 'Name', data: 'name' },
  { title: 'Description', data: 'description', editable: true },
  {
    title: 'Type',
    data: null,
    render: (data, type, row) => {
      if (row.virtual) {
        return '<span class="badge bg-warning">Virtual</span>'
      }
      return ''
    },
  },
])

const data = ref([])

const getDevices = async () => {
  const response = await api.get('/Device/user/all')
  data.value = response.data
}

getDevices()

const router = useRouter()

const options = ref({
  scrollResize: false,
  scrollY: "65vh",
  scrollCollapse: false,
  paging: false,
  rowCallback: (row, data) => {
    row.addEventListener('click', () => {
      router.push(`/device/${data.id}`)
    })
  },
})

const layout = ref({
  top: '<"d-flex justify-content-between"lf>rt<"d-flex justify-content-between"ip>',
  bottom:
    '<"d-flex justify-content-between"lf>rt<"d-flex justify-content-between"ip>',
  topStart: {
    buttons: [
      {
        text: 'Create Node',
        action: () => {
          console.log('Create Node')
        },
      },
    ],
  },
})
</script>

<style lang="scss" scoped></style>
