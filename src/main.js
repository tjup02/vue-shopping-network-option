import './assets/main.css'
// vue3-loading-overlay 在npm的範例上，路徑有誤，要改成以下
import Loading from 'vue3-loading-overlay'
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import axios from 'axios'
import App from './App.vue'
import router from './router'
// 引入currency函式
import { currency } from '@/methods/filters.js'
const app = createApp(App)
app.use(createPinia())
app.use(router)

// 設定全域屬性$filters，並將currency掛在他底下
// - 要在建立app後才可使用(寫在這行之後const app = createApp(App))
// - 命名加上$比較不會和區域變數產生衝突
// - 全域屬性下的方法可以不用在該頁引入，可直接使用
app.config.globalProperties.$filters = { currency }

// vue3-loading-overlay元件 進行全域註冊
app.component('LoadingOverlay', Loading)
app.mount('#app')
