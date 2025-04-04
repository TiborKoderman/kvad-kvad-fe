<template>
  <div
    class="sidebar-wrapper"
    :class="{ 'collapsed': menu.collapsed }"
    :style="sidebarStyle"
  >
    <nav class="sidebar p-0 m-0 d-flex flex-column flex-grow-1">
      <SidebarBrand />
      <!-- Sidebar navigation items -->
      <ul class="nav nav-pills d-flex flex-column flex-grow-1">
        <li class="nav-item p-1" v-for="(page, index) in pages" :key="index">
            <RouterLink
            :class="[
              'nav-link',
              {
              active: !page.children && isActiveRoute(page.link),
              'bg-primary': !page.children && isActiveRoute(page.link),
              },
            ]"
            class="d-flex align-items-center"
            :to="page.children ? '#' : page.link"
            @click="expandItem(page)"
            >
            <i :class="page.icon"></i>
            <span class="ms-2">{{ page.name }}</span>
            <transition name="rotate">
              <i
              v-if="page.children"
              class="bi ms-auto"
              :class="page.isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'"
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
      <div class="nav-item p-1 mt-auto">
        <RouterLink
          to="/adminSettings"
          class="nav-link align-self-end"
          :class="[
            'nav-link',
            {
              active: isActiveRoute('/adminSettings'),
              'bg-primary': isActiveRoute('/adminSettings'),
            },
          ]"
        >
          <i class="bi bi-wrench"></i>
          <span class="ms-2"> admin</span>
        </RouterLink>
      </div>
    </nav>
    <div
      class="resizer"
      @mousedown="startResizing"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import SidebarBrand from './SidebarBrand.vue'
import useMenuStore from '@/stores/menu'
import SidebarMenuConfig from '@/assets/config/sidebar_menu.json'

const menu = useMenuStore()

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

const route = useRoute()

const pages: Array<Page> = SidebarMenuConfig

function expandItem(page: Page) {
  if (page.children) {
    page.isExpanded = !page.isExpanded
  }
}

const isActiveRoute = (link: unknown) => {
  return route.path === link
}

// Resizing logic
let isResizing = false

function startResizing(event: MouseEvent) {
  isResizing = true
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResizing)
}

function resize(event: MouseEvent) {
  if (isResizing) {
    const newWidth = event.clientX
    if (newWidth >= 150 && newWidth <= 400) {
      menu.sidebarWidth = `${newWidth}px`
    }
  }
}

function stopResizing() {
  isResizing = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResizing)
  document.body.style.userSelect = 'auto'
  menu.saveSidebarWidth()
}

onUnmounted(() => {
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResizing)
})

// Computed property for sidebar style
const sidebarStyle = computed(() => ({
  width: menu.collapsed ? '0' : menu.sidebarWidth,
  transition: isResizing ? 'none' : 'width 0.3s ease-in-out',
}))
</script>

<style scoped>
.sidebar {
  min-height: 100vh;
  background-color: #f8f9fa;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-wrapper {
  overflow: hidden;
  position: relative;
}

.sidebar-wrapper.collapsed {
  width: 0;
}

.resizer {
  width: 2px;
  background-color: var(--bs-gray-300);
  cursor: ew-resize;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>