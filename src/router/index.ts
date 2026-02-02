import { createRouter, createWebHistory } from 'vue-router'
import { authManager } from '@/utils/auth-manager'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard-home',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/dashboard/:id',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        layout: 'auth',
        dontRequireAuth: true,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/docker',
      name: 'docker',
      component: () => import('../views/DockerView.vue'),
    },
    {
      path: '/nodes',
      name: 'nodes',
      component: () => import('../views/NodesView.vue'),
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('../views/ChatView.vue'),
    },
    {
      path: '/chat/:room',
      name: 'chat_room',
      component: () => import('../views/ChatView.vue'),
    },
    {
      path: '/mqtt',
      name: 'mqtt',
      component: () => import('../views/MqttView.vue'),
    },
    {
      path: '/devices',
      name: 'devices',
      component: () => import('../views/DevicesView.vue'),
    },
    {
      path: '/device/:id',
      name: 'device',
      component: () => import('../views/DeviceView.vue'),
    },
    {
      path: '/explore_devices',
      name: 'explore_devices',
      component: () => import('../views/ExploreDevicesView.vue'),
    },
    {
      path: '/websockets',
      name: 'websockets',
      component: () => import('../views/WebSocketsView.vue'),
    },
    {
      path: '/system',
      name: 'system',
      component: () => import('../views/SystemInfoView.vue'),
      meta: {
        role: ['admin'],
      },
    },
    {
      path: '/settings/users',
      name: 'user_settings',
      component: () => import('../views/Settings/UserSettingsView.vue'),
      meta: {
        role: ['admin'],
      },
    },
    {
      path: '/settings/profileSettings',
      name: 'profile_settings',
      component: () => import('../views/Settings/ProfileSettingsView.vue'),
    },
    {
      path: '/settings/dashboardSettings',
      name: 'dashboard_settings',
      component: () => import('../views/Settings/DashboardSettingsView.vue'),
    },
    {
      path: '/scada',
      name: 'scada',
      component: () => import('../views/ScadaView.vue'),
      meta: {
        role: ['admin'],
      },
    },
    {
      path: '/components',
      name: 'components',
      component: () => import('../views/ComponentsView.vue'),
    },
    {
      path: '/dev/table',
      name: 'table',
      component: () => import('../views/Dev/TableView.vue'),
    }
  ],
})

router.beforeEach((to, from, next) => {
  let loggedIn = !!localStorage.getItem('token')

  // Check if the token has expired
  const token = authManager.getToken()
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp
    const now = Date.now() / 1000
    if (now > exp) {
      localStorage.removeItem('token')
      loggedIn = false
    }
  }

  if (!loggedIn && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router
