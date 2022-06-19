// 录入产品管理
import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 获取销售列表
export async function getSaleList(data = {}) {
  return request({
    url: `${baseURL}/sale/list`,
    method: 'get',
    data,
  })
}

// 获取一转产品列表
export async function getProductOne(data = {}) {
  return request({
    url: `${baseURL}/product/list/one`,
    method: 'get',
    data,
  })
}

// 获取二转产品列表
export async function getProductTwo(data = {}) {
  return request({
    url: `${baseURL}/product/list/two`,
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

// 删除客户
export async function deleteCustomer(data = {}) {
  return request({
    url: `${baseURL}/customer/delete`,
    method: 'get',
    data,
  })
}

// 补差价金额
export async function editPrice(data = {}) {
  return request({
    url: `${baseURL}/price/update`,
    method: 'post',
    data,
  })
}

// 编辑客户信息
export async function editCustomer(data = {}) {
  return request({
    url: `${baseURL}/customer/update`,
    method: 'post',
    data,
  })
}

// 下载excel
export function downloadExcel(data) {
  return request({
    url: `${baseURL}/customer/download`,
    method: 'get',
    data,
    responseType: 'blob',
  })
}

// 获取当月统计分析成交数据
export function getPriceByMonth(data) {
  return request({
    url: `${baseURL}/customer/getPriceByMonth`,
    method: 'post',
    data,
  })
}

// 增加roi统计数据
export function addFans(data) {
  return request({
    url: `${baseURL}/roi/add`,
    method: 'post',
    data,
  })
}

// 得到roi统计数据
export function getFans(data) {
  return request({
    url: `${baseURL}/roi/page`,
    method: 'post',
    data,
  })
}

// 删除roi统计数据
export function deleteFans(data) {
  return request({
    url: `${baseURL}/roi/delete`,
    method: 'get',
    params: data,
  })
}

// 添加更新备注
export function updateNotice(data) {
  return request({
    url: `${baseURL}/roi/updateNotice`,
    method: 'post',
    data,
  })
}
