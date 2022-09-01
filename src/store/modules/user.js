import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById} from '@/api/user'

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
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', {...result, ...baseInfo}) // 提交到mutations
    
    return result // 此处为处理权限问题设置
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

