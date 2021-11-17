import Vue from 'vue'
import Router from 'vue-router'
import SellerPage from '@/pages/SellerPage'
import TrendPage from '@/pages/TrendPage'
import MapPage from '@/pages/MapPage'
import RankPage from '@/pages/RankPage'
import HotPage from '@/pages/HotPage'
import StockPage from '@/pages/StockPage'
import screenPage from '@/pages/screenPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: "/screenpage"
    },
    {
      path: '/screenpage',
      component: screenPage
    },
    {
      path: '/seller',
      component: SellerPage
    },
    {
      path: '/trend',
      component: TrendPage
    },
    {
      path: '/map',
      component: MapPage
    },
    {
      path: '/rank',
      component: RankPage
    },
    {
      path: "/hot",
      component: HotPage
    },
    {
      path: "/stock",
      component: StockPage
    }
  ]
})
