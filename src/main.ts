import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/app.scss';

import api from './utils/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(api)

app.mount('#app')
