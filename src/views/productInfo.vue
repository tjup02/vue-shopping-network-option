<template>
  <LoadingOverlay :active="isLoading"></LoadingOverlay>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/user/cart">購物車</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{ product.title }}</li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ product.title }}</h2>
        <div>{{ product.content }}</div>
        <div>{{ product.description }}</div>
        <img :src="product.imageUrl" alt="" class="img-fluid mb-3" />
      </article>
      <div class="col-4">
        <div class="h5" v-if="!product.price">{{ product.origin_price }} 元</div>
        <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
        <div class="h5" v-if="product.price">現在只要 {{ product.price }} 元</div>
        <hr />
        <!-- 數量調整 -->
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <button
              :disabled="this.qty <= 0"
              @click="minusQty"
              type="button"
              class="btn btn-warning"
            >
              -
            </button>
          </div>
          <input
            type="number"
            class="form-control text-center"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            :value="qty"
            min="0"
          />
          <div class="input-group-append">
            <button @click="addQty" type="button" class="btn btn-warning">+</button>
          </div>
        </div>

        <button
          type="button"
          :disabled="status.loadingItem || qty <= 0"
          class="btn btn-outline-danger"
          @click="addToCart(product.id)"
        >
          <div
            v-if="status.loadingItem"
            class="spinner-grow spinner-grow-sm text-danger"
            role="status"
          >
            <span class="sr-only"></span>
          </div>
          加到購物車
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      isLoading: false,
      product: {},
      qty: 1,
      status: {
        loadingItem: false, //對應品項id
      },
    }
  },
  props: ['id'],
  created() {
    this.getProductId(this.id)
  },
  methods: {
    async getProductId(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/product/${id}`
      this.isLoading = true
      try {
        const res = await axios.get(api)
        if (res.data.success) {
          this.product = res.data.product
          console.log(this.product)
        }
      } catch (error) {
        console.log(error.response)
      } finally {
        this.isLoading = false
      }
    },

    async addToCart(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/cart`
      const cart = {
        product_id: id,
        qty: this.qty,
      }
      this.status.loadingItem = true
      try {
        const res = await axios.post(api, { data: cart })
        if (res.data.success) {
          console.log(res)
          this.status.loadingItem = false
        }
      } catch (error) {
        console.log(error.response)
      }
    },

    minusQty() {
      if (this.qty <= 0) return
      this.qty--
    },
    addQty() {
      this.qty++
    },
  },
}
</script>
