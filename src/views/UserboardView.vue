<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <div class="navbar-brand">用戶端範例</div>
      <div class="d-flex">
        <RouterLink class="nav-link linkStyle me-3" :to="{ name: 'userCart' }"
          >產品選購區</RouterLink
        >
        <!-- <RouterLink class="nav-link linkStyle me-3" :to="{ name: 'userCart' }">購物車</RouterLink> -->
      </div>
    </div>
  </nav>
  <div class="container-fluid mt-3 position-relative">
    <!-- <ToastMessage></ToastMessage> -->
    <RouterView />
  </div>
</template>

<script>
// import axios from 'axios'
</script>

<style lang="scss" scoped>
.linkStyle {
  color: rgb(43, 131, 226);
  &.active {
    color: blueviolet;
  }
}
</style>
