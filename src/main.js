import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '@/router'
import '@/styles/main.scss'
import { vue3Debounce } from 'vue-debounce'


const app = createApp(App)
app
.use(createPinia())
.directive('debounce', vue3Debounce({ lock: true }))
.use(router)
.mount('#app');

