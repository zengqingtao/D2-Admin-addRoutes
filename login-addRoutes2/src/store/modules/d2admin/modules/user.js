export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {}
  },
  // -----------------------↓添加
  mutations:{
    /**
     * 设置access_token
     */
    SET_ACCESS_TOKEN (state, accessToken) {
      state.accessToken = accessToken
      // 持久化
      this.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.accessToken',
        value: accessToken,
        user: true
      })
    },
    /**
     * 设置refresh_token
     */
    SET_REFRESH_TOKEN (state, refreshToken) {
      state.refreshToken = refreshToken
      // 持久化
      this.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.refreshToken',
        value: refreshToken,
        user: true
      })
    },
    /**
     * 设置菜单
     */
    SET_MENU (state, menu) {
      state.menu = menu
      // 持久化
      this.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.menu',
        value: menu,
        user: true
      })
    },
    SET_USER_INFO (state, info) {
      // store 赋值
      state.info = info
      // 持久化
      this.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.info',
        value: info,
        user: true
      })
    },
    /**
     * 设置角色
     */
    SET_ROLES (state, roles) {
      state.roles = roles
      // 持久化
      this.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.roles',
        value: roles,
        user: true
      })
    },
    /**
     * 设置角色名称
     */
    SET_ROLENAME (state, rolename) {
      state.rolename = rolename
      // 持久化
      this.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.rolename',
        value: rolename,
        user: true
      })
    },
        /**
     * 设置数据权限
     */
    SET_PERMISSIONS (state, permissions) {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true
      }
      state.permissions = list
      // 持久化
      this.dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'user.permissions',
        value: permissions,
        user: true
      })
    }
  },
  // -----------------------------------↑添加
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} state vuex state
     * @param {*} info info
     */
    set ({ state, dispatch }, info) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = info
        // 持久化
        await dispatch('d2admin/db/set', {
          dbName: 'sys',
          path: 'user.info',
          value: info,
          user: true
        }, { root: true })
        // end
        resolve()
      })
    },
    /**
     * @description 从数据库取用户数据
     * @param {Object} state vuex state
     */
    load ({ state, dispatch }) {
      return new Promise(async resolve => {
        // store 赋值
        state.info = await dispatch('d2admin/db/get', {
          dbName: 'sys',
          path: 'user.info',
          defaultValue: {},
          user: true
        }, { root: true })
        // end
        resolve()
      })
    }
  }
}
