<!-- <script setup>
</script> -->

<template>
  <main>
    <TheWelcome />
  </main>
</template>

<script>
import TheWelcome from '../components/TheWelcome.vue'

export default {
  components: { TheWelcome },
  created() {
    console.log(import.meta.env.VITE_API)
    console.log(import.meta.env.VITE_PATH)
  },
}
</script>
