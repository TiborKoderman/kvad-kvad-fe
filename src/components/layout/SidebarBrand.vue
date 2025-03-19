<!-- SidebarBrand.vue -->
<template>
  <div
    class="sidebar-brand d-flex align-items-center p-3 justify-content-between"
    :class="[props.brandClass]"
  >
    <div class="d-flex align-items-center">
      <img :src="logo" alt="Logo" :class="['logo']" class="ms-2" />
    </div>
    <button @click="logout" class="btn btn-light btn-sm">
      <i class="bi bi-box-arrow-right"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.svg'
import UserIcon from '@/components/UserIcon.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  brandClass: {
    type: String,
    default: 'bg-dark',
  },
})

const logout = () => {
  // Implement your logout logic here
  localStorage.removeItem('token')
  router.push({ name: 'login' })
}
</script>

<style scoped>
.sidebar-brand {
  height: 80px;
}

.logo {
  max-height: 50px;
}

.collapsed-logo {
  max-height: 30px;
}
</style>
