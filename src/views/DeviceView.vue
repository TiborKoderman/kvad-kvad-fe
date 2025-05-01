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
    <div></div>
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
          v-model="device.owner.username"
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
        <label for="description">Type</label>
        <input
          type="text"
          class="form-control"
          id="type"
          v-model="device.type"
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
import { ref } from 'vue'
import TagsTable from '@/components/Views/DevicesView/TagsTable.vue'

const route = useRoute()
const router = useRouter()
const device = ref({
  id: '',
  name: '',
  description: '',
  owner: {
    id: '',
    username: '',
  },
  mac: '',
  location: '',
  type: '',
  virtual: false,
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
    })
    .catch(error => {
      console.error('Error fetching device:', error)
    })
}

function goBack() {
  router.back()
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
