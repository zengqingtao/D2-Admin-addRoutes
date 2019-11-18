import request from '@/plugin/axios'

export function getDistributionUserList (query) {
    return request({
        url: '/admin/distributionusers/getlist',
        method: 'post',
        data: query
    })
}

export function setDistributionUserInfo (query) {
    return request({
        url: '/admin/distributionusers/set',
        method: 'post',
        data: query
    })
}

export function getDistributionStatList (query) {
    return request({
        url: '/admin/distributionstat/getlist',
        method: 'post',
        data: query
    })
}

export function getOrderDetail (query) {
    return request({
        url: '/admin/distributionstat/getorder',
        method: 'post',
        data: query
    })
}

export function exportDistributionStatDetail(query)
{
    return request({
        url: '/admin/excel/exportdistributionstatdetail',
        method: 'post',
        data: query
    })
}