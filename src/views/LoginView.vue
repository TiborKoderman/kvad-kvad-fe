<template>
  <div class="container vh-100">
    <div class="row h-100 align-items-center justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="row">
          <!-- Logo Section -->
          <div class="col-md-6 text-center">
            <img :src="logo" alt="Logo" class="img-fluid" />
          </div>
          <!-- Login Form Section -->

          <div class="col-md-6">
            <div v-if="passwordInvalid" class="alert alert-danger" role="alert">
              Invalid username or password
            </div>
            <form @submit.prevent="login">
              <!-- Email Field -->
              <div class="mb-3">
                <label for="email" class="form-label">Username</label>
                <input
                  type="text"
                  class="form-control"
                  id="username"
                  v-model="username"
                  placeholder="username"
                  required
                />
              </div>
              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  v-model="password"
                  placeholder="Password"
                  required
                />
              </div>
              <!-- Submit Button -->
              <button
                type="submit"
                class="btn btn-primary w-100"
                @keyup.enter="login"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import logo from '@/assets/logo.svg'
import api from '@/api'
import { useRouter } from 'vue-router'
const username = ref('')
const password = ref('')

const passwordInvalid = ref(false)

const router = useRouter()

function login() {
  // Handle login logic here
  //   console.log(`Email: ${username.value}, Password: ${password.value}`)
  api
    .post('/auth/login', {
      username: username.value,
      password: password.value,
    })
    .then(response => {
      // Handle set token and redirect to dashboard
      localStorage.setItem('token', response.data.token)
      router.push('/')
    })
    .catch(error => {
      console.error(error)
      passwordInvalid.value = true
    })
}
</script>

<style>
/* Optional custom styles */
</style>
