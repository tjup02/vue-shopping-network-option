<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <!-- 上一頁 -->
      <li class="page-item">
        <button
          type="button"
          :disabled="!pages.has_pre"
          @click.prevent="updatePage(pages.current_page - 1)"
          class="page-link"
          href="#"
          aria-label="Previous"
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      <!-- 頁次 -->
      <li
        class="page-item"
        :class="{ active: page === pages.current_page }"
        v-for="page in pages.total_pages"
        :key="page"
      >
        <a @click.prevent="updatePage(page)" class="page-link" href="#">{{ page }}</a>
      </li>
      <!-- 下一頁 -->
      <li class="page-item">
        <button
          type="button"
          :disabled="!pages.has_next"
          @click.prevent="updatePage(pages.current_page + 1)"
          class="page-link"
          href="#"
          aria-label="Next"
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
// :pages="{ 頁碼資訊 }"
// @emitPages="更新頁面事件"
export default {
  props: ['pages'],
  emits: ['emit-pages'],
  methods: {
    // 傳送欲前往的頁碼到父元件
    updatePage(page) {
      this.$emit('emit-pages', page)
    },
  },
}
</script>

<style scoped lang="scss">
.page-link {
  &:disabled {
    background: #ececec;
    color: #ffffff;
  }
}
</style>
