import request from '@/plugin/axios'

export function hideOrder (query) {
  return request({
    url: '/admin/hide/order',
    method: 'post',
    data: query
  })
}

export function hidePrescriptionOrder (query) {
  return request({
    url: '/admin/hide/prescriptionorder',
    method: 'post',
    data: query
  })
}

export function hideExaminationOrder (query) {
  return request({
    url: '/admin/hide/examinationorder',
    method: 'post',
    data: query
  })
}

export function hideTreatmentOrder (query) {
  return request({
    url: '/admin/hide/treatmentorder',
    method: 'post',
    data: query
  })
}

export function hideServeOrder (query) {
  return request({
    url: '/admin/hide/serveorder',
    method: 'post',
    data: query
  })
}

export function hideAdmin (query) {
  return request({
    url: '/admin/hide/admin',
    method: 'post',
    data: query
  })
}

export function hidePatient (query) {
  return request({
    url: '/admin/hide/patient',
    method: 'post',
    data: query
  })
}

export function hideUser (query) {
  return request({
    url: '/admin/hide/user',
    method: 'post',
    data: query
  })
}

export function hideHospital (query) {
  return request({
    url: '/admin/hide/hospital',
    method: 'post',
    data: query
  })
}

export function hideCheckstore (query) {
  return request({
    url: '/admin/hide/checkstore',
    method: 'post',
    data: query
  })
}

export function hideCommonTreatment (query) {
  return request({
    url: '/admin/hide/commontreatment',
    method: 'post',
    data: query
  })
}

export function hideCommonExamination (query) {
  return request({
    url: '/admin/hide/commonexamination',
    method: 'post',
    data: query
  })
}

export function hideCommonServeOrder (query) {
  return request({
    url: '/admin/hide/commonserveorder',
    method: 'post',
    data: query
  })
}

export function hideCommonPrescriptionOrder (query) {
  return request({
    url: '/admin/hide/commonprescriptionorder',
    method: 'post',
    data: query
  })
}

export function hideCheckClassification (query) {
  return request({
    url: '/admin/hide/checkclassification',
    method: 'post',
    data: query
  })
}

export function hideMedicineClassification (query) {
  return request({
    url: '/admin/hide/medicineclassification',
    method: 'post',
    data: query
  })
}

export function hideServeType (query) {
  return request({
    url: '/admin/hide/servetype',
    method: 'post',
    data: query
  })
}

export function hideProductType (query) {
  return request({
    url: '/admin/hide/producttype',
    method: 'post',
    data: query
  })
}

export function hideExamination (query) {
  return request({
    url: '/admin/hide/examination',
    method: 'post',
    data: query
  })
}

export function hideTreatment (query) {
  return request({
    url: '/admin/hide/treatment',
    method: 'post',
    data: query
  })
}

export function hideMedicine (query) {
  return request({
    url: '/admin/hide/medicine',
    method: 'post',
    data: query
  })
}


export function offSaleTreatment (query) {
  return request({
    url: '/admin/offsale/treatment',
    method: 'post',
    data: query
  })
}

export function offSaleExamination (query) {
  return request({
    url: '/admin/offsale/examination',
    method: 'post',
    data: query
  })
}

export function offSaleMedicine (query) {
  return request({
    url: '/admin/offsale/medicine',
    method: 'post',
    data: query
  })
}

export function onSaleTreatment (query) {
  return request({
    url: '/admin/onsale/treatment',
    method: 'post',
    data: query
  })
}

export function onSaleExamination (query) {
  return request({
    url: '/admin/onsale/examination',
    method: 'post',
    data: query
  })
}

export function onSaleMedicine (query) {
  return request({
    url: '/admin/onsale/medicine',
    method: 'post',
    data: query
  })
}

export function ableUser (query) {
  return request({
    url: '/admin/able/user',
    method: 'post',
    data: query
  })
}

export function ableAdmin (query) {
  return request({
    url: '/admin/able/admin',
    method: 'post',
    data: query
  })
}

export function ablePatient (query) {
  return request({
    url: '/admin/able/patient',
    method: 'post',
    data: query
  })
}

export function disableUser (query) {
  return request({
    url: '/admin/disable/user',
    method: 'post',
    data: query
  })
}

export function disableAdmin (query) {
  return request({
    url: '/admin/disable/admin',
    method: 'post',
    data: query
  })
}

export function disablePatient (query) {
  return request({
    url: '/admin/disable/patient',
    method: 'post',
    data: query
  })
}
