import { createRouter, createWebHistory } from 'vue-router'
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
      path: '/mqtt',
      name: 'mqtt',
      component: () => import('../views/MqttView.vue'),
    },
    {
      path: '/system',
      name: 'system',
      component: () => import('../views/SystemInfoView.vue'),
    },
    {
      path: '/settings/users',
      name: 'user_settings',
      component: () => import('../views/Settings/UserSettingsView.vue'),
    },
    {
      path: '/settings/profileSettings',
      name: 'profile_settings',
      component: () => import('../views/Settings/ProfileSettingsView.vue'),
    }
  ],
})

router.beforeEach((to, from, next) => {
  let loggedIn = !!localStorage.getItem('token')

  // Check if the token has expired
  const token = localStorage.getItem('token')
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
