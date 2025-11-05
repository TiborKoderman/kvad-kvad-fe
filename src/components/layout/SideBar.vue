<template>
  <div
    class="sidebar-wrapper"
    :class="{ collapsed: menu.collapsed }"
    :style="sidebarStyle"
  >
    <nav class="sidebar p-0 m-0 d-flex flex-column">
      <SidebarBrand />
      <!-- Sidebar navigation items (Main pages from backend) -->
      <draggable
        v-model="mainPages"
        group="sidebar"
        item-key="name"
        class="nav nav-pills d-flex flex-column flex-grow-1"
        @end="saveSidebarOrder"
      >
        <template #item="{ element: page }">
          <li class="nav-item p-1">
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
                  :class="
                    page.isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'
                  "
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
        </template>
      </draggable>
      <!-- Add new entry button (only visible in edit mode) -->
      <div v-if="menu.editMode" class="nav-item p-1">
        <a
          href="#"
          class="nav-link d-flex align-items-center justify-content-center"
          @click.prevent="addNewEntry"
        >
          <i class="bi bi-plus-lg"></i>
        </a>
      </div>

      <!-- Bottom Button Bar with Dropdowns -->
      <div class="bottom-bar-wrapper">
        <!-- Management Dropdown -->
        <transition name="slide-up">
          <div v-if="menu.showManagementDropdown && !menu.collapsed" class="dropdown-menu-up">
            <nav class="nav flex-column">
              <RouterLink
                v-for="item in managementItems"
                :key="item.link"
                :to="item.link"
                class="nav-link"
                :class="{ active: isActiveRoute(item.link), 'bg-primary': isActiveRoute(item.link) }"
                @click="menu.closeAllDropdowns()"
              >
                <i :class="item.icon"></i>
                <span class="ms-2">{{ item.name }}</span>
              </RouterLink>
            </nav>
          </div>
        </transition>

        <!-- Settings Dropdown -->
        <transition name="slide-up">
          <div v-if="menu.showSettingsDropdown && !menu.collapsed" class="dropdown-menu-up">
            <nav class="nav flex-column">
              <RouterLink
                v-for="item in settingsItems"
                :key="item.link"
                :to="item.link"
                class="nav-link"
                :class="{ active: isActiveRoute(item.link), 'bg-primary': isActiveRoute(item.link) }"
                @click="menu.closeAllDropdowns()"
              >
                <i :class="item.icon"></i>
                <span class="ms-2">{{ item.name }}</span>
              </RouterLink>
            </nav>
          </div>
        </transition>

        <div class="bottom-bar">
          <button
            v-if="menu.isAdmin"
            class="bottom-button"
            :class="{ active: menu.showManagementDropdown }"
            @click="menu.toggleManagementDropdown()"
            title="Management"
          >
            <i class="bi bi-people"></i>
          </button>
          <button
            class="bottom-button"
            :class="{ active: menu.showSettingsDropdown }"
            @click="menu.toggleSettingsDropdown()"
            title="Settings"
          >
            <i class="bi bi-gear"></i>
          </button>
          <RouterLink
            to="/chat"
            class="bottom-button"
            :class="{ active: isActiveRoute('/chat') }"
            @click="menu.closeAllDropdowns()"
            title="Chat"
          >
            <i class="bi bi-chat-left"></i>
          </RouterLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SidebarBrand from './SidebarBrand.vue'
import useMenuStore from '@/stores/menu'
import draggable from 'vuedraggable'

const menu = useMenuStore()

// Close dropdowns when sidebar collapses
watch(() => menu.collapsed, (newValue) => {
  if (newValue) {
    menu.closeAllDropdowns()
  }
})

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

// Main pages from store (fetched from backend)
const mainPages = computed(() =>
  menu.sidebarItems.filter(item =>
    !['Management', 'Settings', 'Chat'].includes(item.name)
  )
)

// Hardcoded management items
const managementItems = ref<Page[]>([
  {
    name: 'Mqtt',
    link: '/mqtt',
    icon: 'bi bi-cloud',
  },
  {
    name: 'WebSockets',
    link: '/websockets',
    icon: 'bi bi-cloud',
  },
  {
    name: 'Docker',
    link: '/docker',
    icon: 'bi bi-box-seam',
  },
  {
    name: 'Orders',
    link: '/orders',
    icon: 'bi bi-cart',
  },
  {
    name: 'Nodes',
    link: '/nodes',
    icon: 'bi bi-server',
  },
])

// Hardcoded settings items
const settingsItems = ref<Page[]>([
  {
    name: 'General Settings',
    link: '/settings/general',
    icon: 'bi bi-sliders',
  },
  {
    name: 'User Settings',
    link: '/settings/users',
    icon: 'bi bi-person-gear',
  },
  {
    name: 'Dashboard Settings',
    link: '/settings/dashboardSettings',
    icon: 'bi bi-layout-text-window-reverse',
  },
  {
    name: 'System',
    link: '/system',
    icon: 'bi bi-cpu',
  },
  {
    name: 'Admin Settings',
    link: '/adminSettings',
    icon: 'bi bi-wrench',
  },
])

function expandItem(page: Page) {
  if (page.children) {
    page.isExpanded = !page.isExpanded
  }
}

const isActiveRoute = (link: unknown) => {
  return route.path === link
}

function saveSidebarOrder() {
  // Save the new order to the store
  menu.saveSidebarItems(menu.sidebarItems)
}

function addNewEntry() {
  const newEntry: Page = {
    name: 'New Entry',
    link: '/new-entry',
    icon: 'bi bi-file-earmark',
  }
  mainPages.value.push(newEntry)
  saveSidebarOrder()
}

// Computed property for sidebar style (fixed width, no resizing)
const sidebarStyle = computed(() => ({
  width: menu.collapsed ? '0' : menu.sidebarWidth,
  transition: 'width 0.3s ease-in-out',
}))
</script>

<style scoped>
.sidebar {
  min-height: 100vh;
  background-color: #f8f9fa;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sidebar-wrapper {
  overflow: hidden;
  position: relative;
}

.sidebar-wrapper.collapsed {
  width: 0;
}

/* Bottom Button Bar Wrapper */
.bottom-bar-wrapper {
  position: relative;
}

/* Bottom Button Bar */
.bottom-bar {
  display: flex;
  border-top: 1px solid var(--bs-gray-300);
  background-color: #fff;
  padding: 0.5rem;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
}

.bottom-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  color: var(--bs-gray-600);
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.bottom-button i {
  font-size: 1.5rem;
}

.bottom-button:hover {
  background-color: var(--bs-gray-200);
  color: var(--bs-gray-800);
}

.bottom-button.active {
  background-color: var(--bs-primary);
  color: white;
}

/* Upward Dropdown Menu */
.dropdown-menu-up {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid var(--bs-gray-300);
  border-bottom: none;
  border-radius: 0.375rem 0.375rem 0 0;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-menu-up .nav {
  padding: 0.25rem;
}

.dropdown-menu-up .nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  color: var(--bs-gray-700);
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-menu-up .nav-link:hover {
  background-color: var(--bs-gray-200);
}

.dropdown-menu-up .nav-link.active {
  background-color: var(--bs-primary);
  color: white;
}

/* Slide up animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-enter-to,
.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
