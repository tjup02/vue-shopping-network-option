<!-- <script setup>
</script> -->

<template>
  <header>
    <NavBar></NavBar>
  </header>
  <main>
    <TheWelcome />
  </main>
</template>

<script>
import TheWelcome from '../components/TheWelcome.vue'
import NavBar from '@/components/NavBar.vue'
export default {
  components: { TheWelcome, NavBar },
  created() {
    console.log(import.meta.env.VITE_API)
    console.log(import.meta.env.VITE_PATH)
  },
}
</script>
