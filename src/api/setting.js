/**
 *  获取公司和角色的数据
 */
import request from '@/utils/request'
/**
 * 获取所有角色列表
 */
export function getRoleList(params) {
  return request({
    url:'/sys/role',
    params
  })
}

/**
 * 根据id查询企业
 *
 */
export function getCompanyInfo(companyId) {
  return request({
    url:`/company/${companyId}`
  })
}

/**
 * 根据ID删除角色
 */
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/**
 * 根据ID更新角色
 */
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 根据ID获取角色详情
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/**
 * 新增-角色
 */
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

/**
 * 给角色分配权限
 */
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}