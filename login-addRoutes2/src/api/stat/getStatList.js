import request from '@/plugin/axios'

export function getStatList (data) {
  return request({
    url: '/stat/getStatList',
    method: 'post',
    data
  })
}
