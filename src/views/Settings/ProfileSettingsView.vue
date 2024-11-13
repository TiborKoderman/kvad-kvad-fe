<template>
  <main>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Profile</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="username"
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                class="form-control"
                id="email"
                v-model="email"
              />
            </div>

            <div class="form-group">
              <label for="change-password">Change Password</label>
              <button class="btn btn-primary"></button>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label for="user-icon">User Icon</label>
              <UserIcon />
              <i class="bi bi-pencil-square pointer-event"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UserIcon from '@/components/UserIcon.vue'

const username = ref('')

const email = ref('')
</script>

<style scoped></style>
