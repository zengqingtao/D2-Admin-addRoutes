import request from '@/plugin/axios'

/**
 * 登录
 * @param {用户名} username
 * @param {密码} password
 */
export const loginByUsername = (data) => { //--------------修改
  return request({
    url: '/login',//admin/auth/login--------------修改
    // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method:'post',
    data:data
  })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request({
    url: '/getUserInfo',//--------------修改
    method: 'get'
  })
}

/**
 * 退出登录
 */
export const logout = () => {
  return request({
    url: '/logout',//--------------修改
    method: 'post'
  })
}


export const checkIsLogined = (data) => {
  return request({
    url: '/checklogined',//--------------修改
    method: 'post',
    data: data
  })
}
