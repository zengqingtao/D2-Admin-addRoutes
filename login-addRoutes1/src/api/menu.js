import request from '@/plugin/axios'

export function GetMenu () {
  return request({
    url: '/menu/usermenu',
    method: 'get'
  })
}

