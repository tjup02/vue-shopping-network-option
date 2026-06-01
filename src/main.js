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
import { currency, date } from '@/methods/filters.js'
import pushMessageState from '@/methods/pushMessageState.js'

// vee-validate相關
import { defineRule, configure, Form, Field, ErrorMessage } from 'vee-validate'
import { all } from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'

// vee-validate 註冊所有rule
Object.entries(all).forEach(([name, rule]) => {
  defineRule(name, rule)
})

// vee-validate i18n
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true, // 當輸入任何內容直接進行驗證
})
// 設定預設語系
setLocale('zh_TW')

const app = createApp(App)
app.use(createPinia())
app.use(router)

// 設定全域屬性$filters，並將currency掛在他底下
// - 要在建立app後才可使用(寫在這行之後const app = createApp(App))
// - 命名加上$比較不會和區域變數產生衝突
// - 全域屬性下的方法可以不用在該頁引入，可直接使用
app.config.globalProperties.$filters = { currency, date }

// 用provide的方式在全域引用pushMessageState
app.provide('pushMessageState', pushMessageState)

// vue3-loading-overlay元件 進行全域註冊
app.component('LoadingOverlay', Loading)
// vee-validate
app.component('VForm', Form)
app.component('VField', Field)
app.component('ErrorMessage', ErrorMessage)

app.mount('#app')
