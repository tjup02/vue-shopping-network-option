import Modal from 'bootstrap/js/dist/modal'

export default {
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
