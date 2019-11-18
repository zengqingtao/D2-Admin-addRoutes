import request from '@/plugin/axios'

export function getUserList (query) {
  return request({
    url: '/admin/user/getlist',
    method: 'post',
    data: query
  })
}

export function addAdmin (obj) {
  return request({
    url: '/admin/user/add',
    method: 'post',
    data: obj
  })
}

export function editAdmin (obj) {
  return request({
    url: '/admin/user/edit',
    method: 'post',
    data: obj
  })
}

export function changePwd (obj) {
  return request({
    url: '/admin/user/changepwd',
    method: 'post',
    data: obj
  })
}

export function getAdmin (obj) {
  return request({
    url: '/admin/user/get',
    method: 'post',
    data: obj
  })
}

export function setAdmin (obj) {
  return request({
    url: '/admin/user/set',
    method: 'post',
    data: obj
  })
}
