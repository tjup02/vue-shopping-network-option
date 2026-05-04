<template>
  <div class="container-fluid mt-3 position-relative">
    <ToastMessage></ToastMessage>
    <RouterView />
  </div>
</template>

<script>
import axios from 'axios'
//  引入全域唯一的 mitt emitter（事件中心）
import emitter from '@/methods/emitter.js'
import ToastMessage from '@/components/ToastMessage.vue'
export default {
  components: { ToastMessage },
  // 透過 provide 將 emitter 注入到子孫元件
  // 讓深層元件可以用 inject 取得 emitter 進行事件溝通（避免層層 props 傳遞）
  provide() {
    return { emitter }
  },
  created() {
    // 取token (loginView.vue有設定自命名hexToken)
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, '$1')

    // 將token放入Authorization，讓之後所有 axios request 都自動帶 token(用axios方法)
    axios.defaults.headers.common['Authorization'] = token
    // 執行 檢查是否登入的api
    this.checkSignIn()
  },

  methods: {
    // 檢查是否登入的api
    async checkSignIn() {
      const api = `${import.meta.env.VITE_API}api/user/check`
      try {
        const res = await axios.post(api)

        // 若驗證未通過，導回 login
        if (!res.data.success) {
          this.$router.push({ name: 'login' })
        }
      } catch (error) {
        console.log(error.response)
        // API 錯誤也視為未登入
        this.$router.push({ name: 'login' })
      }
    },
  },
}
</script>
