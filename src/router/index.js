import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../pages/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'index',
    component: Index
  }
]


const router = new VueRouter({
  mode: 'history',
  base: window.location.pathname,
  routes
})

export default router
