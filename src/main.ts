import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'bootstrap-icons/font/bootstrap-icons.css'



import './assets/scss/app.scss'

import 'datatables.net' 
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'

DataTable.use(DataTablesCore)



const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('DataTable', DataTable)

app.mount('#app')
