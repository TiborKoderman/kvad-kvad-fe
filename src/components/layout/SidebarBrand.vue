<!-- SidebarBrand.vue -->
<template>
  <div
    class="sidebar-brand d-flex align-items-center p-3 m-0 justify-content-between"
  >
    <div class="d-flex align-items-center">
      <img :src="logo" alt="Logo" :class="['logo']" class="ms-2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.svg'

defineProps({})
</script>

<style scoped>
.sidebar-brand {
  height: 80px;
  background-color: #370748;
  color: #ffffff;
}

.logo {
  max-height: 50px;
}

.collapsed-logo {
  max-height: 30px;
}
</style>
