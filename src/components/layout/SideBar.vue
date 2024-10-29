<!-- Sidebar.vue -->
<template>
  <nav :class="['sidebar d-flex flex-column', { collapsed: isCollapsed }]">
    <SidebarBrand
      :is-collapsed="isCollapsed"
      @toggle-collapse="toggleCollapse"
    />
    <!-- Sidebar navigation items -->
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item" v-for="(page, index) in pages" :key="index">
        <RouterLink
          :class="[
            'nav-link',
            {
              active: isActiveRoute(page.link),
              'bg-color': isActiveRoute(page.link),
            },
          ]"
          :to="page.link"
        >
          <i :class="page.icon"></i>
          <span v-if="!isCollapsed" class="ms-2">{{ page.name }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import SidebarBrand from './SidebarBrand.vue'

defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-collapse'])

const route = useRoute()

const pages = [
  {
    name: 'Dashboard',
    link: '/dashboard',
    icon: 'bi bi-speedometer2',
  },
  {
    name: 'Orders',
    link: '/orders',
    icon: 'bi bi-cart',
  },
  {
    name: 'Docker',
    link: '/docker',
    icon: 'bi bi-box-seam',
  },
  {
    name: 'Users',
    link: '/users',
    icon: 'bi bi-people',
  },
  {
    name: 'Nodes',
    link: '/nodes',
    icon: 'bi bi-server',
  },
  {
    name: 'Settings',
    link: '/settings',
    icon: 'bi bi-gear',
  }
  // Add more pages as needed
]

const toggleCollapse = () => {
  emit('toggle-collapse')
}

const isActiveRoute = (link: unknown) => {
  return route.path === link
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh; /* Full viewport height */
  position: fixed;
  top: 0;
  left: 0;
  transition: width 0.3s;
  background-color: #f8f9fa;
}

.sidebar.collapsed {
  width: 80px;
}

.nav-link {
  display: flex;
  align-items: center;
  color: #495057;
}

.nav-link.active {
  background-color: #6c757d; /* Secondary color */
  color: white;
}

.nav-link:hover {
  background-color: #e9ecef;
}

.collapsed + .main-content {
  margin-left: 80px;
}
</style>
