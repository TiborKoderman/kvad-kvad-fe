<template>
    <table class="table"         :class="{
        striped: striped,
        bordered: bordered,
        hoverable: hoverable
    }"
    >
        <thead>
            <tr>
                <th v-for="(column, index) in columns" :key="index">
                    {{ column.title }}
                </th>
            </tr>
        </thead>
        <tbody
        :class="options.ScrollY ? 'overflow-y-auto' : ''">
            <tr v-for="(row, rowIndex) in data" :key="rowIndex">
                <td v-for="(column, colIndex) in columns" :key="colIndex">
                    {{ row[column.data] }}
                </td>
            </tr>
        </tbody>
    </table>
</template>l

<script setup lang="ts">

import { PropType } from 'vue'

const props = defineProps({
    columns: {
        type: Array<
            {
                title: string,
                data: string,
                editable: boolean,
                dataType: string
            }
        >,
        required: true
    },
    data: {
        type: Array as PropType<Array<Record<string, any>>>,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    options: {
        type: Object,
        default: () => ({
            ScrollY: '400px',
            scrollCollapse: true,
            paging: false,
            searching: false,
            ordering: false,
            info: false,
            autoWidth: false,
            responsive: true,
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-center'
                }
            ],

        })
    },
    striped: {
        type: Boolean,
        default: false
    },
    bordered: {
        type: Boolean,
        default: false
    },
    hoverable: {
        type: Boolean,
        default: false
    }
})

</script>

<style scoped>

</style>
