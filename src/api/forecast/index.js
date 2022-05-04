import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 更新或新增地区基准电价
export function upsertStandardPrice(data) {
  return request({
    url: `${baseURL}/businessStatistics/upsertStandardPrice`,
    method: 'get',
    data,
  })
}

// 更新或新增地区电价
export function upsertPrice(data) {
  return request({
    url: `${baseURL}/businessStatistics/upsertPrice`,
    method: 'get',
    data,
  })
}

// 查询基准电价
export function getPowerStandardPricePage(data) {
  return request({
    url: `${baseURL}/businessStatistics/powerStandardPricePage`,
    method: 'post',
    data,
  })
}

// 查询电价
export function getPowerPricePage(data) {
  return request({
    url: `${baseURL}/businessStatistics/powerPricePage`,
    method: 'post',
    data,
  })
}

// 获取区域列表
export function getArea(data) {
  return request({
    url: `${baseURL}/area/all`,
    method: 'get',
    data,
  })
}
