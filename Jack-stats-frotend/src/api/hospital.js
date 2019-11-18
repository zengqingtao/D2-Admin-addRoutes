import request from '@/plugin/axios'

export function getHospitalList (query) {
  return request({
    url: '/admin/hospital/getlist',
    method: 'post',
    data: query
  })
}

export function getHospitalOption (query) {
  return request({
    url: '/admin/hospital/getoption',
    method: 'post',
    data: query
  })
}

export function getHospital (query) {
  return request({
    url: '/admin/hospital/get',
    method: 'post',
    data: query
  })
}

export function getHospitalConfig (query) {
  return request({
    url: '/admin/hospital/getconfig',
    method: 'post',
    data: query
  })
}

export function setHospitalConfig (query) {
  return request({
    url: '/admin/hospital/setconfig',
    method: 'post',
    data: query
  })
}

export function setHospital (query) {
  return request({
    url: '/admin/hospital/set',
    method: 'post',
    data: query
  })
}

export function getSubjectList (query) {
  return request({
    url: '/admin/subject/getlist',
    method: 'post',
    data: query
  })
}

export function getLevel1SubjectList (query) {
  return request({
    url: '/admin/subject/getlevel1all',
    method: 'post',
    data: query
  })
}

export function setSubject (query) {
  return request({
    url: '/admin/subject/set',
    method: 'post',
    data: query
  })
}

export function delSubject (query) {
  return request({
    url: '/admin/subject/del',
    method: 'post',
    data: query
  })
}

export function getCheckStoresList (query) {
  return request({
    url: '/admin/checkstores/getlist',
    method: 'post',
    data: query
  })
}

export function getCheckStores (query) {
  return request({
    url: '/admin/checkstores/get',
    method: 'post',
    data: query
  })
}

export function setCheckStores (query) {
  return request({
    url: '/admin/checkstores/set',
    method: 'post',
    data: query
  })
}

export function getMedicineClassificationList (query) {
  return request({
    url: '/admin/medicineclassification/getlist',
    method: 'post',
    data: query
  })
}

export function getMedicineClassification (query) {
  return request({
    url: '/admin/medicineclassification/get',
    method: 'post',
    data: query
  })
}

export function setMedicineClassification (query) {
  return request({
    url: '/admin/medicineclassification/set',
    method: 'post',
    data: query
  })
}

export function getExaminationsList (query) {
  return request({
    url: '/admin/examinations/getlist',
    method: 'post',
    data: query
  })
}

export function getExaminations (query) {
  return request({
    url: '/admin/examinations/get',
    method: 'post',
    data: query
  })
}

export function setExaminations (query) {
  return request({
    url: '/admin/examinations/set',
    method: 'post',
    data: query
  })
}

export function getMedicineList (query) {
  return request({
    url: '/admin/medicine/getlist',
    method: 'post',
    data: query
  })
}

export function getMedicine (query) {
  return request({
    url: '/admin/medicine/get',
    method: 'post',
    data: query
  })
}

export function setMedicine (query) {
  return request({
    url: '/admin/medicine/set',
    method: 'post',
    data: query
  })
}

export function getOrganizationsList (query) {
  return request({
    url: '/admin/organizations/getlist',
    method: 'post',
    data: query
  })
}

export function setOrganization (query) {
  return request({
    url: '/admin/organizations/set',
    method: 'post',
    data: query
  })
}

export function getTreatmentsList (query) {
  return request({
    url: '/admin/treatments/getlist',
    method: 'post',
    data: query
  })
}

export function setTreatment (query) {
  return request({
    url: '/admin/treatments/set',
    method: 'post',
    data: query
  })
}

export function getExaminationClassificationList (query) {
  return request({
    url: '/admin/examinations/getclassificationlist',
    method: 'post',
    data: query
  })
}

export function getAllExaminationClassification (query) {
  return request({
    url: '/admin/examinations/getallclassification',
    method: 'post',
    data: query
  })
}

export function setExaminationClassification (query) {
  return request({
    url: '/admin/examinations/setclassification',
    method: 'post',
    data: query
  })
}

export function getWeekAttendance (query) {
  return request({
    url: '/admin/attendance/getweekattendance',
    method: 'post',
    data: query
  })
}

export function setAttendance (query) {
  return request({
    url: '/admin/attendance/set',
    method: 'post',
    data: query
  })
}

export function getAttendanceByAble (query) {
  return request({
    url: '/admin/attendance/getbyableanddate',
    method: 'post',
    data: query
  })
}

export function getProductTypeList (query) {
  return request({
    url: '/admin/type/getproducttypelist',
    method: 'post',
    data: query
  })
}

export function setProductType (query) {
  return request({
    url: '/admin/type/setproducttype',
    method: 'post',
    data: query
  })
}

export function getServeTypeList (query) {
  return request({
    url: '/admin/type/getservetypelist',
    method: 'post',
    data: query
  })
}

export function setServeType (query) {
  return request({
    url: '/admin/type/setservetype',
    method: 'post',
    data: query
  })
}

export function getCommonExaminationList (query) {
  return request({
    url: '/admin/examinations/getcommonlist',
    method: 'post',
    data: query
  })
}

export function setCommonExamination (query) {
  return request({
    url: '/admin/examinations/setcommonorder',
    method: 'post',
    data: query
  })
}

export function getCommonExamination (query) {
  return request({
    url: '/admin/examinations/getcommonorder',
    method: 'post',
    data: query
  })
}

export function getCommonTreatmentList (query) {
  return request({
    url: '/admin/treatments/getcommonlist',
    method: 'post',
    data: query
  })
}

export function setCommonTreatment (query) {
  return request({
    url: '/admin/treatments/setcommonorder',
    method: 'post',
    data: query
  })
}

export function getCommonTreatment (query) {
  return request({
    url: '/admin/treatments/getcommonorder',
    method: 'post',
    data: query
  })
}

export function setCommonServeOrder (query) {
  return request({
    url: '/admin/serveorder/setcommonorder',
    method: 'post',
    data: query
  })
}

export function getCommonServeOrderList (query) {
  return request({
    url: '/admin/serveorder/getcommonlist',
    method: 'post',
    data: query
  })
}

export function getCommonServeOrder (query) {
  return request({
    url: '/admin/serveorder/getcommonorder',
    method: 'post',
    data: query
  })
}

export function setCommonPrescriptionOrder (query) {
  return request({
    url: '/admin/prescriptionorder/setcommonorder',
    method: 'post',
    data: query
  })
}

export function getCommonPrescriptionOrderList (query) {
  return request({
    url: '/admin/prescriptionorder/getcommonlist',
    method: 'post',
    data: query
  })
}

export function getCommonPrescriptionOrder (query) {
  return request({
    url: '/admin/prescriptionorder/getcommonorder',
    method: 'post',
    data: query
  })
}

export function getHospitalConfigOption (query) {
    return request({
        url: '/admin/hospital/gethospitalconfigoption',
        method: 'post',
        data: query
    })
}