<template>
  <!-- <form @submit.prevent="saveDashboard">test</form> -->
   <div>
    test
   </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'


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

function submit() {
  console.log('saveDashboard');
  
  api.post('/Dashboard', dashboard.value).then(() => {
  })
}


defineExpose({ submit })
</script>

<style scoped>
.text-danger {
  font-size: 0.875em;
}
</style>
