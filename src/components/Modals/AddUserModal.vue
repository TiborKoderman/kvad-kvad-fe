<template>
  <Modal :title="`Add User`" :callback="addUser" v-model:is-open="modal_open"  ref="modal">
    <form @submit.prevent="validateAndAddUser">
      <div class="form-group">
        <label for="new_username">Username</label>
        <input
          type="text"
          class="form-control"
          id="new_username"
          v-model="user.username"
          required
          autocomplete="off"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="user.password"
          required
          autocomplete="new-password"
        />
        <small v-if="passwordError" class="text-danger">{{
          passwordError
        }}</small>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          autocomplete="new-password"
        />
        <small v-if="confirmPasswordError" class="text-danger">{{
          confirmPasswordError
        }}</small>
      </div>
      <MultiPicker :options="roles" v-model="selectedRoles" />
    </form>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import MultiPicker from '@/components/MultiPicker.vue'
import { ref, Ref } from 'vue'
import api from '@/api'

const emit = defineEmits(['close'])

const modal_open = ref(false)

interface Role {
  id: number
  name: string
}

const modal: Ref<InstanceType<typeof Modal> | null> = ref(null)

const user = ref({
  username: '',
  password: '',
  roles: [],
})

const roles = ref<Role[]>([])
const selectedRoles = ref<number[]>([])
const confirmPassword = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

fetchRoles()

function fetchRoles() {
  api.get('/roles').then(response => {
    roles.value = response.data
  })
}

function validateAndAddUser() {
  // Reset errors
  passwordError.value = ''
  confirmPasswordError.value = ''

  // Password validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  if (!passwordRegex.test(user.value.password)) {
    passwordError.value =
      'Password must be at least 8 characters long and include both letters and numbers.'
    return
  }

  // Confirm password validation
  if (user.value.password !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match.'
    return
  }

  // Proceed with adding the user
  addUser()
}

function addUser() {
  console.log('User added:', {
    username: user.value.username,
    password: user.value.password,
    roles: selectedRoles.value,
  })

  // API call to add user
  api
    .post('/Auth/register', {
      username: user.value.username,
      password: user.value.password,
      roles: selectedRoles.value,
    })
    .then(() => {
      if (modal.value !== null) {
        close()
      }
    })
}

function open() {
  if (modal.value !== null) {
    modal.value.open()
  }
}

function close() {
  if (modal.value !== null) {
    emit('close')
    modal.value.close()
  }
}

defineExpose({ open })
</script>

<style scoped>
.text-danger {
  font-size: 0.875em;
}
</style>
