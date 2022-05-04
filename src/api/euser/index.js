import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 获取电力用户电量信息
export function getCustomerPowerInfo(data) {
  return request({
    url: `${baseURL}/businessStatistics/customerPowerInfo`,
    method: 'post',
    data,
  })
}

// 获取代理商交易信息
export function getTeamAgentInfo111111(data) {
  return request({
    url: `${baseURL}/businessStatistics/agentInfoByName`,
    method: 'get',
    data,
  })
}
