/**
 * 判断是否为空
 */
export function validatenull (val) {
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
      // if (val === 'undefined'){
        return true
      // }
  }
  return false
};