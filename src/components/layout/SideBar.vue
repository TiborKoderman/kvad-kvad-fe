<!-- Sidebar.vue -->
<template>
    <nav class="col-md-3 col-lg-2 sidebar p-0 m-0" :class="{ 'collapsed': isCollapsed }">
      <SidebarBrand
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
              <span class="ms-2" >{{ page.name }}</span>
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

<script setup lang="ts">
import { useRoute } from 'vue-router'
import SidebarBrand from './SidebarBrand.vue'

import SidebarMenuConfig from '@/assets/config/sidebar_menu.json'

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

const pages: Array<Page> = SidebarMenuConfig;

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
  min-height: 100vh;
  background-color: #f8f9fa;
  transition: width 0.3s ease-in-out;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 0;

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



</style>
