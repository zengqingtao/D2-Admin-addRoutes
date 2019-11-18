import request from '@/plugin/axios'

export function getRechargeDaily (query) {
    return request({
        url: '/admin/stat/getrechargedaily',
        method: 'post',
        data: query
    })
}

export function getLastDayData () {
    return request({
        url: '/admin/stat/getlastdaydata',
        method: 'get',
    })
}

export function getTotalStat () {
    return request({
        url: '/admin/stat/gettotalstat',
        method: 'get',
    })
}
