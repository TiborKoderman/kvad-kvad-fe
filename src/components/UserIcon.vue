<template>
  <div class="dropdown" v-click-outside="closeDropdown">
    <div class="user-icon" @click="toggleDropdown">
      <img :src="userIcon" alt="User Icon" />
    </div>
    <div class="dropdown-menu" :class="{ show: isOpen }" @click="closeDropdown">
      <RouterLink class="dropdown-item" to="#">Profile</RouterLink>
      <RouterLink class="dropdown-item" to="/settings/profileSettings">Settings</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import default_user_icon from '@/assets/img/default_user_icon.png'
import { ref, onMounted } from 'vue'

const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const userIcon = ref(default_user_icon)

onMounted(() => {
  api
    .get('/user/icon/admin', { responseType: 'blob' })
    .then(response => {
      userIcon.value = URL.createObjectURL(response.data)
    })
    .catch(() => {
      userIcon.value = default_user_icon
    })
})
</script>

<style scoped>
.user-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.user-icon:hover {
  filter: brightness(0.8);
}

.user-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
