import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 分页查询消息
export function getMessage(data) {
  return request({
    url: `${baseURL}/message/page`,
    method: 'post',
    data,
  })
}

// 创建消息
export function createMessage(data) {
  return request({
    url: `${baseURL}/message/create`,
    method: 'post',
    data,
  })
}

// 消息内容更新
export function updateMessage(data) {
  return request({
    url: `${baseURL}/message/update`,
    method: 'post',
    data,
  })
}

// 消息审核
export function examineMessage(data) {
  return request({
    url: `${baseURL}/message/examine`,
    method: 'post',
    data,
  })
}
