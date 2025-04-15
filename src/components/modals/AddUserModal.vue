<template>
  <form @submit.prevent="submit">
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
</template>

<script setup lang="ts">
import MultiPicker from '@/components/MultiPicker.vue'
import { ref } from 'vue'
import api from '@/api'

interface Role {
  id: number
  name: string
}

const props = defineProps({
  editUser: {
    type: Object,
    required: false,
  },
})

const user = ref(
  props.editUser ?? {
    username: '',
    password: '',
    roles: [],
  },
)

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

async function submit() {
  // Reset errors
  console.log('Submitting form')

  passwordError.value = ''
  confirmPasswordError.value = ''

  // Password validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  if (!passwordRegex.test(user.value.password)) {
    passwordError.value =
      'Password must be at least 8 characters long and include both letters and numbers.'
    return Promise.reject(new Error(passwordError.value))
  }

  // Confirm password validation
  if (user.value.password !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match.'
    return Promise.reject(new Error(confirmPasswordError.value))
  }

  // Proceed with adding the user
  return addUser()
    .then(() => {
      // Reset form
      console.log('User added:', {
        username: user.value.username,
        password: user.value.password,
        roles: selectedRoles.value,
      })
    })
    .catch(error => {
      console.error('Error adding user:', error)
    })
}

async function addUser() {
  console.log('User added:', {
    username: user.value.username,
    password: user.value.password,
    roles: selectedRoles.value,
  })

  // API call to add user
  return api
    .post('/Auth/register', {
      username: user.value.username,
      password: user.value.password,
      roles: selectedRoles.value,
    })
}

defineOptions({
  name: 'AddUserForm',
  baseProps: (props: { editUser?: any }) => ({
    title: props.editUser ? 'Edit User' : 'Add User',
  }),
})

defineExpose({ submit })
</script>

<style scoped>
.text-danger {
  font-size: 0.875em;
}


</style>
