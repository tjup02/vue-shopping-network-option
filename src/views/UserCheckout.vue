<template>
  <LoadingOverlay :active="isLoading"></LoadingOverlay>
  <div class="my-5 row justify-content-center">
    <form class="col-md-6">
      <table class="table align-middle">
        <thead>
          <th>品名</th>
          <th>數量</th>
          <th>單價</th>
        </thead>
        <tbody>
          <tr v-for="orderItem in order.products" :key="orderItem.id">
            <td>{{ orderItem.product.title }}</td>
            <td>{{ orderItem.qty }} / {{ orderItem.product.unit }}</td>
            <td class="text-end">{{ orderItem.product.price }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="text-end">總計</td>
            <td class="text-end">{{ order.total }}</td>
          </tr>
        </tfoot>
      </table>

      <table class="table">
        <tbody>
          <tr>
            <th width="100">Email</th>
            <td>{{ order.user.email }}</td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{ order.user.name }}</td>
          </tr>
          <tr>
            <th>收件人電話</th>
            <td>{{ order.user.tel }}</td>
          </tr>
          <tr>
            <th>收件人地址</th>
            <td>{{ order.user.address }}</td>
          </tr>
          <tr>
            <th>付款狀態</th>
            <td>
              <span v-if="order.is_paid" class="text-success">付款完成</span>
              <span v-else>尚未付款</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="text-end">
        <button class="btn btn-danger" v-if="order.is_paid === false" @click="payOrder()">
          確認付款去
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      isLoading: false,
      // 訂單內容
      order: {
        user: {},
      },
      //訂單號
      orderId: '',
    }
  },
  created() {
    this.orderId = this.$route.params.orderId
    this.getOrder()
  },
  methods: {
    // 取訂單內容
    async getOrder() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/order/${this.orderId}`
      this.isLoading = true
      try {
        const res = await axios.get(api)
        if (res.data.success) {
          console.log(res.data)
          this.order = res.data.order
        }
      } catch (error) {
        console.log(error.response)
      } finally {
        this.isLoading = false
      }
    },
    // 付款動作
    async payOrder() {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/pay/${this.orderId}`
      this.isLoading = true
      try {
        const res = await axios.post(api)
        if (res.data.success) {
          this.getOrder()
        }
      } catch (error) {
        console.log(error.response)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
