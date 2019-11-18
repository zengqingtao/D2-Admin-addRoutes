import request from '@/plugin/axios'

export function getMyPatientsList (query) {
    return request({
        url: '/admin/patients/getmypatientslist',
        method: 'post',
        data: query
    })
}


export function getMyPatientsGroup () {
    return request({
        url: '/admin/patients/getmypatientsgroup',
        method: 'get',
    })
}

export function getMyPatientsInfo (query) {
    return request({
        url: '/admin/patients/getmypatientsinfo',
        method: 'post',
        data: query
    })
}