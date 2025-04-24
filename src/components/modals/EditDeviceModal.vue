<template>
  <form @submit.prevent="submit">
    <div class="form-group">
      <label for="new_username">Device name</label>
      <input
        type="text"
        class="form-control"
        id="new_username"
        v-model="device.name"
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
        v-model="device.description"
        required
        autocomplete="off"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
import ToggleButton from '@/components/formItems/ToggleButton.vue'

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
  onSubmit: {
    type: Function,
    required: false,
  },
  virtual: {
    type: Boolean,
    default: false,
  },
})

interface DeviceEditDTO {
  id: string | null
  name: string
  description: string
}

const device = ref<DeviceEditDTO>({
  id: props.id,
  name: '',
  description: '',
})

//submit, define expose and export default baseProps are required for the modal system to work
function submit() {
  return api.put('device/virtual', device)
}

defineOptions({
  name: 'EditDeviceModal',
  baseProps: (props: { virtual?: boolean }) => ({
    title: props.virtual ? 'Add Virtual Device' : 'Add Device',
  }),
})

defineExpose({ submit })
</script>
<style scoped>
.text-danger {
  font-size: 0.875em;
}
</style>
