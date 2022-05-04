// 账户管理
import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 分页查询新闻列表
export async function getNews(data = {}) {
  return request({
    url: `${baseURL}/news/page`,
    method: 'post',
    data,
  })
}

// 分页查询频道列表
export async function getChannel(data = {}) {
  return request({
    url: `${baseURL}/channel/list`,
    method: 'get',
    data,
  })
}

// 更新新闻
export async function newsUpdate(data = {}) {
  return request({
    url: `${baseURL}/news/update`,
    method: 'post',
    data,
  })
}

// 售电公司介绍编辑
export async function sellCompanyUpdate(data = {}) {
  return request({
    url: `${baseURL}/sellCompanyIntroduce/update`,
    method: 'post',
    data,
  })
}

// 获取已存在的区域列表
export async function getMarketAreas(data = {}) {
  return request({
    url: `${baseURL}/marketInfo/areas`,
    method: 'get',
    data,
  })
}

// 创建市场信息
export async function createMarket(data = {}) {
  return request({
    url: `${baseURL}/marketInfo/create`,
    method: 'get',
    data,
  })
}

// 删除市场信息
export async function deleteMarket(data = {}) {
  return request({
    url: `${baseURL}/marketInfo/delete`,
    method: 'get',
    data,
  })
}

// 市场信息更新
export async function updateMarket(data = {}) {
  return request({
    url: `${baseURL}/marketInfo/update`,
    method: 'post',
    data,
  })
}

// 分页查询售电公司
export function getCompany(data) {
  return request({
    url: `${baseURL}/sellCompany/page`,
    method: 'post',
    data,
  })
}

// 创建售电公司
export function createCompany(data) {
  return request({
    url: `${baseURL}/sellCompany/create`,
    method: 'post',
    data,
  })
}

// 售电公司信息更新
export function updateCompany(data) {
  return request({
    url: `${baseURL}/sellCompany/update`,
    method: 'post',
    data,
  })
}

// 分页获取售电公司列表
export function getSellCompanyIntroduce(data) {
  return request({
    url: `${baseURL}/sellCompanyIntroduce/page`,
    method: 'post',
    data,
  })
}

// 售电公司介绍审核
export function sellCompanyExamine(data) {
  return request({
    url: `${baseURL}/sellCompanyIntroduce/examine`,
    method: 'post',
    data,
  })
}
