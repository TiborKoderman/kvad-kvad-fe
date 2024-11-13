import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/app.scss'

DataTable.use(DataTablesCore)

const app = createApp(App)

const vClickOutside = {
    mounted(el, binding) {
      el.clickOutsideEvent = (event) => {
        if (!(el === event.target || el.contains(event.target))) {
          binding.value(event); // Call the method provided to v-click-outside
        }
      };
      document.addEventListener('click', el.clickOutsideEvent);
    },
    unmounted(el) {
      document.removeEventListener('click', el.clickOutsideEvent);
    },
  };

app.directive('click-outside', vClickOutside);

app.use(createPinia())
app.use(router)
app.use(DataTable)

app.mount('#app')
