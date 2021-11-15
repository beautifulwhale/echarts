import Vue from 'vue'
import Router from 'vue-router'
import SellerPage from '@/pages/SellerPage'
import TrendPage from '@/pages/TrendPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/seller',
      component: SellerPage
    },
    {
      path: '/trend',
      component: TrendPage
    }
  ]
})
