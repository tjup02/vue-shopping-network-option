// 引入bootstrap modal.js
import Modal from 'bootstrap/js/dist/modal.js'

export default {
  data() {
    return {
      // Bootstrap Modal 實例（用來控制開關）
      modal: {},
    }
  },
  mounted() {
    // 將 DOM（this.$refs.modal）轉成 Bootstrap Modal 實例
    this.modal = new Modal(this.$refs.modal)
  },

  methods: {
    showModal() {
      this.modal.show()
    },
    hideModal() {
      this.modal.hide()
    },
  },
}
