import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Components from '@/components'
import * as directives from '@/directives'
import * as filters from '@/filters'
import CheckPermission from '@/mixin/checkPermission'

import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

// 注册自定义指令 --- directives中包含多个自定义指令，因此ES6keys()的每一个然后遍历注册自定义指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
// 注册过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* main.js 挂载路由-router 挂载Vuex-store 全局注册Element  APP.vue根组件 */

// 注册自定义组件
Vue.use(Components)
// 全局混入检查对象
Vue.mixin(CheckPermission) //表示所有的组件都拥有了检查的方法
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
