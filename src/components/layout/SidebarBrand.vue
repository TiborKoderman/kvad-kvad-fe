<!-- SidebarBrand.vue -->
<template>
  <div
    class="sidebar-brand d-flex align-items-center p-3 justify-content-between"
    :class="[props.brandClass]"
  >
    <div class="d-flex align-items-center">
      <img :src="logo" alt="Logo" :class="['logo']" class="ms-2" />
    </div>

  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/logo.svg'


const props = defineProps({
  brandClass: {
    type: String,
    default: 'bg-dark',
  },
})


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
