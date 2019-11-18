<template>
  <d2-container>
    <template slot="header">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增角色</el-button>
    </template>

    <el-table class="table-container" :data="list" border stripe style="width: 100%">
      <el-table-column align="center" prop="name" label="角色名"></el-table-column>
      <el-table-column align="center" prop="description" label="描述"></el-table-column>
      <el-table-column align="center" prop="createDate" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="updateDate" label="最后操作时间"></el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==='1'" style="color: green">启用</span>
          <span v-else style="color: red">禁用</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button @click="handleMenuAccess(scope.row)" type="success" size="mini">菜单权限</el-button>
          <el-button @click="handleButtonAccess(scope.row)" type="danger" size="mini">按钮权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- footer 分页条 -->
    <template slot="footer">
      <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="listQuery.page"
              :page-sizes="[10,20,30, 50]"
              :page-size="listQuery.limit"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </template>

    <el-dialog title="新增角色" :visible.sync="dialogNewFormVisible" width="30%" center>
      <el-form ref="addForm" :model="addForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="addForm.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCreate">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑角色" :visible.sync="dialogEditFormVisible" width="30%" center>
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="editForm.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="editForm.description"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="editForm.status"
            :active-value="'1'"
            :inactive-value="'0'">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
            width="30%"
            title="设置菜单权限"
            :visible.sync="dialogMenuPowerVisible"
            append-to-body>
      <el-tree
              ref="menuTree"
              show-checkbox
              node-key="id"
              :default-checked-keys="setMenuAccess.checkedKey"
              :default-expanded-keys="setMenuAccess.checkedKey"
              :data="setMenuAccess.powerData"
              :props="setMenuAccess.defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelMenuAccess">取 消</el-button>
        <el-button type="primary" @click="submitMenuAccess">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
            width="30%"
            title="设置菜单权限"
            :visible.sync="dialogButtonPowerVisible"
            append-to-body>
      <el-tree
              ref="buttonTree"
              show-checkbox
              node-key="id"
              :default-checked-keys="setButtonAccess.checkedKey"
              :default-expanded-keys="setButtonAccess.checkedKey"
              :data="setButtonAccess.powerData"
              :props="setButtonAccess.defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelButtonAccess">取 消</el-button>
        <el-button type="primary" @click="submitButtonAccess">确 定</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
import { getRoleList, addRole, editRole,
  getAllMenuPower, getAllButtonPower, getAccess, setAccess } from '@/api/role'
import { Message } from 'element-ui'

export default {
  name: 'rolelist',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      dialogNewFormVisible: false,
      dialogEditFormVisible: false,
      dialogMenuPowerVisible: false,
      dialogButtonPowerVisible: false,
      addForm: {
        name: '',
        description: ''
      },
      editForm: {
        id: '',
        name: '',
        description: '',
        status: '1'
      },
      listQuery: {
        'page': 1,
        'limit': 20
      },
      setMenuAccess: {
        rid: '',
        powerData: [],
        checkedKey: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      },
      setButtonAccess: {
        rid: '',
        powerData: [],
        checkedKey: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleCreate () {
      this.dialogNewFormVisible = true
    },
    submitCreate () {
      addRole(this.addForm).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogNewFormVisible = false
        Message.info('新增成功')
      }).catch(() => {
        Message.error('新增失败')
      })
    },
    handleEdit (val) {
      this.editForm.id = val.id
      this.editForm.name = val.name
      this.editForm.description = val.description
      this.editForm.status = val.status

      this.dialogEditFormVisible = true
    },
    submitEdit () {
      editRole(this.editForm).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogEditFormVisible = false
        Message.info('编辑成功')
      }).catch(() => {
        Message.error('编辑失败')
      })
    },
    handleMenuAccess (val) {
      this.setMenuAccess.checkedKey = []
      var params = {
        type: 0
      }
      getAllMenuPower(params).then(response => {
        this.setMenuAccess.powerData = response.data
        this.setMenuAccess.rid = val.id
        this.dialogMenuPowerVisible = true

        var params = {
          rid: val.id,
          type: 1
        }
        getAccess(params).then(response => {
          this.setMenuAccess.checkedKey = response.data
          this.$refs.menuTree.setCheckedKeys(this.setMenuAccess.checkedKey, true)
        })
      })
    },
    cancelMenuAccess () {
      this.dialogMenuPowerVisible = false
    },
    submitMenuAccess () {
      var params = {
        rid: this.setMenuAccess.rid,
        type: 1,
        powerid: this.$refs.menuTree.getCheckedKeys(true)
      }
      setAccess(params).then(response => {
        this.setMenuAccess.rid = ''
        this.setMenuAccess.powerData = []
        this.setMenuAccess.checkedKey = []
        this.dialogMenuPowerVisible = false
        Message.info('设置权限成功')
      })
    },
    handleButtonAccess (val) {
      this.setButtonAccess.checkedKey = []
      var params = {
        type: 0
      }
      getAllButtonPower(params).then(response => {
        this.setButtonAccess.powerData = response.data
        this.setButtonAccess.rid = val.id
        this.dialogButtonPowerVisible = true

        var params = {
          rid: val.id,
          type: 2
        }
        getAccess(params).then(response => {
          this.setButtonAccess.checkedKey = response.data
          this.$refs.buttonTree.setCheckedKeys(this.setButtonAccess.checkedKey, true)
        })
      })
    },
    cancelButtonAccess () {
      this.dialogButtonPowerVisible = false
    },
    submitButtonAccess () {
      var params = {
        rid: this.setButtonAccess.rid,
        type: 2,
        powerid: this.$refs.buttonTree.getCheckedKeys(true)
      }
      setAccess(params).then(response => {
        this.setButtonAccess.rid = ''
        this.setButtonAccess.powerData = []
        this.setButtonAccess.checkedKey = []
        this.dialogButtonPowerVisible = false
        Message.info('设置权限成功')
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      getRoleList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
</style>
