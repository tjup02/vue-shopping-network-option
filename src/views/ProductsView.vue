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
        <td class="text-right">{{ item.origin_price }}</td>
        <td class="text-right">{{ item.price }}</td>
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

  <!-- :product="tempProduct" 將表單填寫的資料傳入子元件 -->
  <ProductModal
    ref="productModal"
    :product="tempProduct"
    @update-product="updateProduct"
  ></ProductModal>
  <DelModal ref="delModal" :product="tempProduct" @del-item="delProduct"></DelModal>
</template>

<script>
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
  inject: ['emitter'],
  emits: ['update-product'],
  components: { ProductModal, DelModal },
  created() {
    this.getProducts()
  },
  methods: {
    // 抓取產品總資料
    async getProducts() {
      // 新增
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/products`
      this.isLoading = true
      try {
        const res = await axios.get(api)
        if (res.data.success) {
          this.products = res.data.products
          this.pagination = res.data.pagination
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
        // 如果更新成功，toast元件內容:
        if (httpMethods === 'put') {
          this.emitter.emit('push-message', {
            style: 'success',
            title: '更新成功',
            content: `成功更新${item.title}`,
          })
          // 如果新增成功，toast元件內容:
        } else {
          this.emitter.emit('push-message', {
            style: 'primary',
            title: '新增成功',
          })
        }
      } catch (error) {
        console.log(error.response)
        // 如果執行失敗，toast元件內容:
        this.emitter.emit('push-message', {
          style: 'danger',
          title: '更新失敗',
          content: error.response.data.message,
          // { "success": false, "message": "您所查看的API不存在 >_<" }
        })
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
          this.emitter.emit('push-message', {
            style: 'success',
            title: '刪除成功',
          })
        }
      } catch (error) {
        console.log(error.response)
        this.emitter.emit('push-message', {
          style: 'danger',
          title: '刪除失敗',
          content: error.response.data.message,
        })
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
