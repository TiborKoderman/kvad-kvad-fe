import { defineStore } from 'pinia'
import { ref } from 'vue'

interface SidebarItem {
  name: string
  link: string
  icon?: string
  children?: SidebarItem[]
  isExpanded?: boolean
}

const useMenuStore = defineStore('menuStore', () => {
  const editMode = ref(false)
  const collapsed = ref(
    JSON.parse(localStorage.getItem('menuStore.collapsed') || 'false'),
  )
  const sidebarWidth = ref('400px') // Fixed width, no longer resizable
  const dashboards = ref([])
  const isAdmin = ref(true) // TODO: Replace with actual admin check
  const showManagementDropdown = ref(false)
  const showSettingsDropdown = ref(false)
  const sidebarItems = ref<SidebarItem[]>([
    // Empty by default - items will be added by the user
  ])

  const toggleCollapsed = async () => {
    collapsed.value = !collapsed.value
    localStorage.setItem('menuStore.collapsed', JSON.stringify(collapsed.value))
  }

  const toggleEditMode = () => {
    editMode.value = !editMode.value
  }

  const toggleManagementDropdown = () => {
    showManagementDropdown.value = !showManagementDropdown.value
    if (showManagementDropdown.value) {
      showSettingsDropdown.value = false
    }
  }

  const toggleSettingsDropdown = () => {
    showSettingsDropdown.value = !showSettingsDropdown.value
    if (showSettingsDropdown.value) {
      showManagementDropdown.value = false
    }
  }

  const closeAllDropdowns = () => {
    showManagementDropdown.value = false
    showSettingsDropdown.value = false
  }

  const saveSidebarItems = (items: SidebarItem[]) => {
    sidebarItems.value = items
    // Optionally persist to localStorage or backend
    localStorage.setItem('menuStore.sidebarItems', JSON.stringify(items))
  }

  return {
    editMode,
    toggleEditMode,
    collapsed,
    toggleCollapsed,
    sidebarWidth,
    saveSidebarItems,
    dashboards,
    sidebarItems,
    isAdmin,
    showManagementDropdown,
    showSettingsDropdown,
    toggleManagementDropdown,
    toggleSettingsDropdown,
    closeAllDropdowns,
  }
})

export default useMenuStore
