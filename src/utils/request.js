import store from '@/store'
import axios from 'axios'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
import { Message } from 'element-ui'
const TimeOut = 3600 //定义超时时间
const service = axios.create({
    // 当执行 npm run dev => .env.development => /api => 跨域代理
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000 //设置超时时间
})
service.interceptors.request.use(config => {
  // config是请求的配置信息
  // 注入token
  if(store.getters.token) {
    // 只有token获得后才有必要去检查时间戳是否超时
    if(isCheckTimeOut()) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token已超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 注意： config是必须要返回的，不能放到if当中
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(
    response => {
        // axios默认加了一层data
        const {success, message, data} = response.data
        if(success) {
            return data
        } else {
            // 业务已经错误了，还能进then ? 不能 应该
            Message.error(message)
            return Promise.reject(new Error(message))
        }
    },
    error => {
      // token失效的被动处理，根据后端服务器返回的状态码判断超时
      if(error.response && error.response.data && error.response.data.code === 10002) {
        store.dispatch('user/logout')
        router.push('/login')
      } else {
        // 提示错误信息
        Message.error(error.message)
      }
      return Promise.reject(error)
      // 返回执行错误，让当前的执行链跳出成功，直接进入catch
    }
)

/**
 * 检查token是否超时
 */
function isCheckTimeOut() {
  var currentTime = Date.now()
  var timestamp = getTimeStamp()
  return (currentTime - timestamp) / 1000 > TimeOut
}
export default service
