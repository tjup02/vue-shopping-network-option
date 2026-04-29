<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Navbar w/ text</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarText">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'products' }">product</RouterLink>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click="logout">登出</a>
          </li>
        </ul>
        <span class="navbar-text"> Navbar text with an inline element </span>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios'
export default {
  methods: {
    async logout() {
      const api = `${import.meta.env.VITE_API}logout`
      try {
        const res = await axios.post(api)

        // 若驗證未通過，導回 login
        if (!res.data.success) {
          this.$router.push({ name: 'login' })
        }
      } catch (error) {
        console.log(error.response)
        alert('登出失敗')
        // API 錯誤也視為未登入
      }
    },
  },
}
</script>
