<!-- SidebarBrand.vue -->
<template>
  <div
    :class="[
      'sidebar-brand d-flex align-items-center p-3',
      isCollapsed ? 'justify-content-center' : 'justify-content-between',
      brandClass,
    ]"
  >
    <div class="d-flex align-items-center">
      <img :src="logo" alt="Logo" :class="['logo']" class="ms-2" />
    </div>
    <button v-if="!isCollapsed" @click="logout" class="btn btn-light btn-sm">
      <i class="bi bi-box-arrow-right"></i>
    </button>
      <UserIcon v-if="!isCollapsed" />
    <button
      @click="toggleCollapse"
      class="btn btn-link text-decoration-none btn-light"
      :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      v-if="!isCollapsed"
    >
      <i class="bi bi-layout-sidebar text-white"></i>
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
  isCollapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-collapse'])

const logout = () => {
  // Implement your logout logic here
  localStorage.removeItem('token')
  router.push({ name: 'login' })
}

const toggleCollapse = () => {
  emit('toggle-collapse')
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
