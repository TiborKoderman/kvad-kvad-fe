<template>
  <div>
    <div class="d-flex align-items-center mb-3">
      <button @click="goBack" class="btn btn-outline-dark me-2">
        <i class="bi bi-arrow-left"></i>
      </button>
      <h1 class="mb-0">Device details</h1>
    </div>
    <div>
      <p style="font-size: 0.9rem; color: gray; font-style: italic">
        {{ route.params.id }}
      </p>
      <p v-if="device.virtual" class="badge badge-success">Virtual Device</p>
    </div>
    <form action="submit">
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
          style="font-family: monospace;"
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
      <div class="form-group">
        <label for="description">Tags</label>
        <TagsTable :deviceId="route.params.id" />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import { ref } from 'vue'
import TagsTable from '@/components/Views/DevicesView/TagsTable.vue'

const route = useRoute()
const router = useRouter()
const device = ref({})

const macMask = {
  mask: 'HH:HH:HH:HH:HH:HH', // Mask format for MAC address
  lazy: false,
  overwrite: true,
  definitions: {
    H: /[0-9A-F]/, // Hexadecimal characters
  },
  delimiter: ':', // Delimiter for the mask
  blocks: [2, 2, 2, 2, 2, 2], // Number of characters in each blockl
  prepare: (value) => {
    return value.toUpperCase().replace(/[^0-9A-F]/g, '') // Convert to uppercase and remove invalid characters
  },
}

function getDevice() {
  const deviceId = route.params.id

  api.get(`/Device/${deviceId}`).then(response => {
    device.value = response.data
  })
}

function goBack() {
  router.back()
}

getDevice()
</script>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.25em 0.4em;
  font-size: 75%;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.badge-success {
  color: #fff;
  background-color: #28a745;
}

.mac-input::placeholder {
  color: rgba(0, 0, 0, 0.5); /* Adjust the color to make colons lighter */
}
</style>
