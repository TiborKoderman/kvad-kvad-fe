import { createApp, ObjectDirective } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import DataTables components (fully initialized)
import { DataTable, DateTime } from './utils/datatables'

import { IMaskDirective } from 'vue-imask'
import { vTooltip } from './directives/tooltip'

import {ws} from './ws'

// import api from '@/api' // Commented out as it's not used here


import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/scss/app.scss'
import Swal from 'sweetalert2'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('DataTable', DataTable)
app.component('DateTime', DateTime)
// eslint-disable-next-line vue/multi-word-component-names
app.component('Swal', Swal);

app.directive('imask', IMaskDirective as ObjectDirective)
app.directive('tooltip', vTooltip)

// app.component('api', api)
app.mount('#app')
