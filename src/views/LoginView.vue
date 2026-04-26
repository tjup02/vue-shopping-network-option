<template>
  <div class="container mt-5">
    <form class="row justify-content-center" @submit.prevent="signIn">
      <div class="col-md-6">
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <div class="mb-2">
          <label for="inputEmail" class="sr-only">Email address</label>
          <input
            type="email"
            id="inputEmail"
            class="form-control"
            placeholder="Email address"
            required
            autofocus
            v-model="user.username"
          />
        </div>
        <div class="mb-2">
          <label for="inputPassword" class="sr-only">Password</label>
          <input
            type="password"
            id="inputPassword"
            class="form-control"
            placeholder="Password"
            required
            v-model="user.password"
          />
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    async signIn() {
      const api = `${import.meta.env.VITE_API}admin/signin`
      // console.log(api)
      try {
        const res = await axios.post(api, this.user)
        // console.log(res)

        // 從res.data物件取出token和expired屬性的值
        //    (語法糖寫法，等同於)
        // 。 const token = res.data.token
        // 。 const expired = res.data.expired(expired是 API 回傳的「token 過期時間欄位名稱」)
        const { token, expired } = res.data
        console.log(token, expired)

        // 關於HttpOnly cookie:
        // 現代登入系統多使用 HttpOnly cookie，是因為 token 存在 cookie 並設為 HttpOnly 後，JavaScript 無法讀取，可以有效降低 XSS 攻擊竊取 token 的風險，同時瀏覽器會自動在 request 中帶上 cookie，減少前端管理 token 的複雜度。
        // 相較之下 localStorage 雖然方便，但因為可以被 JavaScript 存取，一旦發生 XSS，token 容易被竊取，因此較不建議用於存放身份驗證資訊。

        // =============================================
        // 常用 cookie 屬性
        // =============================================

        // key=value
        //   cookie 的名稱與值

        // Expires=時間
        //   設定 cookie 過期時間（絕對時間）
        //   例：Expires=Tue, 26 Apr 2026 12:00:00 GMT

        // Max-Age=秒
        //   設定 cookie 存活秒數（相對時間）

        // Path=/
        //   控制 cookie 在哪些路徑會被帶上
        //   Path=/      → 全站可用
        //   Path=/admin → 只有 admin 路徑可用

        // Domain=example.com
        //   控制哪些子網域可以使用 cookie

        // Secure
        //   只允許 HTTPS 傳輸

        // SameSite
        //   控制 cookie 在跨站 request 時是否送出
        //   Strict → 最嚴格
        //   Lax    → 預設
        //   None   → 允許跨站（必須搭配 Secure，前端也要設定withCredentials: true）
        // =============================================================================
        //       ※ 真實專案通常由 server(後端) 使用 Set-Cookie 設定 cookie(安全性較高)，
        //          前端較少直接用 document.cookie 儲存登入 token。
        //          這裡是課程用來介紹document.cookie的功用
        document.cookie = `hexToken=${token};Expires=${new Date(expired)}`
      } catch (error) {
        console.log(error.response)
      }
    },
  },
}
</script>
