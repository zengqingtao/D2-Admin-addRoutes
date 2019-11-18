/**
 * 合法uri
 * @param textval
 * @returns {boolean}
 */
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/**
 * 小写字母
 * @param str
 * @returns {boolean}
 */
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 大写字母
 * @param str
 * @returns {boolean}
 */
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 大小写字母
 * @param str
 * @returns {boolean}
 */
export function validatAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 校验手机号 */
export function validatPhone (phone) {
  const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
  return reg.test(phone)
}

/**
 * 0到1之间包括0和1的最多两位小数
 * @param number
 * @returns {boolean}
 */
export function checkRate (number) {
  if (number < 0 || number > 1) {
    return false
  } else if (number === 0 || number === 1) {
    return true
  } else {
    return number.match(/^[0-9]+(.[0-9]{2})?$/) || number.match(/^[0-9]+(.[0-9]{1})?$/)
  }
}

/**
 * 手续费检查
 * 0到1之间包括0和1的最多三位小数
 * @param number
 * @returns {boolean}
 */
export function checkRent (number) {
  if (number < 0 || number > 1) {
    return false
  } else if (number === 0 || number === 1) {
    return true
  } else {
    return number.match(/^[0-9]+(.[0-9]{3})?$/) || number.match(/^[0-9]+(.[0-9]{2})?$/) || number.match(/^[0-9]+(.[0-9]{1})?$/)
  }
}

/**
 * 判断数组元素是否有重复
 * @param array
 * @returns {boolean}
 */
export function checkArrayRepeat (array) {
  var newArray = array.sort()
  for (var i = 0; i < newArray.length; i++) {
    if (newArray[i] === newArray[i + 1]) {
      return true
    }
  }

  return false
}

/**
 * 检查正整数
 * @param number
 * @returns {boolean}
 */
export function checkPositiveInt (number) {
  if (number < 1) {
    return false
  } else {
    const reg = /^[0-9]*[1-9][0-9]*$/
    return reg.test(number)
  }
}

/**
 * 检查整数
 * @param number
 * @returns {boolean}
 */
export function checkInt (number) {
  const reg = /^[-]?\d+$/
  return reg.test(number)
}
