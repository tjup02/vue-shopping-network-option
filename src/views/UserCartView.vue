<template>
  <LoadingOverlay :active="isLoading"></LoadingOverlay>
  <div class="container">
    <div class="row mt-4">
      <div class="col-md-7">
        <table class="table align-middle">
          <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item.id">
              <td style="width: 200px">
                <div
                  style="height: 100px; background-size: cover; background-position: center"
                  :style="{ backgroundImage: `url(${item.imageUrl})` }"
                ></div>
              </td>
              <td>
                <a href="#" class="text-dark">{{ item.title }}</a>
              </td>
              <td>
                <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="getProductId(item.id)"
                  >
                    查看更多
                  </button>
                  <button type="button" class="btn btn-outline-danger">加到購物車</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 購物車列表 -->
    </div>
  </div>

  <PaginationView :pages="pagination" @emit-pages="getProducts"></PaginationView>
</template>

<script>
import axios from 'axios'
import PaginationView from '@/components/PaginationView.vue'

export default {
  data() {
    return {
      products: [], //產品總表
      pagination: {},
      //   tempProduct: {}, //用來存取目前選取的資料
      isNew: false, //用來判斷是編輯(false)還是新增(true)
      isLoading: false,
    }
  },
  //   emits: ['update-product'],
  components: { PaginationView },
  created() {
    this.getProducts()
  },
  methods: {
    // 抓取產品總資料
    // 。預設參數page在第一頁
    async getProducts(page = 1) {
      // 接api取商品總資料去渲染畫面
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/products/?page=${page}`
      this.isLoading = true
      try {
        const res = await axios.get(api)
        if (res.data.success) {
          this.products = res.data.products
          this.pagination = res.data.pagination
          //   console.log(res.data.pagination)
        }
      } catch (error) {
        console.log(error.response)
      } finally {
        this.isLoading = false
      }
    },

    async getProductId(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/product/${id}`
      this.isLoading = true
      try {
        const res = await axios.get(api)
        if (res.data.success) {
          //   this.tempProduct = res.data.product
          //   console.log(this.tempProduct)
          this.$router.push(`/productInfo/${id}`)
        }
      } catch (error) {
        console.log(error.response)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
