import request from '@/plugin/axios'

export function getRoleList (params) {
  return request({
    url: '/admin/role/getlist',
    method: 'get',
    params
  })
}

export function addRole (params) {
  return request({
    url: '/admin/role/add',
    method: 'post',
    data: params
  })
}

export function editRole (params) {
  return request({
    url: '/admin/role/edit',
    method: 'post',
    data: params
  })
}

export function getRoleOptions () {
  return request({
    url: '/admin/role/getroleoptions',
    method: 'get'
  })
}

export function getAllMenuPower () {
  return request({
    url: '/admin/menu/getallmenupower',
    method: 'get'
  })
}

export function getAllButtonPower () {
  return request({
    url: '/admin/menu/getallbuttonpower',
    method: 'get'
  })
}

export function getAccess (params) {
  return request({
    url: '/admin/role/getaccess',
    method: 'get',
    params
  })
}

export function setAccess (params) {
  return request({
    url: '/admin/role/setaccess',
    method: 'post',
    data: params
  })
}
