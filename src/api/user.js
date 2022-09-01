import request from '@/utils/request'
/**
 * 登录接口
 */
export function login(data) {
  // return的方式返回一个Promise对象
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取-用户基本资料
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

/**
 * 获取员工基本信息
 */
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {
}
