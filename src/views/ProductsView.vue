<template>
  <div class="text-end">
    <button @click="openModal()" type="button" class="btn btn-primary">新增產品</button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <td>{{ item.category }}</td>
        <td>{{ item.title }}</td>
        <td class="text-right">{{ item.origin_price }}</td>
        <td class="text-right">{{ item.price }}</td>
        <td>
          <span v-if="item.is_enabled" class="text-success">啟用</span>
          <span v-else class="text-muted">不啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm">編輯</button>
            <button class="btn btn-outline-danger btn-sm">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- :product="tempProduct" 將表單填寫的資料傳入子元件 -->
  <ProductModal
    ref="productModal"
    :product="tempProduct"
    @update-product="updateProduct"
  ></ProductModal>
</template>

<script>
import axios from 'axios'
import ProductModal from '@/components/ProductModal.vue'

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
    }
  },
  components: { ProductModal },
  created() {
    this.getProducts()
  },
  methods: {
    // 接收總商品資料API
    async getProducts() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/products`
      try {
        const res = await axios.get(api)
        if (res.data.success) {
          this.products = res.data.products
          this.pagination = res.data.pagination
        }
      } catch (error) {
        console.log(error.response)
      }
    },
    openModal() {
      // 每次打開modal，都清空暫存資料(表單清空)
      this.tempProduct = {}
      const productComponent = this.$refs.productModal
      productComponent.showModal()
    },
    async updateProduct(item) {
      // 將emit的資料覆蓋到暫存
      this.tempProduct = item
      const productComponent = this.$refs.productModal
      //   送出商品資料API
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/product`
      try {
        const res = await axios.post(api, { data: this.tempProduct })
        console.log(res)
        // 關掉modal
        productComponent.hideModal()
        // 接收總商品資料API
        this.getProducts()
      } catch (error) {
        console.log(error.response)
      }
    },
  },
}
</script>
