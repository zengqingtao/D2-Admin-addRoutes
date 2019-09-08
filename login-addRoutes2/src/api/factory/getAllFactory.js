import request from '@/plugin/axios'

export function getAllFactory (data) {
  return request({
    url: '/factory/getAllFactory',
    method: 'post',
    data
  })
}
