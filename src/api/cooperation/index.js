import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 查看协作信息列表
export function getList(data) {
  return request({
    url: `${baseURL}/cooperationManager/info`,
    method: 'post',
    data,
  })
}

// 分页查询合同关联协作列表
export function getRelation(data) {
  return request({
    url: `${baseURL}/cooperationManager/page/relation`,
    method: 'post',
    data,
  })
}
