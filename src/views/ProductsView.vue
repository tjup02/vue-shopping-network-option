<template>
  <!-- loading -->
  <LoadingOverlay :active="isLoading"></LoadingOverlay>
  <div class="text-end">
    <button @click="openModal(true)" type="button" class="btn btn-primary">新增產品</button>
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
        <td class="text-right">{{ $filters.currency(item.origin_price) }}</td>
        <td class="text-right">{{ $filters.currency(item.price) }}</td>
        <td>
          <span v-if="item.is_enabled" class="text-success">啟用</span>
          <span v-else class="text-muted">不啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button @click="openModal(false, item)" class="btn btn-outline-primary btn-sm">
              編輯
            </button>
            <button @click="openDelModal(item)" class="btn btn-outline-danger btn-sm">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <!-- @emit-pages="getProducts"  將子元件欲切換的頁碼資訊傳過來 -->
  <PaginationView :pages="pagination" @emit-pages="getProducts"></PaginationView>
  <!-- :product="tempProduct" 將表單填寫的資料傳入子元件 -->
  <ProductModal
    ref="productModal"
    :product="tempProduct"
    @update-product="updateProduct"
  ></ProductModal>
  <DelModal ref="delModal" :item="tempProduct" @del-item="delProduct"></DelModal>
</template>

<script>
import PaginationView from '@/components/PaginationView.vue'
import axios from 'axios'
import ProductModal from '@/components/ProductModal.vue'
import DelModal from '@/components/DelModal.vue'

export default {
  data() {
    return {
      products: [], //產品總表
      pagination: {},
      tempProduct: {}, //用來存取目前選取的資料
      isNew: false, //用來判斷是編輯(false)還是新增(true)
      isLoading: false,
    }
  },
  // 收到祖元件傳遞過來的資料emitter，讓toastMessage可以使用emitter套件
  inject: ['emitter', 'pushMessageState'],
  emits: ['update-product'],
  components: { ProductModal, DelModal, PaginationView },
  created() {
    this.getProducts()
  },
  methods: {
    // 抓取產品總資料
    // 。預設參數page在第一頁
    async getProducts(page = 1) {
      // 接api取商品總資料去渲染畫面
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/products/?page=${page}`
      this.isLoading = true
      try {
        const res = await axios.get(api)
        if (res.data.success) {
          this.products = res.data.products
          this.pagination = res.data.pagination
          // console.log(res.data)
        }
      } catch (error) {
        console.log(error.response)
      } finally {
        this.isLoading = false
      }
    },
    openModal(isNew, item) {
      // 每次打開modal，都清空暫存資料(表單清空)
      if (isNew) {
        // 如果是新增功能，清空表單
        this.tempProduct = {}
      } else {
        // 如果是編輯功能，將該資料帶入暫存資料
        this.tempProduct = { ...item }
      }
      //將 this.isNew狀態與傳進來的isNew統一
      this.isNew = isNew
      const productComponent = this.$refs.productModal
      productComponent.showModal()
    },
    // emit 動作
    async updateProduct(item) {
      // 將emit的資料覆蓋到暫存
      this.tempProduct = item
      const productComponent = this.$refs.productModal
      this.isLoading = true
      // 新增產品
      let api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/product`
      let httpMethods = 'post'

      // 編輯產品
      if (!this.isNew) {
        api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/product/${item.id}`
        httpMethods = 'put'
      }
      try {
        const res = await axios[httpMethods](api, { data: this.tempProduct })
        console.log(res)
        // 關掉modal
        productComponent.hideModal()
        this.getProducts()
        // 如果執行失敗，toast元件內容
        this.pushMessageState(res, this.isNew ? '新增' : '更新')
      } catch (error) {
        // 如果執行失敗，toast元件內容
        this.pushMessageState(error.response, this.isNew ? '新增' : '更新')
      } finally {
        this.isLoading = false
      }
    },
    // 打開刪除Modal動作
    openDelModal(item) {
      this.tempProduct = item
      const delComponent = this.$refs.delModal
      delComponent.showModal()
      console.log(this.tempProduct)
    },

    // 刪除產品
    async delProduct(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/product/${id}`
      this.isLoading = true
      try {
        const res = await axios.delete(api)
        if (res.data.success) {
          const delComponent = this.$refs.delModal
          delComponent.hideModal()
          this.getProducts()

          this.pushMessageState(res, '刪除')
        }
      } catch (error) {
        this.pushMessageState(error.response, '刪除')
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
