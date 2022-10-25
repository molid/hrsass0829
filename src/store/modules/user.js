import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById} from '@/api/user'
import {resetRouter} from '@/router'

const state = {
  token: getToken(), // 设置token为共享状态, 初始化的时候从缓存中读取状态
  userInfo: {} // 定义一个空对象
}
const mutations = {
  setToken(state, token) {
    state.token = token // 将数据设置给vuex
    setToken(token) // 同步给缓存
  },
  removeToken(state) {
    state.token = null // 将vuex的数据置空
    removeToken() // 同步到缓存
  },
  setUserInfo(state, result) {
    // 更新一个对象
    // state.userInfo = result
    // 浅拷贝方式去赋值对象，数据更新之后，才会触发组件的更新
    state.userInfo = {... result}
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) {
    // 调用api接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 拿到token书名登录成功，存入时间戳
    setTimeStamp()
  },
  async getUserInfo (context) {
    const result = await getUserInfo()
    // result中含有menus，menus是筛选权限路由所需参数
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', {...result, ...baseInfo}) // 提交到mutations
    
    return result // 此处为处理权限问题设置
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 去设置权限模块下的路由表为空数组
    // user和permission都是Vuex的同级子模块
    // Vuex子模块怎么调用子模块的action 都没加锁的情况下可以随意调用
    // 不加命名空间的情况下，所有的mutations和actions都是挂载在全局上的，可以直接调用
    // 加了命名空间的context指的不是全局的context,只能调用该模块内的actions
    // ******解决方法 子模块调子模块， commit方法第三个参数 {root： true} 调用根级
    context.commit('permission/setRoutes', [], {root: true})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

