import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

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
  const sidebarWidth = ref('250px') // Fixed width, no longer resizable
  const dashboards = ref([])
  const isAdmin = ref(true) // TODO: Replace with actual admin check
  const showManagementDropdown = ref(false)
  const showSettingsDropdown = ref(false)
  const sidebarItems = ref<SidebarItem[]>([
    {
      name: 'Dashboard',
      link: '/dashboard',
      icon: 'bi bi-speedometer2',
    },
    {
      name: 'Chat',
      link: '/chat',
      icon: 'bi bi-chat-left',
    },
    {
      name: 'Devices',
      link: '/devices',
      icon: 'bi bi-laptop',
    },
    {
      name: 'Scada',
      link: '/scada',
      icon: 'bi bi-diagram-3',
    },
    {
      name: 'Management',
      link: '/management',
      icon: 'bi bi-people',
      children: [
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
      ],
    },
    {
      name: 'Settings',
      link: '/settings',
      icon: 'bi bi-gear',
      children: [
        {
          name: 'General Settings',
          link: '/settings/general',
        },
        {
          name: 'User Settings',
          link: '/settings/users',
        },
        {
          name: 'Dashboard Settings',
          link: '/settings/dashboardSettings',
        },
        {
          name: 'System',
          link: '/system',
          icon: 'bi bi-cpu',
        },
      ],
    },
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

  const fetchSidebarItems = async () => {
    const response = await api.get('/Dashboard/all')
    sidebarItems.value.find(item => item.name === 'Dashboard').children =
      response.data.map(dashboard => ({
        name: dashboard.name,
        link: `/dashboard/${dashboard.id}`,
        icon: 'bi bi-speedometer2',
      }))
  }

  fetchSidebarItems()

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
