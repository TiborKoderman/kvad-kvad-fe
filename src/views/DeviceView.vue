<template>
  <div class="container h-100">
    <div class="d-flex align-items-center mb-3">
      <div class="d-flex flex-column">
        <div class="d-flex flex-row align-items-center justify-content-center">
          <button @click="goBack" class="btn btn-outline-dark me-2">
            <i class="bi bi-arrow-left"></i>
          </button>
          <h1 class="mb-0">Device details</h1>
          <div class="ms-2 d-flex align-items-center justify-content-center flex-fill">
            <p v-if="device.virtual" class="badge bg-warning mt-2 align-self-center">Virtual</p>
          </div>
        </div>
        <p style="font-size: 0.9rem; color: gray; font-style: italic">
          {{ route.params.id }}
        </p>
      </div>
    </div>
    <div v-if="pendingChanges" class="alert alert-warning mt-4 d-flex justify-content-between align-items-center">
      <div>
      You have unsaved changes.
      </div>
      <button @click="saveChanges" class="btn btn-primary btn-sm">Click here to save</button>
    </div>
    <form action="submit" class="mb-4">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="device.name"
          required
          autocomplete="off"
        />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input
          type="text"
          class="form-control"
          id="description"
          v-model="device.description"
          required
          autocomplete="off"
        />
      </div>
      <div class="form-group">
        <label for="description">Owner</label>
        <input
          type="text"
          class="form-control"
          id="description"
          v-model="device.ownerId"
          readonly
          style="user-select: none"
        />
      </div>
      <div class="form-group">
        <label for="mac">MAC address</label>
        <input
          type="text"
          class="form-control mac-input"
          id="mac"
          :placeholder="device.mac"
          v-imask="macMask"
          style="font-family: monospace"
        />
      </div>
      <div class="form-group">
        <label for="location">Location</label>
        <input
          type="text"
          class="form-control"
          id="location"
          v-model="device.location"
          autocomplete="off"
        />
      </div>
      <div class="form-group">
        <label for="type">Type</label>
        <input
          type="text"
          class="form-control"
          id="type"
          v-model="device.type"
          required
          autocomplete="off"
        />
      </div>
      <div class="form-group">
        <label for="update-interval">Historize interval</label>
        <ToggleButton
          v-model="device.immediate"
          :true-value="true"
          :false-value="false"
          label="Immediate"
          class="mb-2"
        />
        <input
          type="text"
          class="form-control"
          id="update-interval"
          v-model="device.historcizeInterval"
          :disabled="device.immediate"
          required
          autocomplete="off"
        />
      </div>
    </form>


    <h2 for="description">Tags</h2>
    <TagsTable v-model="device" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { computed, ref } from 'vue'
import TagsTable from '@/components/Views/DevicesView/TagsTable.vue'
import ToggleButton from '@/components/formItems/ToggleButton.vue'
const originalDevice = ref("")

const route = useRoute()
const router = useRouter()
const device = ref({
  id: '',
  name: '',
  description: '',
  ownerId: '',
  mac: '',
  location: '',
  type: '',
  virtual: false,
})

const pendingChanges = computed(()=> {
  return originalDevice.value !== JSON.stringify(device.value)
})

const macMask = {
  mask: 'HH:HH:HH:HH:HH:HH', // Mask format for MAC address
  lazy: false,
  overwrite: true,
  definitions: {
    H: /[0-9A-F]/, // Hexadecimal characters
  },
  delimiter: ':', // Delimiter for the mask
  blocks: [2, 2, 2, 2, 2, 2], // Number of characters in each block
  prepare: value => {
    return value.toUpperCase().replace(/[^0-9A-F]/g, '') // Convert to uppercase and remove invalid characters
  },
}

function getDevice() {
  const deviceId = route.params.id

  api
    .get(`/Device/${deviceId}`)
    .then(response => {
      device.value = response.data
      originalDevice.value = JSON.stringify(device.value) // Store the original device data
    })
    .catch(error => {
      console.error('Error fetching device:', error)
    })
}

function goBack() {
  if (pendingChanges.value) {
    import('sweetalert2').then(Swal => {
      Swal.default.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to leave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave',
        cancelButtonText: 'No, stay',
      }).then(result => {
        if (result.isConfirmed) {
          router.back()
        }
      })
    })
  } else {
    router.back()
  }
}

function saveChanges() {
  const deviceId = route.params.id

  return api
    .put(`/Device/${deviceId}`, device.value)
    .then(() => {
      originalDevice.value = JSON.stringify(device.value) // Update the original device data
      router.push({ name: 'DevicesView' })
    })
    .catch(error => {
      console.error('Error saving device:', error)
      import('sweetalert2').then(Swal => {
        Swal.default.fire({
          title: 'Error',
          text: 'There was an error saving the device. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        })
      })
    })
}

getDevice()
</script>

<style scoped>
.scrollable-container {
  /* max-height: 80vh; Adjust height as needed */
  overflow-y: auto;
  padding-right: 1rem; /* Optional: Add padding for scrollbar spacing */
}

.mac-input::placeholder {
  color: rgba(0, 0, 0, 0.5); /* Adjust the color to make colons lighter */
}
</style>
