<template>
  <div class="dropdown-left"  style="position: relative;">
    <div class="user-icon" @click="toggleDropdown">
      <img :src="userIcon" alt="User Icon" />
    </div>
    <ul
      class="dropdown-menu dropdown-menu-end"
      :class="{ show: isOpen }"
      @click="closeDropdown"
      style="position: absolute; right: 0; transform: translateX(0);"
    >
      <li><RouterLink class="dropdown-item" to="#">Profile</RouterLink></li>
      <li><RouterLink class="dropdown-item" to="/settings/profileSettings"
        >Settings</RouterLink
      ></li>
      <li><a class="dropdown-item" href="#" @click="logout">
        Logout
        <i class="bi bi-box-arrow-right"></i>
      </a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import api from '@/api'
import default_user_icon from '@/assets/img/default_user_icon.png'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)

const router = useRouter()

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


const logout = () => {
  // Implement your logout logic here
  localStorage.removeItem('token')
  router.push({ name: 'login' })
}
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

.dropdown-menu {
  z-index: 1000;
}
</style>
