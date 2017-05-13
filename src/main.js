/**
 * Created by kit-mac on 2017/5/4.
 */
import Vue from 'vue'
import App from './app.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'

import ElTreeGrid from 'element-tree-grid'
Vue.use(ElementUI)
Vue.component(ElTreeGrid.name,ElTreeGrid)

import router from './router'
import store from './store'
import axios from 'axios'
import Cookies from 'js-cookie'

// Mock service
import './mock'

// 后端 api 服务 baseURL
// axios.defaults.baseURL = 'http://mock/api'
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error.response);
});

// Router 方法鉴权并获取相应数据
const whiteList = [
  '/login'
]

const matchInArray = (url, arr) => {
  let matched = false
  for (let i in arr) {
    if (arr[i].index === url) {
      matched = true
      break
    }

    if (arr[i].children) {
      matched = matchInArray(url, arr[i].children)
    }
  }
  return matched
}

const hasPermission = url => {
  let has = false
  const menu = store.state.auth.menu
  return url === '/' || matchInArray(url, menu)
}

router.beforeEach((to, from, next) => {
  // 1. 本地是否存有 token
  const token = Cookies.get('token')
  if (token) {  // 有 token
    // 2. 是否拉取需要的 identity info - 用户信息、菜单等
    const user = store.state.auth.user
    if (user) { // 有信息（正常的跳转）
      // 3. 判断是否有权限进入该 url
      if (to.path === '/login') {
        next('/')
      } else if (hasPermission(to.path)) {
        next()
      } else {
        next('/401')
      }
    } else {    // 无信息（用户刷新页面）
      store.dispatch('refresh').then(() => {
        if (to.path === '/login') {
          next('/')
        } else if (hasPermission(to.path)) {
          next()
        } else {
          next('/401')
        }
      }).catch((resp) => { // 拉不到信息，登录超时
        Cookies.remove('token')
        next('/login')
      })
    }
  } else {      // 无 token
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})

const vm = new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App)
})



