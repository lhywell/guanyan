import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 获取代理商交易信息
export function getTeamAgentInfo(data) {
  return request({
    url: `${baseURL}/businessStatistics/agentInfoByName`,
    method: 'post',
    data,
  })
}

// 获取合同交易信息
export function getContractInfoByName(data) {
  return request({
    url: `${baseURL}/businessStatistics/contractInfoByName`,
    method: 'post',
    data,
  })
}

// 新增或修改收入
export function upsertIncome(data) {
  return request({
    url: `${baseURL}/businessStatistics/upsertIncome`,
    method: 'post',
    data,
  })
}

// 获取合同下的收入及电量信息
export function getInfoByContract(data) {
  return request({
    url: `${baseURL}/businessStatistics/infoByContract`,
    method: 'get',
    data,
  })
}

// 下载结算模板
export function downloadIncomeTemplate(data) {
  return request({
    url: `${baseURL}/businessStatistics/downloadIncomeTemplate`,
    method: 'get',
    data,
    responseType: 'blob',
  })
}

// 上传结算信息
export const action = `${baseURL}/businessStatistics/uploadIncome`
