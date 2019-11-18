import request from '@/plugin/axios'

export function exportTreatmentTmpl (query) {
  return request({
    url: '/admin/excel/exporttreatmenttmpl',
    method: 'post',
    data: query
  })
}

export function exportExaminationTmpl (query) {
  return request({
    url: '/admin/excel/exportexaminationtmpl',
    method: 'post',
    data: query
  })
}

export function exportMedicineTmpl (query) {
  return request({
    url: '/admin/excel/exportmedicinetmpl',
    method: 'post',
    data: query
  })
}

export function updateTreatmentTmpl (query) {
  return request({
    url: '/admin/excel/updatetreatmenttmpl',
    method: 'post',
    data: query
  })
}

export function updateExaminationTmpl (query) {
  return request({
    url: '/admin/excel/updateexaminationtmpl',
    method: 'post',
    data: query
  })
}

export function updateMedicineTmpl (query) {
  return request({
    url: '/admin/excel/updatemedicinetmpl',
    method: 'post',
    data: query
  })
}

export function exportTreatmentData (query) {
  return request({
    url: '/admin/excel/exporttreatment',
    method: 'post',
    data: query
  })
}

export function exportExaminationData (query) {
  return request({
    url: '/admin/excel/exportexamination',
    method: 'post',
    data: query
  })
}

export function exportMedicineData (query) {
  return request({
    url: '/admin/excel/exportmedicine',
    method: 'post',
    data: query
  })
}

export function importTreatmentData (query) {
  return request({
    url: '/admin/excel/importtreatment',
    method: 'post',
    data: query
  })
}

export function importExaminationData (query) {
  return request({
    url: '/admin/excel/importexamination',
    method: 'post',
    data: query
  })
}

export function importMedicineData (query) {
  return request({
    url: '/admin/excel/importmedicine',
    method: 'post',
    data: query
  })
}

export function updateTreatmentData (query) {
  return request({
    url: '/admin/excel/updatetreatment',
    method: 'post',
    data: query
  })
}

export function updateExaminationData (query) {
  return request({
    url: '/admin/excel/updateexamination',
    method: 'post',
    data: query
  })
}

export function updateMedicineData (query) {
  return request({
    url: '/admin/excel/updatemedicine',
    method: 'post',
    data: query
  })
}
