import request from '@/plugin/axios'

export function getActivityFormList (query) {
    return request({
        url: '/admin/activityform/getlist',
        method: 'post',
        data: query
    })
}

export function getActivityFormInfo (query) {
    return request({
        url: '/admin/activityform/get',
        method: 'post',
        data: query
    })
}

export function getActivityFormItems (query) {
    return request({
        url: '/admin/activityform/getitems',
        method: 'post',
        data: query
    })
}

export function submitActivityForm (query) {
    return request({
        url: '/admin/activityform/submitactivityform',
        method: 'post',
        data: query
    })
}

export function submitItemForm (query) {
    return request({
        url: '/admin/activityform/submititemform',
        method: 'post',
        data: query
    })
}

export function getActivityFormMessage (query) {
    return request({
        url: '/admin/activityform/getactivityformmessage',
        method: 'post',
        data: query
    })
}

export function exportRecord(query)
{
    return request({
        url: '/admin/excel/exportactivityformmessage',
        method: 'post',
        data: query
    })
}