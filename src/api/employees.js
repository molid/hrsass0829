/**
 * 获取员工相关数据
 */
import request from '@/utils/request'
/**
 * 获取员工简单列表
 */
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}