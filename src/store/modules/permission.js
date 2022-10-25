// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes //路由表 表示 当前用户所拥有的所有路由 静态路由+权限路由

}
const mutations = {
  // 定义修改routes的mutations
  // payload 认为是我们登录成功需要添加的新路由
  setRoutes(state, newRoutes) {
    // state.routes = [...state.routes, ...newRoutes] 业务逻辑不正确，退出之后routes就应该重置为静态路由
    // 每次都是在静态路由基础上加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  //刷选权限路由
  // 第二个参数为当前用户的所拥有的的菜单权限
  // menus  是Vuex中user下的userInfo中 的menus 已经通过store中user.js中的操作已经放置到state中了，可以直接调用
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出动态路由中menus中可以对的上的
    // asyncRoutes是所有的动态路由 asyncRoutes[{name: 'settings'}, {}]
    menus.forEach(key => {
       // asyncRoutes.filter(item =>item.name === key) 数组 可空
       routes.push(...asyncRoutes.filter(item =>item.name === key))
      //  routes是所有模块中满足权限要求的路由数组
      // routes就是当前用户所拥有的 动态路由的权限
    })
    context.commit('setRoutes', routes) //将动态路由提交给mutations 显示左侧菜单
    return routes //return 是给路由addRoutes用的
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}