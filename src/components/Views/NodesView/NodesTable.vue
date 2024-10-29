<template>
    <div>
        <DataTable
        :data="data"
        :columns="columns"
        :options="options"
        class="table table-bordered table-hover"
        >

        </DataTable>
    </div>
</template>

<script setup lang="ts">
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'

import { onMounted, ref } from 'vue'

import api from '@/api'


DataTable.use(DataTablesCore)

const columns = ref([
    { title: 'Name', data: 'name' },
    { title: 'Observed Services', data: 'observedServices' },
    { title: 'Observed Containers', data: 'observedContainers'},
])

const data = ref([])

onMounted(() => {
    api.get('/Nodes').then((response) => {
        data.value = response.data
    })
})

const options = ref({
    responsive: true,
    autoWidth: false,
    lengthChange: false,
    pageLength: 5,
})


</script>

<style lang="scss" scoped>

</style>