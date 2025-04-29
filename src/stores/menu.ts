import { defineStore } from 'pinia'
import { ref } from 'vue'
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

  const saveSidebarWidth = () => {
    localStorage.setItem('menuStore.sidebarWidth', sidebarWidth.value)
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
    saveSidebarWidth,
    dashboards,
    sidebarItems,
  }
})

export default useMenuStore
