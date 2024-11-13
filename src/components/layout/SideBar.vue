<!-- Sidebar.vue -->
<template>
  <nav :class="['sidebar d-flex flex-column', { collapsed: isCollapsed }]">
    <SidebarBrand
      :is-collapsed="isCollapsed"
      @toggle-collapse="toggleCollapse"
    />
    <!-- Sidebar navigation items -->
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item p-1" v-for="(page, index) in pages" :key="index">
        <RouterLink
          :class="[
            'nav-link',
            {
              active: isActiveRoute(page.link),
              'bg-primary': isActiveRoute(page.link),
            },
          ]"
            :to="page.link"
            @click="expandItem(page)"
          >
            <i :class="page.icon"></i>
            <span class="ms-2" v-if="!isCollapsed">{{ page.name }}</span>
            <transition name="rotate">
            <i
              v-if="page.children"
              class="bi ms-auto"
              :class="page.isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"
              aria-hidden="true"
            ></i>
            </transition>

        </RouterLink>
        <transition name="expand">
          <ul
            v-if="page.children && page.isExpanded"
            class="nav flex-column ms-3"
          >
            <li
              class="nav-item p-1"
              v-for="(child, childIndex) in page.children"
              :key="childIndex"
            >
              <RouterLink
                :class="[
                  'nav-link',
                  {
                    active: isActiveRoute(child.link),
                    'bg-primary': isActiveRoute(child.link),
                  },
                ]"
                :to="child.link"
              >
                <i :class="child.icon"></i>
                <span class="ms-2">{{ child.name }}</span>
              </RouterLink>
            </li>
          </ul>
        </transition>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
}
.expand-enter, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import SidebarBrand from './SidebarBrand.vue'

defineProps({
  isCollapsed: {
    type: Boolean,
    default: false,
  },
})

interface Page {
  name: string
  link: string
  icon?: string
  children?: Page[]
  isExpanded?: boolean
}

const emit = defineEmits(['toggle-collapse'])

const route = useRoute()

const pages: Array<Page> = [
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
    name: 'Nodes',
    link: '/nodes',
    icon: 'bi bi-server',
  },
  {
    name: 'System',
    link: '/system',
    icon: 'bi bi-cpu',
  },
  {
    name: 'Chat',
    link: '/chat',
    icon: 'bi bi-chat-left',
  },
  {
    name: 'Settings',
    link: '/settings',
    icon: 'bi bi-gear',
    children: [
      {
        name: 'General Settings',
        link: '/settings/general',
        icon: 'bi bi-gear',
      },
      {
        name: 'User Settings',
        link: '/settings/users',
      },
    ],
  },
  // Add more pages as needed
]

const toggleCollapse = () => {
  emit('toggle-collapse')
}

function expandItem(page: Page) {
  if(page.children) {
    page.isExpanded = !page.isExpanded
  }
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
  background-color: --bs-secondary; /* Secondary color */
  color: white;
  padding: 0.5rem 1rem;
}

.nav-link:hover {
  background-color: #e9ecef;
}

.collapsed + .main-content {
  margin-left: 80px;
}
</style>
