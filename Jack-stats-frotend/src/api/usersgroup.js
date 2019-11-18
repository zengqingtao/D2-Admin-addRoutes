import request from '@/plugin/axios'

export function getMyUsersGroup (query) {
    return request({
        url: '/admin/usersgroup/getmyusersgroup',
        method: 'post',
        data: query
    })
}

export function getUserList (query) {
    return request({
        url: '/admin/usersgroup/getmygroupusers',
        method: 'post',
        data: query
    })
}

export function getAddUserList (query) {
    return request({
        url: '/admin/usersgroup/getnotincludedusers',
        method: 'post',
        data: query
    })
}

export function addGroupUser (query) {
    return request({
        url: '/admin/usersgroup/addgroupuser',
        method: 'post',
        data: query
    })
}

export function delGroupUser (query) {
    return request({
        url: '/admin/usersgroup/delgroupuser',
        method: 'post',
        data: query
    })
}

export function setGroup (query) {
    return request({
        url: '/admin/usersgroup/setgroup',
        method: 'post',
        data: query
    })
}

export function delGroup (query) {
    return request({
        url: '/admin/usersgroup/delgroup',
        method: 'post',
        data: query
    })
}