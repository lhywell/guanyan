import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 分页获取合同列表
export function getContract(data) {
  return request({
    url: `${baseURL}/contract/page`,
    method: 'post',
    data,
  })
}

// 合同更新
export function updateContract(data) {
  return request({
    url: `${baseURL}/contract/update`,
    method: 'post',
    data,
  })
}

// 分页查询模板列表
export function getAnnex(data) {
  return request({
    url: `${baseURL}/annex/page`,
    method: 'post',
    data,
  })
}

// 创建模板
export function createAnnex(data) {
  return request({
    url: `${baseURL}/annex/create`,
    method: 'post',
    data,
  })
}

// 查询合同字段列表
export function getCustomField(data) {
  return request({
    url: `${baseURL}/customField/list`,
    method: 'get',
    data,
  })
}

// 更新模板内容
export function updateAnnex(data) {
  return request({
    url: `${baseURL}/annex/update`,
    method: 'post',
    data,
  })
}

// 分页查询规则列表
export function declareRule(data) {
  return request({
    url: `${baseURL}/declareRule/page`,
    method: 'post',
    data,
  })
}

// 创建规则
export function createRule(data) {
  return request({
    url: `${baseURL}/declareRule/create`,
    method: 'post',
    data,
  })
}

// 规则更新
export function updateRule(data) {
  return request({
    url: `${baseURL}/declareRule/update`,
    method: 'post',
    data,
  })
}

// 上传电力信息
export const action = `${baseURL}/businessStatistics/uploadPower`

// 下载电力模板
export function downloadPowerTemplate(data) {
  return request({
    url: `${baseURL}/businessStatistics/downloadPowerTemplate`,
    method: 'get',
    responseType: 'blob',
    data,
  })
}
