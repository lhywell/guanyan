import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 获取代理商信息
export function getAgentManager(data) {
  return request({
    url: `${baseURL}/agentManager/info`,
    method: 'post',
    data,
  })
}

// 获取团队代理商层次信息
export function getTeamAgentInfo(data) {
  return request({
    url: `${baseURL}/agentManager/teamAgentInfo`,
    method: 'get',
    data,
  })
}

// 分页获取全部代理商信息
export function getAllAgentInfo(data) {
  return request({
    url: `${baseURL}/agentManager/allAgentInfo`,
    method: 'post',
    data,
  })
}
