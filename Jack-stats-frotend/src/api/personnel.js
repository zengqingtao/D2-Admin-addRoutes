import request from '@/plugin/axios'

export function getPatientsList (query) {
  return request({
    url: '/admin/patients/getlist',
    method: 'post',
    data: query
  })
}

export function getPatientsOrdersList (query) {
  return request({
    url: '/admin/patients/getorderlist',
    method: 'post',
    data: query
  })
}

export function getPatientsOrder (query) {
  return request({
    url: '/admin/patients/getorder',
    method: 'post',
    data: query
  })
}

export function getUsersList (query) {
  return request({
    url: '/admin/users/getlist',
    method: 'post',
    data: query
  })
}

export function getStaffList (query) {
  return request({
    url: '/admin/staff/getlist',
    method: 'post',
    data: query
  })
}

export function getPatientsByUserId (query) {
  return request({
    url: '/admin/patients/getbyuserid',
    method: 'post',
    data: query
  })
}

export function setPatient (query) {
  return request({
    url: '/admin/patients/set',
    method: 'post',
    data: query
  })
}

export function getAuditingList (query) {
  return request({
    url: '/admin/auditing/getlist',
    method: 'post',
    data: query
  })
}

export function audit (query) {
  return request({
    url: '/admin/auditing/audit',
    method: 'post',
    data: query
  })
}

export function getAudit (query) {
  return request({
    url: '/admin/auditing/get',
    method: 'post',
    data: query
  })
}

export function getStaff (query) {
  return request({
    url: '/admin/staff/get',
    method: 'post',
    data: query
  })
}

export function setStaff (query) {
  return request({
    url: '/admin/staff/set',
    method: 'post',
    data: query
  })
}

export function getRecommendList (query) {
  return request({
    url: '/admin/staff/recommend',
    method: 'post',
    data: query
  })
}

export function getStaffBonusDetail (query) {
  return request({
    url: '/admin/staff/bonusdetail',
    method: 'post',
    data: query
  })
}

export function getUserBonusDetail (query) {
  return request({
    url: '/admin/user/bonusdetail',
    method: 'post',
    data: query
  })
}

export function setRecommend (query) {
  return request({
    url: '/admin/users/setrecommend',
    method: 'post',
    data: query
  })
}

export function getUserInviteList (query) {
  return request({
    url: '/admin/users/invitelist',
    method: 'post',
    data: query
  })
}

export function getStaffInviteList (query) {
  return request({
    url: '/admin/staff/invitelist',
    method: 'post',
    data: query
  })
}

export function getAuditHospitalList (query) {
  return request({
    url: '/admin/auditing/getapplylist',
    method: 'post',
    data: query
  })
}

export function setAuditHospitalSuccess (query) {
  return request({
    url: '/admin/auditing/approve_apply',
    method: 'post',
    data: query
  })
}

export function setAuditHospitalFail (query) {
  return request({
    url: '/admin/auditing/reject_apply',
    method: 'post',
    data: query
  })
}
