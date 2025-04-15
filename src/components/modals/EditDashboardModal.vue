<template>
  <!-- <form @submit.prevent="saveDashboard">test</form> -->
  <form @submit.prevent="submit">
    <div class="form-group">
      <label for="new_username">Dashboard name</label>
      <input
        type="text"
        class="form-control"
        id="new_username"
        v-model="dashboard.name"
        required
        autocomplete="off"
      />
    </div>
    <div class="form-group">
      <label for="new_username">Description</label>
      <input
        type="text"
        class="form-control"
        id="new_username"
        v-model="dashboard.description"
        required
        autocomplete="off"
      />
    </div>
    <div class="form-group">
      <label for="">Dashboard type</label>
      <SelectDropdown :options="dashboardTypes" label="name" v-model="dashboard.type"> </SelectDropdown>
    </div>
    <div class="form-group">
      <label for="new_username">Icon</label>
      <input
        type="text"
        class="form-control"
        id="new_username"
        v-model="dashboard.icon"
        required
        autocomplete="off"
      />
    </div>

    <div class="form-group">
      <label for="colorPicker">Color</label>
      <input
        type="color"
        class="form-control"
        id="colorPicker"
        v-model="dashboard.color"
      />
    </div>
    <div class="form-toggle">
      <ToggleButton v-model="dashboard.scrollable" id="scrollableCheckbox" label="Scrollable"/>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
import SelectDropdown from '@/components/formItems/SelectDropdown.vue'
import ToggleButton from '@/components/formItems/ToggleButton.vue'

fetchDashboardTypes()

const props = defineProps({
  id: {
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
  type: string | null
}

const dashboard = ref<DashboardDTO>({
  id: props.id,
  name: '',
  description: '',
  scrollable: false,
  icon: null,
  color: null,
  type: null,
})

const dashboardTypes = ref([])

;(async function getDashboard() {
  if (!props.id) {
    return
  }

  return api.get(`/Dashboard/${props.id}`).then(response => {
    dashboard.value = response.data
  })
})()

//submit, define expose and export default baseProps are required for the modal system to work

async function submit() {
  if (!dashboard.value.name || !dashboard.value.description) {
    return Promise.reject(
      new Error('Validation failed: Name and Description are required.'),
    )
  }

  console.log('saveDashboard')

  return api.post('/Dashboard', dashboard.value).then(() => {
    // Handle success
  })
}

async function fetchDashboardTypes() {
  return api.get('/dashboard/types').then(response => {
    dashboardTypes.value = response.data
  })
}

defineOptions({
  name: 'EditDashboardModal',
  baseProps: props => ({
    title: 'Edit dashboard',
  }),
})

defineExpose({ submit })
</script>

<style scoped>
.text-danger {
  font-size: 0.875em;
}
</style>
