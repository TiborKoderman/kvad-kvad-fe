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
      <div class="form-group">
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="scrollableCheckbox"
            v-model="dashboard.scrollable"
          />
          <label class="form-check-label" for="scrollableCheckbox">Scrollable</label>
        </div>
      </div>
  </form>
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

async function submit() {
  if (!dashboard.value.name || !dashboard.value.description) {
    return Promise.reject(new Error('Validation failed: Name and Description are required.'));
  }

  console.log('saveDashboard');
  
  return api.post('/Dashboard', dashboard.value).then(() => {
    // Handle success
  });
}


defineExpose({ submit })
</script>

<style scoped>
.text-danger {
  font-size: 0.875em;
}
</style>
