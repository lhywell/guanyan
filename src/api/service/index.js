import request from '@/common/axios/index'
import { baseURL } from '@/config'

// 查询问答信息
export function getQuestion(data) {
  return request({
    url: `${baseURL}/questionAnswer/page`,
    method: 'post',
    data,
  })
}

// 更新或新增问答信息
export function upsert(data) {
  return request({
    url: `${baseURL}/questionAnswer/upsert`,
    method: 'post',
    data,
  })
}

// 下载问答模板
export function downloadTemplate(data) {
  return request({
    url: `${baseURL}/questionAnswer/downloadTemplate`,
    method: 'get',
    data,
    responseType: 'blob',
  })
}

// 上传问答信息
export const action = `${baseURL}/questionAnswer/upload`
