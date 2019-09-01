import cookies from './util.cookies'
import db from './util.db'
import log from './util.log'
import { validatenull } from './validate'  //-------引入


const util = {
  cookies,
  db,
  log
}
/**
 * 获取access_token
 */
//----------------------------------------------↓添加
const TokenKey = 'x-access-token'

util.getToken = function () {
  return util.cookies.get(TokenKey)
}
/**
 * 设置access_token
 */
util.setToken = function (token) {
  util.cookies.set(TokenKey, token)
}
//----------------------------------------------↑添加
/**
 * @description 更新标题
 * @param {String} title 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'D2Admin'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
 * @description 打开新页面
 * @param {String} url 地址
 */
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}
//--------------------↓添加
/**
 * 通过用户菜单生成路由信息
 *
 * @param {用户菜单} aMenu
 */
util.formatRoutes = function (aMenu, parentPath) {
  console.log("formatRoutes------------aMenu:",aMenu);
  // console.log("formatRoutes------------parentPath:",parentPath);
  if (validatenull(aMenu)) {
    console.log("经过-----------------------------");
    return []
  }
  const aRouter = []
  aMenu.forEach(oMenu => {
    const {
      path,
      component,
      name,
      icon,
      children
    } = oMenu
    console.log("oMenu:",oMenu);
    console.log(children);
    if (!validatenull(component)) {
      const oRouter = {
        path: parentPath ? parentPath + '/' + path : path,
        component (resolve) {
          let componentPath = ''
          if (component === 'Layout') {
            require(['@/layout/header-aside'], resolve)
            return
          } else {
            componentPath = component
          }
          require([`../${componentPath}.vue`], resolve)
        },
        name: name,
        icon: icon,
        children: validatenull(children) ? [] : util.formatRoutes(children, path),
        meta: {
          requiresAuth: true,
          title: name
        }
      }
      aRouter.push(oRouter)
    }
  })
  return aRouter
}
// ---------------------↑添加
export default util
