import './assets/main.css'
// vue3-loading-overlay 在npm的範例上，路徑有誤，要改成以下
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import axios from 'axios'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// vue3-loading-overlay元件 進行全域註冊
app.component('LoadingOverlay', Loading)
app.mount('#app')
