<template>
    <div>
        <button class="btn btn-primary me-2" @click="modalStore.open('EditDeviceModal')">
          Add Device
        </button>
        <button class="btn btn-primary" @click="modalStore.open('EditDeviceModal', { virtual: true })">
          Add Virtual Device
        </button>
        <DataTable
        :data="data"
        :columns="columns"
        :options="options"
        :layout="layout"
        class="table table-bordered table-hover"
        >
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'

import { useModalStore } from '@/stores/modals'

import { onMounted, ref } from 'vue'

import api from '@/api'

const modalStore = useModalStore()


DataTable.use(DataTablesCore)

const columns = ref([
    { title: 'Name', data: 'name' },
    { title: 'Description', data: 'description' },
    { title: 'Actions', data: null, render: '#action' },
])

const data = ref([])

onMounted(() => {
    api.get('/Device/all').then((response) => {
        data.value = response.data
    })
})

const options = ref({
    responsive: true,
    autoWidth: false,
    lengthChange: false,
    pageLength: 5,
})

const layout = ref({
    top: '<"d-flex justify-content-between"lf>rt<"d-flex justify-content-between"ip>',
    bottom: '<"d-flex justify-content-between"lf>rt<"d-flex justify-content-between"ip>',
    topStart: {
        buttons: [
            {
                text: 'Create Node',
                action: () => {
                    console.log('Create Node')
                }
                
            }
        ]
    }
})


</script>

<style lang="scss" scoped>

</style>