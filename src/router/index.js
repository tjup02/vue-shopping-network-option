import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // RouterLink 被選中時的 class(全域設定)
  // -被選中時，自動加上.active
  // -如果只希望指定RouterLink有這個功能，可以在指定RouterLink加上 active-class="active"
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      children: [
        {
          path: '/products',
          name: 'products',
          component: () => import('../views/ProductsView.vue'),
        },
        {
          path: '/orders',
          name: 'orders',
          component: () => import('../views/OrdersView.vue'),
        },
      ],
    },
    {
      path: '/user',
      name: 'userboard',
      component: () => import('../views/UserboardView.vue'),
      children: [
        // {
        //   path: '/userProducts',
        //   name: 'userProducts',
        //   component: () => import('../views/UserCartView.vue'),
        // },
        {
          path: '/user/cart',
          name: 'userCart',
          component: () => import('../views/UserCartView.vue'),
        },
        // 產品資訊
        {
          path: '/productInfo/:id',
          component: () => import('../views/productInfo.vue'),
          props: (route) => {
            return { id: route.params.id }
          },
        },
      ],
    },
  ],
})

export default router
