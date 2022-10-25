// 权限拦截在路由跳转 导航守卫

import router from '@/router'
// 引入store实例 和组件中的this.$stores是一回事
import store from '@/store' 
// 引入一份进度条插件及css文件
import nprogress from 'nprogress' 
import 'nprogress/nprogress.css'

// 不需要导出， 因为只需要让代码执行即可
// 前置守卫
// next 是前置守卫必须执行的钩子
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址
const whiteList = ['/login', '/404']
router.beforeEach(async (to, form, next) => {
    // 开启进度条
    nprogress.start()
    if(store.getters.token) {
        // 如果有token, 才能获取用户个人资料
        if(to.path === '/login') {
            // 如果要访问的是登录页， 不用处理
            next('/') //跳到主页
        }else {
            // 如果访问的不是登录页
            // 放行的时候获取用户资料, 并判断用户资料是否已存在
            if (!store.getters.userId) {
              // ******注意： async 函数所return 的内容 用await就可以接收到
              // 此处dispatch只是触发方法，并不需要await接收，此处用await是接收return返回的内容
              const {roles} = await store.dispatch('user/getUserInfo')
              // 后续处理需要用户资料，且为异步函数，故强制捕获
              // 筛选用户的可用路由
              const routes = await store.dispatch('permission/filterRoutes', roles.menus)//筛选的到当前用户可用的动态路由
              // 动态路由添加到路由表中 默认的路由表只有静态路由，没有动态路由
              // 404页面路由要放到所有页面路由之后，解决刷新页面跳转到404的问题
               router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) //铺路
              next(to.path)//相当于调到对应的地址，相当于多做一次跳转
              // 进门，路还没铺好，再进一次，进来之前先铺路，
            } else {
              next()
            }
        }
    } else {
        // 没有token的情况
        if(whiteList.indexOf(to.path) > -1) {
            // 表示要去的地址在白名单中
            next()
        } else {
            next('/login')
        }
    }
    // 手动强制关闭一次，为了解决手动切换地址时，进度条不关闭的问题
    nprogress.done() 
})
// 后置守卫
router.afterEach( () => {
    nprogress.done() //关闭进度条
})