import { createApp, inject } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/app.scss'

DataTable.use(DataTablesCore)


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(DataTable)

app.mount('#app')
