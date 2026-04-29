<template>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <!-- 請同學自行新增 v-model -->
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>新增產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="image" class="form-label">輸入圖片網址</label>
                <input
                  v-model="tempProduct.imageUrl"
                  type="text"
                  class="form-control"
                  id="image"
                  placeholder="請輸入圖片連結"
                />
              </div>
              <div class="mb-3">
                <label for="customFile" class="form-label"
                  >或 上傳圖片
                  <i class="fas fa-spinner fa-spin"></i>
                </label>
                <input
                  @change="uploadFile"
                  type="file"
                  id="customFile"
                  class="form-control"
                  ref="fileInput"
                />
              </div>
              <img :src="tempProduct.imageUrl" class="img-fluid" alt="" />
              <!-- 延伸技巧，多圖 -->
              <div class="mt-5">
                <div class="mb-3 input-group">
                  <input
                    v-model="tempProduct.imageUrl"
                    type="url"
                    class="form-control form-control"
                    placeholder="請輸入連結"
                  />
                  <button type="button" class="btn btn-outline-danger">移除</button>
                </div>
                <div>
                  <button class="btn btn-outline-primary btn-sm d-block w-100">新增圖片</button>
                </div>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  v-model="tempProduct.title"
                  type="text"
                  class="form-control"
                  id="title"
                  placeholder="請輸入標題"
                />
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    v-model="tempProduct.category"
                    type="text"
                    class="form-control"
                    id="category"
                    placeholder="請輸入分類"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    v-model="tempProduct.unit"
                    type="text"
                    class="form-control"
                    id="unit"
                    placeholder="請輸入單位"
                  />
                </div>
              </div>

              <div class="row gx-2">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    v-model.number="tempProduct.origin_price"
                    type="number"
                    class="form-control"
                    id="origin_price"
                    placeholder="請輸入原價"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    v-model.number="tempProduct.price"
                    type="number"
                    class="form-control"
                    id="price"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>
              <hr />

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  v-model="tempProduct.description"
                  type="text"
                  class="form-control"
                  id="description"
                  placeholder="請輸入產品描述"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  v-model="tempProduct.content"
                  type="text"
                  class="form-control"
                  id="content"
                  placeholder="請輸入產品說明內容"
                ></textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    v-model="tempProduct.is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                    id="is_enabled"
                  />
                  <label class="form-check-label" for="is_enabled"> 是否啟用 </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button
            @click="$emit('update-product', tempProduct)"
            type="button"
            class="btn btn-primary"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'
import axios from 'axios'

export default {
  data() {
    return {
      // Bootstrap Modal 實例（用來控制開關）
      modal: {},
      tempProduct: {},
    }
  },
  props: {
    // 用來接收表單寫入的資料
    product: {
      type: Object,

      // 如果父元件資料沒有成功傳入，預設傳入空物件
      default() {
        return {}
      },
    },
  },
  mounted() {
    // 將 DOM（this.$refs.modal）轉成 Bootstrap Modal 實例
    this.modal = new Modal(this.$refs.modal)
  },
  watch: {
    // 監聽product(props)，每次父元件傳資料進來，將暫存資料覆蓋
    product() {
      this.tempProduct = this.product
    },
  },
  methods: {
    showModal() {
      this.modal.show()
    },
    hideModal() {
      this.modal.hide()
    },
    // 圖片上傳動作
    async uploadFile() {
      // 取得上傳資料
      const uploadedFile = this.$refs.fileInput.files[0]
      // console.dir(uploadedFile)

      // 建立一個「表單資料容器」，用來裝 檔案或資料，準備送到後端。
      //  。 new FormData()會轉換成formData格式(multipart/form-data)
      const formData = new FormData()
      // 建立欄位:'file-to-upload'是API提供的名字，要看API說明
      formData.append('file-to-upload', uploadedFile)

      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/upload`
      try {
        const res = await axios.post(api, formData)
        if (res.data.success) {
          // 將上傳的圖片路徑寫入this.tempProduct.imageUrl
          this.tempProduct.imageUrl = res.data.imageUrl
        }
      } catch (error) {
        console.log(error.response)
      }
    },
  },
}
</script>
