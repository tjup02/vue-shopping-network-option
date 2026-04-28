<template>
  <header>
    <NavBar></NavBar>
  </header>
  <div class="container-fluid">
    <RouterView />
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import NavBar from './components/Navbar.vue'

export default {
  components: { RouterView, NavBar },
}
</script>

<style lang="scss">
@import './assets/all.scss';
</style>
