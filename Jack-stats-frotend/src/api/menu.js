import request from '@/plugin/axios'

export function GetMenu () {
  return request({
    url: '/admin/menu/usermenu',
    method: 'get'
  })
}
export function fetchTree (query) {
  return request({
    url: '/admin/menu/alltree',
    method: 'get',
    params: query
  })
}

export function addObj (obj) {
  return request({
    url: '/admin/menu/add',
    method: 'post',
    data: obj
  })
}

export function delObj (id) {
  return request({
    url: '/admin/menu/del',
    method: 'post',
    data: id
  })
}

export function putObj (obj) {
  return request({
    url: '/admin/menu/edit',
    method: 'post',
    data: obj
  })
}
