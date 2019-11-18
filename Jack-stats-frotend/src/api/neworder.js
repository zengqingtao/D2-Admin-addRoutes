import request from '@/plugin/axios'

export function setMedicalCard (query) {
  return request({
    url: '/admin/users/set',
    method: 'post',
    data: query
  })
}

export function getTypes (query) {
  return request({
    url: '/admin/type/gettypes',
    method: 'post',
    data: query
  })
}

export function addServeOrder (query) {
  return request({
    url: '/admin/neworder/serveorder',
    method: 'post',
    data: query
  })
}

export function addPrescriptionOrder (query) {
  return request({
    url: '/admin/neworder/prescriptionorder',
    method: 'post',
    data: query
  })
}

export function addExaminationOrder (query) {
  return request({
    url: '/admin/neworder/examinationorder',
    method: 'post',
    data: query
  })
}

export function addTreatmentOrder (query) {
  return request({
    url: '/admin/neworder/treatmentorder',
    method: 'post',
    data: query
  })
}

export function addOrder (query) {
  return request({
    url: '/admin/neworder/order',
    method: 'post',
    data: query
  })
}

export function getAttendancesDistrict (query) {
  return request({
    url: '/admin/neworder/getattendancesdistrict',
    method: 'post',
    data: query
  })
}

export function getAttendancesHospitalByDistrict (query) {
  return request({
    url: '/admin/neworder/getattendanceshospitalbydistrict',
    method: 'post',
    data: query
  })
}

export function getAttendancesSubjectByHospital (query) {
  return request({
    url: '/admin/neworder/getattendancessubjectbyhospital',
    method: 'post',
    data: query
  })
}

export function getAttendancesDoctorBySubject (query) {
  return request({
    url: '/admin/neworder/getattendancesdoctorbysubject',
    method: 'post',
    data: query
  })
}

export function getAttendancesByDoctor (query) {
  return request({
    url: '/admin/neworder/getattendancesbydoctor',
    method: 'post',
    data: query
  })
}

export function getPrescriptionHistoryList (query) {
  return request({
    url: '/admin/history/prescriptionorder',
    method: 'post',
    data: query
  })
}

export function getExaminationHistoryList (query) {
  return request({
    url: '/admin/history/examination',
    method: 'post',
    data: query
  })
}

export function getTreatmentHistoryList (query) {
  return request({
    url: '/admin/history/treatment',
    method: 'post',
    data: query
  })
}

export function getICDList (query) {
  return request({
    url: '/admin/icd/getlist',
    method: 'post',
    data: query
  })
}
