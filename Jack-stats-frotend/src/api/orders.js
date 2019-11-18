import request from '@/plugin/axios'

export function getReservationList (query) {
  return request({
    url: '/admin/orders/getlist',
    method: 'post',
    data: query
  })
}

export function getSplitList (query) {
  return request({
    url: '/admin/orders/getlist',
    method: 'post',
    data: query
  })
}

export function getConsultsList (query) {
  return request({
    url: '/admin/orders/getconsultslist',
    method: 'post',
    data: query
  })
}

export function getConsultRecordsList (query) {
  return request({
    url: '/admin/orders/getconsultrecords',
    method: 'post',
    data: query
  })
}

export function addConsultRecord (query) {
  return request({
    url: '/admin/orders/addconsultrecord',
    method: 'post',
    data: query
  })
}

export function getServeList (query) {
  return request({
    url: '/admin/orders/getservelist',
    method: 'post',
    data: query
  })
}

export function getServeType (query) {
  return request({
    url: '/admin/orders/getservetype',
    method: 'post',
    data: query
  })
}

export function getPrescriptionList (query) {
  return request({
    url: '/admin/orders/getprescriptionlist',
    method: 'post',
    data: query
  })
}

export function getExaminationList (query) {
  return request({
    url: '/admin/orders/getexaminationlist',
    method: 'post',
    data: query
  })
}

export function getExamOrderItems (query) {
  return request({
    url: '/admin/orders/getexamorderitems',
    method: 'post',
    data: query
  })
}

export function getTreatmentOrderList (query) {
  return request({
    url: '/admin/orders/gettreatmenordertlist',
    method: 'post',
    data: query
  })
}

export function getTreatmentOrderItems (query) {
  return request({
    url: '/admin/orders/gettreatmentorderitems',
    method: 'post',
    data: query
  })
}

export function setExaminationOrder (query) {
  return request({
    url: '/admin/orders/setexaminationorder',
    method: 'post',
    data: query
  })
}

export function setTreatmentOrder (query) {
  return request({
    url: '/admin/orders/settreatmentorder',
    method: 'post',
    data: query
  })
}

export function getPrescriptionOrderItems (query) {
  return request({
    url: '/admin/orders/getprescriptionorderitems',
    method: 'post',
    data: query
  })
}

export function getWorkByOrderId (query) {
  return request({
    url: '/admin/work/getbyid',
    method: 'post',
    data: query
  })
}

export function getFollowByOrderId (query) {
  return request({
    url: '/admin/work/getfollowbyid',
    method: 'post',
    data: query
  })
}

export function getAttendanceDoctor (query) {
  return request({
    url: '/admin/work/getattendancedoctor',
    method: 'post',
    data: query
  })
}

export function getDistrict (query) {
  return request({
    url: '/admin/work/getdistrict',
    method: 'post',
    data: query
  })
}

export function getDistrictHospital (query) {
  return request({
    url: '/admin/work/getdistricthospital',
    method: 'post',
    data: query
  })
}

export function getGeneralOrNurse (query) {
  return request({
    url: '/admin/work/getgeneralornurse',
    method: 'post',
    data: query
  })
}

export function getHasDoctorSubject (query) {
  return request({
    url: '/admin/work/gethasdoctorsubject',
    method: 'post',
    data: query
  })
}

export function getSubjectDoctor (query) {
  return request({
    url: '/admin/work/getsubjectdoctor',
    method: 'post',
    data: query
  })
}

export function setOrder (query) {
  return request({
    url: '/admin/orders/set',
    method: 'post',
    data: query
  })
}

export function setOrderRemark (query) {
  return request({
    url: '/admin/orders/setremark',
    method: 'post',
    data: query
  })
}

export function setMedicalRecord (query) {
  return request({
    url: '/admin/work/setmedicalrecord',
    method: 'post',
    data: query
  })
}

export function setPrescriptionOrder (query) {
  return request({
    url: '/admin/orders/setprescriptionorder',
    method: 'post',
    data: query
  })
}

export function orderToPaid (query) {
  return request({
    url: '/admin/orders/paid',
    method: 'post',
    data: query
  })
}

export function getRechargeList (query) {
    return request({
        url: '/admin/orders/getrechargelist',
        method: 'post',
        data: query
    })
}

export function setRechargeOrder (query) {
    return request({
        url: '/admin/orders/setrechargeorder',
        method: 'post',
        data: query
    })
}

export function getModificationOrderList (query) {
    return request({
        url: '/admin/orders/getmodificationorderlist',
        method: 'post',
        data: query
    })
}

export function setModificationOrder (query) {
    return request({
        url: '/admin/orders/setmodificationorder',
        method: 'post',
        data: query
    })
}

export function getModificationOrderRecord (query) {
    return request({
        url: '/admin/orders/getmodificationorderrecord',
        method: 'post',
        data: query
    })
}