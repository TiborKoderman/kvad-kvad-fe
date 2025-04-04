import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import api from '@/api'

const useMenuStore = defineStore('menuStore', () => {
  const editMode = ref(false)
  const collapsed = ref(
    JSON.parse(localStorage.getItem('menuStore.collapsed') || 'false'),
  )
  const sidebarWidth = ref(
    localStorage.getItem('menuStore.sidebarWidth') || '250px',
  )
  const dashboards = ref([])
  const sidebarItems = ref([
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
  ])

  const toggleCollapsed = async () => {
    collapsed.value = !collapsed.value
    localStorage.setItem('menuStore.collapsed', JSON.stringify(collapsed.value))
  }

  const toggleEditMode = () => {
    editMode.value = !editMode.value
  }

  const saveSidebarWidth = () => {
    localStorage.setItem('menuStore.sidebarWidth', sidebarWidth.value)
  }

  const fetchSidebarItems = async () => {
    const response = await api.get('/Dashboard/all')
    sidebarItems.value.find(item => item.name === 'Dashboard').children =
      response.data.map(dashboard => ({
        name: dashboard.name,
        link: `/dashboard/${dashboard.name}`,
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
    saveSidebarWidth,
    dashboards,
    sidebarItems,
  }
})

export default useMenuStore
