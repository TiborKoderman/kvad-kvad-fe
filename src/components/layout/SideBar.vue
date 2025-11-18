<template>
  <div
    class="sidebar-wrapper"
    :class="{ collapsed: menu.collapsed }"
    :style="sidebarStyle"
  >
    <nav class="sidebar p-0 m-0 d-flex flex-column">
      <SidebarBrand />
      <!-- Sidebar navigation items (Main pages from backend) -->
      <div class="d-flex flex-column flex-grow-1 sidebar-scroll-container">
        <ul class="nav nav-pills d-flex flex-column">
          <li
            v-for="(page, index) in mainPages"
            :key="page.name"
            class="nav-item p-1 sidebar-item-parent"
            :draggable="menu.editMode"
            @dragstart="handleDragStart($event, page, index)"
            @dragover="handleDragOver($event, page, $event)"
            @dragleave="handleDragLeave"
            @drop="handleDrop($event, page, index)"
            @dragend="handleDragEnd"
            @mouseenter="handleItemHover(page, $event)"
            @mouseleave="handleItemLeave"
            :class="{
              'drag-over-top': dragPosition === 'top' && dragOverItem === page,
              'drag-over-bottom':
                dragPosition === 'bottom' && dragOverItem === page,
              'drag-over-inside':
                dragPosition === 'inside' && dragOverItem === page,
              dragging: draggedItem === page,
            }"
          >
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
              <i
                v-if="menu.editMode"
                class="bi bi-grip-vertical me-2 drag-handle"
              ></i>
              <i :class="page.icon"></i>
              <span class="ms-2">{{ page.name }}</span>
              <button
                v-if="menu.editMode"
                class="btn btn-sm btn-link add-child-btn ms-auto"
                @click.prevent="addChildEntry(page)"
                title="Add child item"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
              <transition name="rotate">
                <i
                  v-if="page.children && !menu.editMode"
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
                class="nav flex-column children-list"
              >
                <li
                  class="nav-item p-1 sidebar-item-child"
                  v-for="(child, childIndex) in page.children"
                  :key="childIndex"
                  :draggable="menu.editMode"
                  @dragstart="handleDragStart($event, child, childIndex, page)"
                  @dragover="handleDragOver($event, child, $event)"
                  @dragleave="handleDragLeave"
                  @drop="handleDrop($event, child, childIndex, page)"
                  @dragend="handleDragEnd"
                  @mouseenter="handleItemHover(child, $event)"
                  @mouseleave="handleItemLeave"
                  :class="{
                    'drag-over-top':
                      dragPosition === 'top' && dragOverItem === child,
                    'drag-over-bottom':
                      dragPosition === 'bottom' && dragOverItem === child,
                    dragging: draggedItem === child,
                  }"
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
                    <i
                      v-if="menu.editMode"
                      class="bi bi-grip-vertical me-2 drag-handle"
                    ></i>
                    <i :class="child.icon"></i>
                    <span class="ms-2">{{ child.name }}</span>
                  </RouterLink>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
        <!-- Add new entry button (only visible in edit mode) -->
        <div v-if="menu.editMode" class="nav-item">
          <a
            href="#"
            class="btn btn-outline-primary m-2 d-flex align-items-center justify-content-center"
            @click.prevent="addNewEntry"
          >
            <i class="bi bi-plus-lg"></i>
          </a>
        </div>
      </div>

      <!-- Preview Panel -->
      <transition name="slide-left">
        <div
          v-if="
            hoveredItem &&
            hoveredItem.children &&
            hoveredItem.children.length > 0 &&
            !menu.collapsed
          "
          class="sidebar-preview-panel"
          :style="{ top: previewTop + 'px' }"
          @mouseenter="keepPreviewOpen = true"
          @mouseleave="handlePreviewLeave"
        >
          <div class="preview-header">
            <i :class="hoveredItem.icon"></i>
            <h5 class="mb-0 ms-2">{{ hoveredItem.name }}</h5>
          </div>
          <div class="preview-body">
            <p class="text-muted mb-2">
              <i class="bi bi-link-45deg"></i> {{ hoveredItem.link }}
            </p>
            <div>
              <small class="text-muted"
                >Children ({{ hoveredItem.children.length }}):</small
              >
              <ul class="list-unstyled ms-3">
                <li v-for="child in hoveredItem.children" :key="child.name">
                  <i :class="child.icon"></i> {{ child.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>

      <!-- Bottom Button Bar with Dropdowns -->
      <div class="bottom-bar-wrapper">
        <!-- Management Dropdown -->
        <transition name="slide-up">
          <div
            v-if="menu.showManagementDropdown && !menu.collapsed"
            class="dropdown-menu-up"
          >
            <nav class="nav flex-column">
              <RouterLink
                v-for="item in managementItems"
                :key="item.link"
                :to="item.link"
                class="nav-link"
                :class="{
                  active: isActiveRoute(item.link),
                  'bg-primary': isActiveRoute(item.link),
                }"
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
          <div
            v-if="menu.showSettingsDropdown && !menu.collapsed"
            class="dropdown-menu-up"
          >
            <nav class="nav flex-column">
              <RouterLink
                v-for="item in settingsItems"
                :key="item.link"
                :to="item.link"
                class="nav-link"
                :class="{
                  active: isActiveRoute(item.link),
                  'bg-primary': isActiveRoute(item.link),
                }"
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
          <!-- <RouterLink
            to="/chat"
            class="bottom-button"
            :class="{ active: isActiveRoute('/chat') }"
            @click="menu.closeAllDropdowns()"
            title="Chat"
          >
            <i class="bi bi-chat-left"></i>
          </RouterLink> -->
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
import { Modal } from '@/components/utils/modal'
import CreateDashboardModal from '@/components/modals/CreateDashboardModal.vue'

