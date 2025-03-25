<template>
  <!-- <form @submit.prevent="saveDashboard">test</form> -->
   <div>
    test
   </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import api from '@/api'


const emit = defineEmits(['close'])

const eventBus = inject('eventBus', ref(new Map()))

const props = defineProps({
  dashboardId: {
    type: String,
    required: false,
  },
  onSubmit: {
    type: Function,
    required: false,
  },
})

if(eventBus.value.get('submit')) {
  saveDashboard()
}

interface DashboardDTO {
  id: string | null
  name: string
  description: string
  scrollable: boolean
  icon: string | null
  color: string | null
}


const dashboard = ref<DashboardDTO>({
  id: props.dashboardId,
  name: '',
  description: '',
  scrollable: false,
  icon: null,
  color: null,
})

function saveDashboard() {
  api.post('/Dashboard', dashboard.value).then(() => {
    emit('close')
  })
}


defineExpose({ open })
</script>

<style scoped>
.text-danger {
  font-size: 0.875em;
}
</style>
