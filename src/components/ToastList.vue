<template>
  <div ref="toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      <span :class="`bg-${msg.style}`" class="p-2 rounded me-2 d-inline-block"></span>
      <strong class="me-auto">{{ msg.title }}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <!-- 如果沒有msg.content，就不要顯示toast-body了 -->
    <div v-if="msg.content" class="toast-body">{{ msg.content }}</div>
  </div>
</template>

<script>
// 引入bootstrap toast.js
import Toast from 'bootstrap/js/dist/toast.js'
export default {
  name: 'ToastList',
  props: {
    msg: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const toastEl = this.$refs.toast
    // 初始化 Bootstrap Toast（UI 控制器）
    // 此實例負責控制顯示/自動關閉行為
    const toast = new Toast(toastEl, {
      delay: 6000, // 6秒後自動隱藏
    })
    // 觸發顯示
    toast.show()
  },
}
</script>
