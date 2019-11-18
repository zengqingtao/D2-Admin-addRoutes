<template>
  <d2-container>
    <!-- header按钮组 -->
    <template slot="header">
      <el-button-group>
        <el-button type="primary" icon="el-icon-plus" @click="handlerAdd">新 增</el-button>
        <el-button type="primary" icon="el-icon-edit" @click="handlerEdit">编 辑</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="handleDelete">删 除</el-button>
      </el-button-group>
    </template>
    <el-row>
      <el-col :span="10">
        <el-tree
          class="filter-tree"
          node-key="id"
          highlight-current
          :data="treeData"
          :default-expanded-keys="aExpandedKeys"
          :filter-node-method="filterNode"
          :props="defaultProps"
          @node-click="getNodeData"
          @node-expand="nodeExpand"
          @node-collapse="nodeCollapse"
        >
        </el-tree>
      </el-col>
      <el-col :span="14">
        <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form">
          <el-form-item label="上级节点" prop="parentName">
            <el-input v-model="form.parentName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="标题名称" prop="name">
            <el-input v-model="form.name" :disabled="formEdit"  placeholder="请输入标题"></el-input>
          </el-form-item>
          <el-form-item label="权限路径" prop="uri">
            <el-input v-model="form.uri" :disabled="formEdit"  placeholder="请输入鉴权的uri地址"></el-input>
          </el-form-item>
          <el-form-item label="排序值" prop="sort">
            <el-input v-model="form.sort" :disabled="formEdit" placeholder="请输入排序，值越大越靠前"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="type">
            <el-select v-model="form.type" :disabled="formEdit" placeholder="请选择菜单类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.type === '1'" label="菜单图标" prop="icon">
            <!-- <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标"></el-input> -->
            <d2-icon-select v-model="form.icon" placeholder="请选择图标"></d2-icon-select>
          </el-form-item>
          <el-form-item v-if="form.type === '1'" label="视图路径" prop="component">
            <el-input v-model="form.component" :disabled="formEdit" placeholder="请输入前端视图的路径"></el-input>
          </el-form-item>
          <el-form-item v-if="form.type === '1'" label="访问地址" prop="path">
            <el-input v-model="form.path" :disabled="formEdit" placeholder="请输入访问接口的地址"></el-input>
          </el-form-item>
          <el-form-item v-if="form.menuId.length > 0" label="状态" prop="status">
            <el-switch
              v-model="form.status"
              :active-value="'1'"
              :inactive-value="'0'"
              :disabled="formEdit">
            </el-switch>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- footer -->
    <template slot="footer" v-if="formStatus === 'create'">
      <div style="margin:-5px; text-align:center">
        <el-button size="small" @click="onCancel" icon="el-icon-close">取 消</el-button>
        <el-button size="small" type="primary" @click="create" icon="el-icon-check">确定新增</el-button>
      </div>
    </template>
    <template slot="footer" v-if="formStatus === 'update'">
      <div style="margin:-5px; text-align:center">
        <el-button size="small" @click="onCancel" icon="el-icon-close">取 消</el-button>
        <el-button size="small" type="primary" @click="update" icon="el-icon-check">确定修改</el-button>
      </div>
    </template>
  </d2-container>
</template>

<script>
import { fetchTree, addObj, delObj, putObj } from '@/api/menu'
export default {
  name: 'user-menu',
  data () {
    return {
      formEdit: true,
      formAdd: true,
      formStatus: '',
      typeOptions: [
        {
          value: '1',
          label: '菜单'
        },
        {
          value: '2',
          label: '按钮'
        }
      ],
      listQuery: {
        name: undefined
      },
      treeData: [],
      oExpandedKey: {
        // key (from tree id) : expandedOrNot boolean
      },
      oTreeNodeChildren: {
        // id1 : [children] (from tree node id1)
        // id2 : [children] (from tree node id2)
      },
      aExpandedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      form: {
        name: '',
        menuId: '',
        uri: '',
        parentId: '',
        parentName: '',
        icon: '',
        sort: 1,
        component: '',
        type: '1',
        path: '',
        status: '1'
      },
      currentId: '0000',
      currentName: '顶级菜单'
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data
        this.formEdit = true
        this.formStatus = ''
      })
    },
    filterNode (value, data) {
      // console.log(value);
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },

    nodeExpand (data) {
      let aChildren = data.children
      if (aChildren.length > 0) {
        this.oExpandedKey[data.id] = true
        this.oTreeNodeChildren[data.id] = aChildren
      }
      this.setExpandedKeys()
    },
    nodeCollapse (data) {
      this.oExpandedKey[data.id] = false
      // 如果有子节点
      this.treeRecursion(this.oTreeNodeChildren[data.id], (oNode) => {
        this.oExpandedKey[oNode.id] = false
      })
      this.setExpandedKeys()
    },
    setExpandedKeys () {
      let oTemp = this.oExpandedKey
      this.aExpandedKeys = []
      for (let sKey in oTemp) {
        if (oTemp[sKey]) {
          this.aExpandedKeys.push(parseInt(sKey))
        }
      }
    },
    treeRecursion (aChildren, fnCallback) {
      if (aChildren) {
        for (let i = 0; i < aChildren.length; ++i) {
          let oNode = aChildren[i]
          fnCallback && fnCallback(oNode)
          this.treeRecursion(oNode.children, fnCallback)
        }
      }
    },

    getNodeData (data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      this.form = {
        name: data.name,
        menuId: data.id,
        uri: data.uri,
        parentId: data.parentID,
        parentName: data.parentID === '0000' ? '顶级菜单' : data.parentName,
        icon: data.icon,
        sort: data.sort,
        component: data.component,
        type: data.type,
        path: data.path,
        status: data.status
      }
      this.currentId = data.id
      this.currentName = data.name
    },
    handlerEdit () {
      if (this.form.menuId) {
        this.formEdit = false
        this.formStatus = 'update'
      }
    },
    handlerAdd () {
      this.resetForm()
      this.formEdit = false
      this.formStatus = 'create'
    },
    handleDelete () {
      if (this.currentId === '0000') {
        return
      }

      this.$confirm('此操作将删除该节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj({ menuId: this.currentId }).then(() => {
          this.getList()
          this.resetForm()
          this.onCancel()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    update () {
      // 参数校验
      if (this.form.name.length === 0) {
        this.$message.error('标题名称不能为空')
        return
      }
      if (this.form.type === '1' && this.form.path.length === 0) {
        this.$message.error('访问路径不能为空')
        return
      }
      if (this.form.type !== '1' && this.form.type !== '2') {
        this.$message.error('菜单类型不合法')
        return
      }
      if (this.form.sort < 0) {
        this.$message.error('排序值应大于0')
        return
      }

      putObj(this.form).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    create () {
      // 参数校验
      if (this.form.name.length === 0) {
        this.$message.error('标题名称不能为空')
        return
      }
      if (this.form.type === '1' && this.form.path.length === 0) {
        this.$message.error('访问路径不能为空')
        return
      }
      if (this.form.type !== '1' && this.form.type !== '2') {
        this.$message.error('菜单类型不合法')
        return
      }
      if (this.form.sort < 0) {
        this.$message.error('排序值应大于0')
        return
      }

      addObj(this.form).then(() => {
        this.getList()
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    onCancel () {
      this.formEdit = true
      this.formStatus = ''
    },
    resetForm () {
      this.form = {
        name: '',
        menuId: '',
        uri: '',
        parentId: this.currentId,
        parentName: this.currentName,
        icon: '',
        sort: 1,
        component: '',
        type: '1',
        path: '',
        status: '1'
      }
    }
  }
}
</script>
