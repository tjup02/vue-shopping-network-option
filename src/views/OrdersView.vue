<template>
  <LoadingOverlay :active="isLoading"></LoadingOverlay>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th>應付金額</th>
        <th>是否付款</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(item, key) in orders" :key="key">
        <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
          <td>{{ $filters.date(item.create_at) }}</td>
          <td><span v-text="item.user.email" v-if="item.user"></span></td>
          <td>
            <ul class="list-unstyled">
              <li v-for="(product, i) in item.products" :key="i">
                {{ product.product.title }} 數量：{{ product.qty }}
                {{ product.product.unit }}
              </li>
            </ul>
          </td>
          <td class="text-right">{{ item.total }}</td>
          <td>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`paidSwitch${item.id}`"
                v-model="item.is_paid"
                @change="updatePaid(item)"
              />
              <label class="form-check-label" :for="`paidSwitch${item.id}`">
                <span v-if="item.is_paid">已付款</span>
                <span v-else>未付款</span>
              </label>
            </div>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openModal(item)">檢視</button>
              <button class="btn btn-outline-danger btn-sm" @click="openDelOrderModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <OrderModal :order="tempOrder" ref="orderModal" @update-order="updateOrder"></OrderModal>
  <DelModal ref="delModal" :item="tempOrder" @del-item="delOrder"></DelModal>
  <PaginationView :pages="pagination" @emit-pages="getOrders"></PaginationView>
</template>

<script>
import axios from 'axios'
import PaginationView from '@/components/PaginationView.vue'
import OrderModal from '@/components/orderModal.vue'
import DelModal from '@/components/DelModal.vue'

export default {
  data() {
    return {
      orders: [],
      tempOrder: {},
      pagination: {},
      isLoading: false,
    }
  },
  components: { PaginationView, OrderModal, DelModal },
  emits: ['emit-pages'],
  inject: ['emitter', 'pushMessageState'],
  created() {
    this.getOrders()
  },
  methods: {
    async getOrders(page = 1) {
      const url = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/orders?page=${page}`
      this.isLoading = true
      try {
        const res = await axios.get(url)
        if (res.data.success) {
          this.orders = res.data.orders
          this.pagination = res.data.pagination
        }
        // console.log(res.data)
      } catch (error) {
        console.log(error.response)
      } finally {
        this.isLoading = false
      }
    },
    async updatePaid(item) {
      const url = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/order/${item.id}`
      this.tempOrder = item
      this.isLoading = true
      try {
        const res = await axios.put(url, { data: this.tempOrder })
        if (res.data.success) {
          this.getOrders()
          this.pushMessageState(res, '更新')
        }
      } catch (error) {
        console.log(error.response)
        this.pushMessageState(error.response, '更新')
      } finally {
        this.isLoading = false
      }
    },

    openModal(item) {
      this.tempOrder = item
      this.$refs.orderModal.showModal()
    },
    updateOrder() {
      this.$refs.orderModal.hideModal()
    },
    openDelOrderModal(item) {
      this.tempOrder = item
      this.tempOrder.title = `訂單${this.tempOrder.id}`
      this.$refs.delModal.showModal()
    },

    async delOrder(id) {
      const url = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/order/${id}`
      this.isLoading = true
      try {
        const res = await axios.delete(url, id)
        if (res.data.success) {
          this.$refs.delModal.hideModal()
          this.getOrders()
          this.pushMessageState(res, '刪除')
        }
      } catch (error) {
        console.log(error.response)
        this.pushMessageState(error.response, '刪除')
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
