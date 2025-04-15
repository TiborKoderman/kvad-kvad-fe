import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import * as bootstrap from 'bootstrap'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import DateTime from 'datatables.net-datetime';
import 'datatables.net-fixedheader-bs5';
import 'datatables.net-keytable-bs5';
import 'datatables.net-responsive-bs5';
import 'datatables.net-rowgroup-bs5';
import 'datatables.net-rowreorder-bs5';
import 'datatables.net-scroller-bs5';
import 'datatables.net-searchbuilder-bs5';
import 'datatables.net-searchpanes-bs5';
import 'datatables.net-select-bs5';
import 'datatables.net-staterestore-bs5';


DataTablesCore.use(bootstrap);
DataTable.use(DataTablesCore);

import api from '@/api'


import 'sweetalert2/src/sweetalert2.scss'
import './assets/scss/app.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'vue-select/dist/vue-select.css';
import Swal from 'sweetalert2'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('DataTable', DataTable)
app.component('DateTime', DateTime)
// eslint-disable-next-line vue/multi-word-component-names
app.component('Swal', Swal);

// app.component('api', api)
app.mount('#app')