const menu = useMenuStore()

// Close dropdowns when sidebar collapses
watch(
  () => menu.collapsed,
  newValue => {
    if (newValue) {
      menu.closeAllDropdowns()
    }
  },
)

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

// Drag and drop state
const draggedItem = ref<Page | null>(null)
const draggedParent = ref<Page | null>(null)
const dragOverItem = ref<Page | null>(null)
const dragOverTimeout = ref<number | null>(null)
const dragPosition = ref<'top' | 'bottom' | 'inside' | null>(null)

// Hover preview state
const hoveredItem = ref<Page | null>(null)
const hoverTimeout = ref<number | null>(null)
const keepPreviewOpen = ref(false)
const previewTop = ref(0)

// Main pages from store (fetched from backend) with getter/setter
const mainPages = computed({
  get: () =>
    menu.sidebarItems.filter(
      item => !['Management', 'Settings', 'Chat'].includes(item.name),
    ),
  set: value => {
    // When draggable updates the order, update the store
    const otherItems = menu.sidebarItems.filter(item =>
      ['Management', 'Settings', 'Chat'].includes(item.name),
    )
    menu.sidebarItems = [...value, ...otherItems]
  },
})

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

// Drag and drop handlers
function handleDragStart(
  event: DragEvent,
  item: Page,
  _index: number,
  parent?: Page,
) {
  draggedItem.value = item
  draggedParent.value = parent || null

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', '')
  }
}

function handleDragOver(event: DragEvent, item: Page, dragEvent: DragEvent) {
  event.preventDefault()
  if (!draggedItem.value || draggedItem.value === item) return

  dragOverItem.value = item

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }

  // Calculate position based on mouse Y coordinate
  const rect = (dragEvent.currentTarget as HTMLElement).getBoundingClientRect()
  const relativeY = dragEvent.clientY - rect.top
  const height = rect.height
  const threshold = height * 0.25 // 25% threshold for top/bottom zones

  if (relativeY < threshold) {
    dragPosition.value = 'top'
  } else if (relativeY > height - threshold) {
    dragPosition.value = 'bottom'
  } else {
    // Only allow inside drop for parent items
    const isParentItem = !draggedParent.value
    dragPosition.value = isParentItem ? 'inside' : 'bottom'
  }

  // Auto-expand after hovering for 800ms
  if (dragOverTimeout.value) {
    clearTimeout(dragOverTimeout.value)
  }

  if (item.children && !item.isExpanded && dragPosition.value === 'inside') {
    dragOverTimeout.value = window.setTimeout(() => {
      item.isExpanded = true
    }, 800)
  }
}

function handleDragLeave() {
  dragOverItem.value = null
  dragPosition.value = null
  if (dragOverTimeout.value) {
    clearTimeout(dragOverTimeout.value)
    dragOverTimeout.value = null
  }
}

function handleDrop(
  event: DragEvent,
  targetItem: Page,
  targetIndex: number,
  targetParent?: Page,
) {
  event.preventDefault()
  event.stopPropagation()

  if (!draggedItem.value || draggedItem.value === targetItem) return

  const sourceArray = draggedParent.value?.children || menu.sidebarItems
  const targetArray = targetParent?.children || menu.sidebarItems

  // Remove from source
  const sourceIndex = sourceArray.findIndex(p => p === draggedItem.value)
  if (sourceIndex > -1) {
    sourceArray.splice(sourceIndex, 1)
  }

  // Handle different drop positions
  if (dragPosition.value === 'inside' && !targetParent) {
    // Drop inside a parent item
    if (!targetItem.children) {
      targetItem.children = []
    }
    targetItem.children.push(draggedItem.value!)
    targetItem.isExpanded = true
  } else {
    // Drop above or below (reorder)
    let insertIndex = targetArray.findIndex(p => p === targetItem)

    if (insertIndex > -1) {
      // If dropping on bottom, insert after
      if (dragPosition.value === 'bottom') {
        insertIndex++
      }
      targetArray.splice(insertIndex, 0, draggedItem.value!)
    }
  }

  saveSidebarOrder()
  handleDragEnd()
}

