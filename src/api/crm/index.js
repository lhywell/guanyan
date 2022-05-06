// 账户管理
import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 得到销售列表
export async function getSaleList(data = {}) {
  return request({
    url: `${baseURL}/sale/list`,
    method: 'get',
    data,
  })
}

// 分页查询客户列表
export async function getCustomer(data = {}) {
  return request({
    url: `${baseURL}/customer/page`,
    method: 'post',
    data,
  })
}

// 添加客户
export async function addCustomer(data = {}) {
  return request({
    url: `${baseURL}/customer/add`,
    method: 'post',
    data,
  })
}

// 下载
export async function downloadExcel(data = {}) {
  return request({
    url: `${baseURL}/customer/add`,
    method: 'post',
    data,
  })
}
