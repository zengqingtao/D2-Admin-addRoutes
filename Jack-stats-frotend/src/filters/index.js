import { papersTypeOptions, channelOptions, orderStatusOptions, serveOrderStatusOptions, consultStatusOptions, prescriptionOrderStatusOptions, examinationOrderStatusOptions, treatmentOrderStatusOptions, staffRoleOptions, payType, rechargeType, payStatus, orderType, showStatus, isStatus, valueType,
    activityShowType,roleType, orderRoleType, numberType, incomeType} from '@/data/data'

function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}
/**
   * 日期格式化
   */
export function dateFormat (date) {
  let format = 'yyyy-MM-dd hh:mm:ss'
  if (date !== 'Invalid Date') {
    var o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      'S': date.getMilliseconds() // millisecond
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  }
  return ''
}
export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function parseTime (time, cFormat) {
  time = Date.parse(new Date(time))
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function formatTime (time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/* 数字 格式化 */
export function nFormatter (num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function html2Text (val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function toThousandslsFilter (num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function parseRole (val) {
  for (var i in staffRoleOptions) {
    if (val === staffRoleOptions[i].value) {
      return staffRoleOptions[i].label
    }
  }
}

export function parsePapersType (val) {
  for (var i in papersTypeOptions) {
    if (val === papersTypeOptions[i].value) {
      return papersTypeOptions[i].label
    }
  }
}

export function parsePayChannel (val) {
  for (var i in channelOptions) {
    if (val === channelOptions[i].value) {
      return channelOptions[i].label
    }
  }
}

export function parseOrderStatus (val) {
  for (var i in orderStatusOptions) {
    if (val === orderStatusOptions[i].value) {
      return orderStatusOptions[i].label
    }
  }
}

export function parseConsultStatus (val) {
  for (var i in consultStatusOptions) {
    if (val == consultStatusOptions[i].value) {
      return consultStatusOptions[i].label
    }
  }
}

export function parsePrescriptionOrderStatus (val) {
  for (var i in prescriptionOrderStatusOptions) {
    if (val === prescriptionOrderStatusOptions[i].value) {
      return prescriptionOrderStatusOptions[i].label
    }
  }
}

export function parseServeOrderStatus (val) {
  for (var i in serveOrderStatusOptions) {
    if (val === serveOrderStatusOptions[i].value) {
      return serveOrderStatusOptions[i].label
    }
  }
}

export function parseExaminationOrderStatus (val) {
  for (var i in examinationOrderStatusOptions) {
    if (val === examinationOrderStatusOptions[i].value) {
      return examinationOrderStatusOptions[i].label
    }
  }
}

export function parseTreatmentOrderStatus (val) {
  for (var i in treatmentOrderStatusOptions) {
    if (val === treatmentOrderStatusOptions[i].value) {
      return treatmentOrderStatusOptions[i].label
    }
  }
}

export function parseTimePeriod (val) {
  if (val === 'morning') {
    return '上午'
  } else if (val === 'afternoon') {
    return '下午'
  } else if (val === 'evening') {
    return '晚上'
  }
}

export function parseMedicineType (val) {
  if (val === 'z') {
    return '中药'
  } else {
    return '西药/中成药/其他'
  }
}

export function parseMedicineSource (val) {
  if (val === 'zx') {
    return '至信'
  } else if (val === 'qlk') {
    return '七乐康'
  } else if (val === 'local') {
    return '本地'
  } else if (val === 'km') {
    return '康美'
  } else if (val === 'yf') {
    return '益丰'
  } else if (val === 'jk') {
      return '君康思博特'
  }
}

export function parsePayType (val) {
    for (let i in payType) {
        if (val === payType[i].value) {
            return payType[i].label
        }
    }
}

export function parsePayStatus (val) {
    for (let i in payStatus) {
        if (val === payStatus[i].value) {
            return payStatus[i].label
        }
    }
}

export function parseRchargeType (val) {
    for (let i in rechargeType) {
        if (val === rechargeType[i].value) {
            return rechargeType[i].label
        }
    }
}

export function parseOrderType(val)
{
    for (let i in orderType) {
        if (val === orderType[i].value) {
            return orderType[i].label
        }
    }
}

export function parseShowStatus(val)
{
    for (let i in showStatus) {
        if (val === showStatus[i].value) {
            return showStatus[i].label
        }
    }
}

export function parseIsStatus(val)
{
    for (let i in isStatus) {
        if (val === isStatus[i].value) {
            return isStatus[i].label
        }
    }
}

export function parseValueType(val)
{
    for (let i in valueType) {
        if (val === valueType[i].value) {
            return valueType[i].label
        }
    }
}

export function parseActivityShowType(val)
{
    for (let i in activityShowType) {
        if (val === activityShowType[i].value) {
            return activityShowType[i].label
        }
    }
}

export function parseRoleType(val)
{
    for (let i in roleType) {
        if (val === roleType[i].value) {
            return roleType[i].label
        }
    }
}

export function parseOrderRoleType(val)
{
    for (let i in orderRoleType) {
        if (val === orderRoleType[i].value) {
            return orderRoleType[i].label
        }
    }
}

export function parseNumberType(val)
{
    for (let i in numberType) {
        if (val === numberType[i].value) {
            return numberType[i].label
        }
    }
}

export function parseIncomeType(val)
{
    for (let i in incomeType) {
        if (val === incomeType[i].value) {
            return incomeType[i].label
        }
    }
}