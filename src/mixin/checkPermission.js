// 做一个混入对象
import store from '@/store'

export default {
  // 混入对象是组件的选项
  methods: {
    // 检查权限 要么有 要么没有
    checkPermission(key) {
      const {userInfo} = store.state.user
      if(userInfo.roles.points && userInfo.roles.points.length) {
         return userInfo.roles.points.some(item => item === key)
      }
      return false  // 如果没有进去， 肯定没有
      
    }
  }
}