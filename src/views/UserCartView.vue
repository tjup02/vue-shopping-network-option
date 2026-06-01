<template>
  <LoadingOverlay :active="isLoading"></LoadingOverlay>
  <div class="container">
    <div class="row mt-4">
      <!-- 產品總表 -->
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
                  <button
                    type="button"
                    :disabled="status.loadingItem === item.id"
                    class="btn btn-outline-danger"
                    @click="addCart(item.id)"
                  >
                    <div
                      v-if="status.loadingItem === item.id"
                      class="spinner-grow spinner-grow-sm text-danger"
                      role="status"
                    >
                      <span class="sr-only"></span>
                    </div>
                    加到購物車
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 購物車列表 -->
      <div class="col-md-5">
        <div class="sticky-top">
          <table class="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style="width: 110px">數量</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="cart.carts">
                <tr v-for="item in cart.carts" :key="item.id">
                  <td>
                    <button
                      type="button"
                      class="btn btn-outline-danger btn-sm"
                      :disabled="status.loadingItem === item.id"
                      @click="removeCartItem(item.id)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                  <td>
                    {{ item.product.title }}
                    <div class="text-success" v-if="item.coupon">已套用優惠券</div>
                  </td>
                  <td>
                    <div class="input-group input-group-sm">
                      <!-- 數量輸入框 -->
                      <input
                        @change="updateCart(item.id, item.qty)"
                        :disabled="status.loadingItem === item.id"
                        type="number"
                        min="0"
                        class="form-control"
                        v-model.number="item.qty"
                      />
                      <div class="input-group-text">/ {{ item.product.unit }}</div>
                    </div>
                  </td>
                  <td class="text-end">
                    <small v-if="cart.final_total !== cart.total" class="text-success"
                      >折扣價：</small
                    >
                    {{ $filters.currency(item.final_total) }}
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-end">總計</td>
                <td class="text-end">{{ $filters.currency(cart.total) }}</td>
              </tr>
              <tr v-if="cart.final_total !== cart.total">
                <td colspan="3" class="text-end text-success">折扣價</td>
                <td class="text-end text-success">{{ $filters.currency(cart.final_total) }}</td>
              </tr>
            </tfoot>
          </table>
          <div class="input-group mb-3 input-group-sm">
            <input
              type="text"
              class="form-control"
              v-model="coupon_code"
              placeholder="請輸入優惠碼"
            />
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                套用優惠碼
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 建立訂單 -->
      <div class="my-5 row justify-content-center">
        <form class="col-md-6">
          <table class="table align-middle">
            <thead>
              <th>品名</th>
              <th>數量</th>
              <th>單價</th>
            </thead>
            <tbody>
              <tr>
                <td>產品</td>
                <td>1 / 個</td>
                <td class="text-end">100</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" class="text-end">總計</td>
                <td class="text-end">100</td>
              </tr>
            </tfoot>
          </table>

          <table class="table">
            <tbody>
              <tr>
                <th width="100">Email</th>
                <td>abc@gmail.com</td>
              </tr>
              <tr>
                <th>姓名</th>
                <td>AA</td>
              </tr>
              <tr>
                <th>收件人電話</th>
                <td>0987654321</td>
              </tr>
              <tr>
                <th>收件人地址</th>
                <td>Address</td>
              </tr>
              <tr>
                <th>付款狀態</th>
                <td>
                  <span>尚未付款</span>
                  <span class="text-success">付款完成</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-end">
            <button class="btn btn-danger">確認付款去</button>
          </div>
        </form>
      </div>
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
      isNew: false, //用來判斷是編輯(false)還是新增(true)
      isLoading: false,
      cart: {},
      coupon_code: '',
      status: {
        loadingItem: '', //對應品項id
      },
    }
  },
  //   emits: ['update-product'],
  inject: ['emitter', 'pushMessageState'],
  components: { PaginationView },
  created() {
    this.getProducts()
    this.getCart()
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

    async getCart() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/cart`
      this.isLoading = true
      try {
        const res = await axios.get(api)
        if (res.data.success) {
          this.cart = res.data.data
          console.log(res)
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

    async addCart(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/cart`
      const cart = {
        product_id: id,
        qty: 1,
      }
      this.status.loadingItem = id

      try {
        const res = await axios.post(api, { data: cart })
        if (res.data.success) {
          // console.log(res)
          this.status.loadingItem = ''
          this.getCart()
        }
      } catch (error) {
        console.log(error.response)
      }
    },

    async updateCart(id, qty) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/cart/${id}`
      const cart = { product_id: id, qty: qty }
      this.status.loadingItem = id
      try {
        const res = await axios.put(api, { data: cart })
        if (res.data.success) {
          this.getCart()
        }
      } catch (error) {
        console.log(error.response)
      } finally {
        this.status.loadingItem = ''
      }
    },

    async removeCartItem(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/cart/${id}`
      this.status.loadingItem = id
      try {
        const res = await axios.delete(api, id)
        if (res.data.success) {
          this.getCart()
        }
      } catch (error) {
        console.log(error.response)
      } finally {
        this.status.loadingItem = ''
      }
    },

    async addCouponCode() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/coupon`
      const coupon = { code: this.coupon_code }
      this.isLoading = true

      try {
        const res = await axios.post(api, { data: coupon })
        if (res.data.success) {
          alert(res.data.message)
          this.getCart()
        } else {
          alert('查無優惠券')
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
