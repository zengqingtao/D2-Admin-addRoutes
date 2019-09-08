import request from '@/plugin/axios'

export function getDetailInfo (data) {
  return request({
    url: '/stat/getDetailInfo',
    method: 'post',
    data
  })
}