function handleDragEnd() {
  draggedItem.value = null
  draggedParent.value = null
  dragOverItem.value = null
  dragPosition.value = null
  if (dragOverTimeout.value) {
    clearTimeout(dragOverTimeout.value)
    dragOverTimeout.value = null
  }
}

// Hover preview handlers
function handleItemHover(item: Page, event?: MouseEvent) {
  // Only show preview for items with children
  if (!item.children || item.children.length === 0) {
    return
  }

  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value)
  }

  hoverTimeout.value = window.setTimeout(() => {
    hoveredItem.value = item

    // Calculate the preview position based on the hovered element
    if (event && event.currentTarget) {
      const target = event.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      previewTop.value = rect.top
    }
  }, 500)
}

function handleItemLeave() {
  if (hoverTimeout.value) {
    clearTimeout(hoverTimeout.value)
    hoverTimeout.value = null
  }

  if (!keepPreviewOpen.value) {
    hoveredItem.value = null
  }
}

function handlePreviewLeave() {
  keepPreviewOpen.value = false
  hoveredItem.value = null
}

async function addNewEntry() {
  try {
    const entry = await Modal.open<Page>(CreateDashboardModal, {
      title: 'Create New Dashboard',
      fullscreen: false,
    })

    if (entry) {
      // Add to the store's sidebarItems array directly
      menu.sidebarItems.push(entry)
      saveSidebarOrder()
    }
  } catch (error) {
    console.error('Error creating dashboard:', error)
  }
}

async function addChildEntry(parent: Page) {
  try {
    const entry = await Modal.open<Page>(CreateDashboardModal, {
      title: `Add Child to ${parent.name}`,
      fullscreen: false,
    })

    if (entry) {
      // Add as child to parent
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(entry)
      parent.isExpanded = true
      saveSidebarOrder()
    }
  } catch (error) {
    console.error('Error creating child dashboard:', error)
  }
}

// Computed property for sidebar style (fixed width, no resizing)
const sidebarStyle = computed(() => ({
  width: menu.collapsed ? '0' : menu.sidebarWidth,
  transition: 'width 0.3s ease-in-out',
  '--sidebar-width': menu.sidebarWidth,
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

.sidebar-scroll-container {
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  padding-bottom: 1rem;
}

.sidebar-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll-container::-webkit-scrollbar-thumb {
  background: var(--bs-gray-400);
  border-radius: 3px;
}

.sidebar-scroll-container::-webkit-scrollbar-thumb:hover {
  background: var(--bs-gray-500);
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
  box-shadow:
    0 -4px 6px -1px rgba(0, 0, 0, 0.1),
    0 -2px 4px -1px rgba(0, 0, 0, 0.06);
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

/* Drag and drop styles */
.nav-item[draggable='true'] {
  cursor: move;
}

.nav-item.dragging {
  opacity: 0.4;
}

.nav-item.drag-over-top {
  border-top: 3px solid var(--bs-primary);
  border-radius: 0.375rem 0.375rem 0 0;
}

.nav-item.drag-over-bottom {
  border-bottom: 3px solid var(--bs-primary);
  border-radius: 0 0 0.375rem 0.375rem;
}

.nav-item.drag-over-inside {
  background-color: var(--bs-primary-bg-subtle);
  border: 2px dashed var(--bs-primary);
  border-radius: 0.375rem;
}

.drag-handle {
  color: var(--bs-gray-500);
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

/* Child items styling */
.children-list {
  background-color: rgba(0, 0, 0, 0.02);
  border-left: 3px solid var(--bs-gray-300);
  margin-left: 1rem;
  padding-left: 0.5rem;
}

.sidebar-item-child .nav-link {
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
}

.sidebar-item-parent > .nav-link {
  font-weight: 500;
}

/* Add child button */
.add-child-btn {
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem 0.5rem;
  color: var(--bs-gray-600);
}

.nav-item:hover .add-child-btn {
  opacity: 1;
}

.add-child-btn:hover {
  color: var(--bs-primary);
}

/* Preview Panel */
.sidebar-preview-panel {
  position: fixed;
  left: calc(var(--sidebar-width, 400px) + 10px);
  transform: translateY(-50%);
  width: 300px;
  background: white;
  border: 1px solid var(--bs-gray-300);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1050;
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
}

.preview-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: var(--bs-gray-100);
  border-bottom: 1px solid var(--bs-gray-300);
}

.preview-header h5 {
  font-size: 1rem;
  font-weight: 600;
}

.preview-body {
  padding: 1rem;
}

.preview-body ul {
  margin-top: 0.5rem;
}

.preview-body li {
  padding: 0.25rem 0;
  font-size: 0.875rem;
}

/* Preview animation */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-20px) translateY(-50%);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px) translateY(-50%);
}
</style>
