<template>
  <!-- bootstrap樣式容器，可定位多個toast -->
  <div class="toast-container top-0 end-0 p-3 position-absolute">
    <!-- ToastList用v-for去跑訊息迴圈 ，達到產生並顯示多個toast訊息的目的-->
    <ToastList v-for="(msg, index) in messages" :key="index" :msg="msg"></ToastList>
  </div>
</template>

<script>
import ToastList from './ToastList.vue'
export default {
  data() {
    return {
      messages: [],
    }
  },
  // 收到祖元件傳遞過來的資料emitter，讓toastMessage可以使用emitter套件
  inject: ['emitter'],
  components: { ToastList },
  mounted() {
    this.emitter.on('push-message', (message) => {
      // 資料標準化（normalize data）
      // 。 整理傳進來的資料(包括設定預設值)
      const { style = 'success', title, content } = message
      //   將整理好的資料傳進this.messages
      this.messages.push({ style, title, content })
    })
  },
}
</script>
<style></style>
