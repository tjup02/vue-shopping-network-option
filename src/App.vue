<template>
  <div class="container-fluid">
    <RouterView />
  </div>
</template>

<script>
import { RouterView } from 'vue-router'

export default {
  components: { RouterView },
}
</script>

<style lang="scss">
@import './assets/all.scss';
</style>
