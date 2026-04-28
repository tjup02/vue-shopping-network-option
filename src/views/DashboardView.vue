<template>
  <RouterView />
</template>

<script>
import axios from 'axios'
export default {
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
