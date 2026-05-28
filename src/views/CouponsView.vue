<template>
  <div>
    <LoadingOverlay :active="isLoading"></LoadingOverlay>
    <div class="text-end mt-4">
      <button class="btn btn-primary" @click="openCouponModal(true)">建立新的優惠券</button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in coupons" :key="key">
          <td>{{ item.title }}</td>
          <td>{{ item.percent }}%</td>
          <td>{{ $filters.date(item.due_date) }}</td>
          <td>
            <span v-if="item.is_enabled === 1" class="text-success">啟用</span>
            <span v-else class="text-muted">未起用</span>
          </td>
          <td>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="openCouponModal(false, item)">
                編輯
              </button>
              <button class="btn btn-outline-danger btn-sm" @click="openDelCouponModal(item)">
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- @emit-pages="getCoupons"  將子元件欲切換的頁碼資訊傳過來 -->
    <PaginationView :pages="pagination" @emit-pages="getCoupons"></PaginationView>
    <CouponModal
      :coupon="tempCoupon"
      :couponTitle="isNew ? '新增' : '編輯'"
      ref="couponModal"
      @update-coupon="updateCoupon"
    ></CouponModal>
    <DelModal :item="tempCoupon" ref="delModal" @del-item="delCoupon" />
  </div>
</template>

<script>
import axios from 'axios'
import CouponModal from '@/components/CouponModal.vue'
import PaginationView from '@/components/PaginationView.vue'
import DelModal from '@/components/DelModal.vue'

export default {
  data() {
    return {
      isLoading: false,
      coupons: {}, //所有優惠券
      tempCoupon: {}, //暫時選取的優惠券
      pagination: {},
      isNew: true, //新增或編輯
    }
  },
  components: { CouponModal, PaginationView, DelModal },
  inject: ['emitter', 'pushMessageState'],
  created() {
    this.getCoupons()
  },
  methods: {
    async getCoupons(page = 1) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/coupons/?page=${page}`
      this.isLoading = true
      try {
        const res = await axios.get(api)
        if (res.data.success) {
          this.coupons = res.data.coupons
          this.pagination = res.data.pagination
        }
      } catch (error) {
        console.log(error.response)
      } finally {
        this.isLoading = false
      }
    },

    openCouponModal(isNew, coupon) {
      this.$refs.couponModal.showModal()
      if (isNew) {
        this.tempCoupon = {}
      } else {
        this.tempCoupon = { ...coupon }
      }
      this.isNew = isNew
    },

    async updateCoupon(coupon) {
      this.isLoading = true
      const sameCode = this.coupons.some((item) => item.code === this.tempCoupon.code)
      let api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/coupon`
      let httpMethods = 'post'

      // 編輯模式
      if (!this.isNew) {
        api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/coupon/${coupon.id}`
        httpMethods = 'put'
      }

      if (!this.tempCoupon.title) {
        alert('標題沒填')
        return false
      }
      if (!this.tempCoupon.code) {
        alert('優惠碼沒填')
        return false
      }
      if (!sameCode) {
        alert('已有重複優惠碼，請重填')
        return false
      }

      if (!this.tempCoupon.due_date) {
        alert('到期日沒填')
        return false
      }
      if (
        this.tempCoupon.percent < 1 ||
        this.tempCoupon.percent > 99 ||
        this.tempCoupon.percent === '' ||
        this.tempCoupon.percent === null ||
        this.tempCoupon.percent === undefined
      ) {
        alert('請填寫有效的折扣百分比，1~99')
        return false
      }

      try {
        let res = await axios[httpMethods](api, { data: this.tempCoupon })
        if (res.data.success) {
          this.getCoupons()
          this.pushMessageState(res, this.isNew ? '新增' : '更新')
        }
        this.$refs.couponModal.hideModal()
      } catch (error) {
        // console.log('錯誤', error.response)
        this.pushMessageState(error.response, this.isNew ? '新增' : '更新')
      } finally {
        this.isLoading = false
      }
    },

    openDelCouponModal(coupon) {
      this.tempCoupon = coupon
      this.$refs.delModal.showModal()
    },

    async delCoupon(id) {
      const api = `${import.meta.env.VITE_API}api/${import.meta.env.VITE_PATH}/admin/coupon/${id}`
      this.isLoading = true
      console.log(id)
      try {
        const res = await axios.delete(api)
        if (res.data.success) {
          this.pushMessageState(res, '刪除')
          this.$refs.delModal.hideModal()
          this.getCoupons()
        }
      } catch (error) {
        this.pushMessageState(error.response, '刪除')
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
