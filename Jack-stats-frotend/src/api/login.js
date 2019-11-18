import request from '@/plugin/axios'

/**
 * 登录
 * @param {用户名} username
 * @param {密码} password
 */
export const loginByUsername = (username, password, url) => {
  return request({
    url: '/admin/auth/login',
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method: 'post',
    data: { username, password, url }
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request({
    url: '/admin/auth/getuserinfo',
    method: 'get'
  })
}

/**
 * 退出登录
 */
export const logout = () => {
  return request({
    url: '/admin/auth/logout',
    method: 'post'
  })
}


export const checkIsLogined = (data) => {
  return request({
    url: '/admin/auth/checklogined',
    method: 'post',
    data: data
  })
}
