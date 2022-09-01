import request from '@/utils/request'

/**
 *  获取组织架构的数据
 */

/**
 * 获取-部门列表
 */
export function getDepartments() {
  return request({
    url:'/company/department'
  })
}

/**
 * 根据ID删除部门
 */
export function delDepartments(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}

/**
 * 新增部门
 */
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

/**
 * 根据ID查询部门详情
 */
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

/**
 * 根据ID修改部门详情
 */
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}