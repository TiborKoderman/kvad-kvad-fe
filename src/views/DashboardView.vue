<template>
<div v-if="dashboards?.length === 0" class="d-flex justify-content-center align-items-center vh-100">
    <div class="text-center">
        <div class="mb-3">
            <strong> No dashboards found </strong>
        </div>
        <button class="btn btn-primary" @click="modals.open('edit-dashboard')">Create Dashboard</button>
    </div>
</div>
  <div v-else v-for="dashboard in dashboards" :key="dashboard.id">
    {{ dashboard.name }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'
import { useRoute } from 'vue-router'
import {useModalStore} from '@/stores/modals'

const modals = useModalStore()

const route = useRoute()
const dashboards = ref([])


const cards = ref([
  {
    id: 1,
    title: 'Card 1',
    description: `This is card 1.
                      It has a multi-line description.`,
  },
  {
    id: 2,
    title: 'Card 2',
    description: 'This is card 2',
  },
  {
    id: 3,
    title: 'Card 3',
    description: 'This is card 3',
  },
  {
    id: 4,
    title: 'Card 4',
    description: 'This is card 4',
  },
  {
    id: 5,
    title: 'Card 5',
    description: 'This is card 5',
  },
  {
    id: 6,
    title: 'Card 6',
    description: 'This is card 6',
  },
  {
    id: 7,
    title: 'Card 7',
    description: 'This is card 7',
  },
  {
    id: 8,
    title: 'Card 8',
    description: 'This is card 8',
  },
  {
    id: 9,
    title: 'Card 9',
    description: 'This is card 9',
  },
  {
    id: 10,
    title: 'Card 10',
    description: 'This is card 10',
  },
  {
    id: 11,
    title: 'Card 11',
    description: 'This is card 11',
  },
  {
    id: 12,
    title: 'Card 12',
    description: 'This is card 12',
  },
  {
    id: 13,
    title: 'Card 13',
    description: 'This is card 13',
  },
  {
    id: 14,
    title: 'Card 14',
    description: 'This is card 14',
  },
  {
    id: 15,
    title: 'Card 15',
    description: 'This is card 15',
  },
  {
    id: 16,
    title: 'Card 16',
    description: 'This is card 16',
  },
  {
    id: 17,
    title: 'Card 17',
    description: 'This is card 17',
  },
  {
    id: 18,
    title: 'Card 18',
    description: 'This is card 18',
  },
  {
    id: 19,
    title: 'Card 19',
    description: 'This is card 19',
  },
  {
    id: 20,
    title: 'Card 20',
    description: 'This is card 20',
  },
  {
    id: 21,
    title: 'Card 21',
    description: 'This is card 21',
  },
  {
    id: 22,
    title: 'Card 22',
    description: 'This is card 22',
  },
  {
    id: 23,
    title: 'Card 23',
    description: 'This is card 23',
  },
  {
    id: 24,
    title: 'Card 24',
    description: 'This is card 24',
  },
  {
    id: 25,
    title: 'Card 25',
    description: 'This is card 25',
  },
  {
    id: 26,
    title: 'Card 26',
    description: 'This is card 26',
  },
  {
    id: 27,
    title: 'Card 27',
    description: 'This is card 27',
  },
  {
    id: 28,
    title: 'Card 28',
    description: 'This is card 28',
  },
  {
    id: 29,
    title: 'Card 29',
    description: 'This is card 29',
  },
  {
    id: 30,
    title: 'Card 30',
    description: 'This is card 30',
  },
  {
    id: 31,
    title: 'Card 31',
    description: 'This is card 31',
  },
  {
    id: 32,
    title: 'Card 32',
    description: 'This is card 32',
  },
  {
    id: 33,
    title: 'Card 33',
    description: 'This is card 33',
  },
  {
    id: 34,
    title: 'Card 34',
    description: 'This is card 34',
  },
  {
    id: 35,
    title: 'Card 35',
    description: 'This is card 35',
  },
  {
    id: 36,
    title: 'Card 36',
    description: 'This is card 36',
  },
  {
    id: 37,
    title: 'Card 37',
    description: 'This is card 37',
  },
  {
    id: 38,
    title: 'Card 38',
    description: 'This is card 38',
  },
  {
    id: 39,
    title: 'Card 39',
    description: 'This is card 39',
  },
  {
    id: 40,
    title: 'Card 40',
    description: 'This is card 40',
  },
  {
    id: 41,
    title: 'Card 41',
    description: 'This is card 41',
  },
  {
    id: 42,
    title: 'Card 42',
    description: 'This is card 42',
  },
  {
    id: 43,
    title: 'Card 43',
    description: 'This is card 43',
  },
  {
    id: 44,
    title: 'Card 44',
    description: 'This is card 44',
  },
  {
    id: 45,
    title: 'Card 45',
    description: 'This is card 45',
  },
  {
    id: 46,
    title: 'Card 46',
    description: 'This is card 46',
  },
  {
    id: 47,
    title: 'Card 47',
    description: 'This is card 47',
  },
  {
    id: 48,
    title: 'Card 48',
    description: 'This is card 48',
  },
  {
    id: 49,
    title: 'Card 49',
    description: 'This is card 49',
  },
  {
    id: 50,
    title: 'Card 50',
    description: 'This is card 50',
  },
  {
    id: 51,
    title: 'Card 51',
    description: 'This is card 51',
  },
  {
    id: 52,
    title: 'Card 52',
    description: 'This is card 52',
  },
  {
    id: 53,
    title: 'Card 53',
    description: 'This is card 53',
  },
  {
    id: 54,
    title: 'Card 54',
    description: 'This is card 54',
  },
  {
    id: 55,
    title: 'Card 55',
    description: 'This is card 55',
  },
  {
    id: 56,
    title: 'Card 56',
    description: 'This is card 56',
  },
  {
    id: 57,
    title: 'Card 57',
    description: 'This is card 57',
  },
  {
    id: 58,
    title: 'Card 58',
    description: 'This is card 58',
  },
  {
    id: 59,
    title: 'Card 59',
    description: 'This is card 59',
  },
  {
    id: 60,
    title: 'Card 60',
    description: 'This is card 60',
  },
  {
    id: 61,
    title: 'Card 61',
    description: 'This is card 61',
  },
  {
    id: 62,
    title: 'Card 62',
    description: 'This is card 62',
  },
  {
    id: 63,
    title: 'Card 63',
    description: 'This is card 63',
  },
  {
    id: 64,
    title: 'Card 64',
    description: 'This is card 64',
  },
  {
    id: 65,
    title: 'Card 65',
    description: 'This is card 65',
  },
  {
    id: 66,
    title: 'Card 66',
    description: 'This is card 66',
  },
  {
    id: 67,
    title: 'Card 67',
    description: 'This is card 67',
  },
  {
    id: 68,
    title: 'Card 68',
    description: 'This is card 68',
  },
  {
    id: 69,
    title: 'Card 69',
    description: 'This is card 69',
  },
  {
    id: 70,
    title: 'Card 70',
    description: 'This is card 70',
  },
  {
    id: 71,
    title: 'Card 71',
    description: 'This is card 71',
  },
  {
    id: 72,
    title: 'Card 72',
    description: 'This is card 72',
  },
  {
    id: 73,
    title: 'Card 73',
    description: 'This is card 73',
  },
  {
    id: 74,
    title: 'Card 74',
    description: 'This is card 74',
  },
  {
    id: 75,
    title: 'Card 75',
    description: 'This is card 75',
  },
  {
    id: 76,
    title: 'Card 76',
    description: 'This is card 76',
  },
  {
    id: 77,
    title: 'Card 77',
    description: 'This is card 77',
  },
  {
    id: 78,
    title: 'Card 78',
    description: 'This is card 78',
  },
  {
    id: 79,
    title: 'Card 79',
    description: 'This is card 79',
  },
  {
    id: 80,
    title: 'Card 80',
    description: 'This is card 80',
  },
  {
    id: 81,
    title: 'Card 81',
    description: 'This is card 81',
  },
  {
    id: 82,
    title: 'Card 82',
    description: 'This is card 82',
  },
  {
    id: 83,
    title: 'Card 83',
    description: 'This is card 83',
  },
  {
    id: 84,
    title: 'Card 84',
    description: 'This is card 84',
  },
  {
    id: 85,
    title: 'Card 85',
    description: 'This is card 85',
  },
  {
    id: 86,
    title: 'Card 86',
    description: 'This is card 86',
  },
  {
    id: 87,
    title: 'Card 87',
    description: 'This is card 87',
  },
  {
    id: 88,
    title: 'Card 88',
    description: 'This is card 88',
  },
  {
    id: 89,
    title: 'Card 89',
    description: 'This is card 89',
  },
  {
    id: 90,
    title: 'Card 90',
    description: 'This is card 90',
  },
  {
    id: 91,
    title: 'Card 91',
    description: 'This is card 91',
  },
  {
    id: 92,
    title: 'Card 92',
    description: 'This is card 92',
  },
  {
    id: 93,
    title: 'Card 93',
    description: 'This is card 93',
  },
  {
    id: 94,
    title: 'Card 94',
    description: 'This is card 94',
  },
  {
    id: 95,
    title: 'Card 95',
    description: 'This is card 95',
  },
  {
    id: 96,
    title: 'Card 96',
    description: 'This is card 96',
  },
  {
    id: 97,
    title: 'Card 97',
    description: 'This is card 97',
  },
  {
    id: 98,
    title: 'Card 98',
    description: 'This is card 98',
  },
  {
    id: 99,
    title: 'Card 99',
    description: 'This is card 99',
  },
  {
    id: 100,
    title: 'Card 100',
    description: 'This is card 100',
  },
])

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
