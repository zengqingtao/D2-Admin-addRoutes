<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button>
      <el-input v-model="listQuery.search" style="width: 180px;margin-left: 10px;" placeholder="输入名称搜索" clearable></el-input>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="id" label="ID"></el-table-column>
      <el-table-column align="center" label="标志">
        <template slot-scope="scope">
          <img :src="scope.row.logo" style="width:50px;height:50px;" v-if="scope.row.logo != ''">
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="sys_type" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.sys_type == 0">简单版his</span>
          <span v-if="scope.row.sys_type == 1">专业版his</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="district_id" label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.district_id | parseCity }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="warning" @click="handleConfig(scope.row)">配置</el-button>
          <el-button size="mini" type="danger" @click="handleHide(scope.row)">删除</el-button>
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
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin: -10px;">
        </el-pagination>
    </template>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="30%" center :close-on-click-modal="false">
      <el-form ref="hospitalForm" :model="hospitalForm" label-width="30%">
        <el-form-item label="名称">
          <el-input v-model="hospitalForm.name" style="width: 80%;" placeholder="请输入医院名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="标志" prop="logo">
          <uploadimg ref="logouploadimg" v-model="hospitalForm.logo" :max="1" :filelist="fileList"></uploadimg>
        </el-form-item>
        <el-form-item label="城市" prop="district_id">
          <el-cascader
            size="large"
            :options="options"
            v-model="hospitalForm.district_id_arr"
            @change="handleCityChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="hospitalForm.sys_type">
            <el-option label="简单版his" value="0"></el-option>
            <el-option label="专业版his" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSet">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogConfigTitle" :visible.sync="dialogConfigVisible" width="30%" center :close-on-click-modal="false">
      <el-form ref="hospitalForm" :model="hospitalConfig" label-width="30%">
        <el-form-item label="名称">
          <el-input v-model="hospitalConfig.hospital_name" readonly></el-input>
        </el-form-item>
        <el-form-item label="配置url">
          <el-input v-model="hospitalConfig.url"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogConfigVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSetConfig">确 定</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
import { getHospitalList, getHospital, setHospital, getHospitalConfig, setHospitalConfig } from '@/api/hospital'
import { Message } from 'element-ui'
import uploadimg from '@/components/lianhe/uploadimg'
import { regionData, CodeToText } from 'element-china-area-data'
import { hideHospital } from '@/api/hidedel'
export default {
  name: 'hospitallist',
  components: {
    uploadimg
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': ''
      },
      options: regionData,
      selectedOptions: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      dialogConfigVisible: false,
      dialogConfigTitle: '',
      hospitalForm: {
        id: '',
        name: '',
        logo: '',
        district_id: '',
        sys_type: '0',
        district_id_arr: [],
      },
      fileList: [],
      hospitalConfig: {
        id: '',
        hospital_id: '',
        hospital_name: '',
        config: '',
        type: 1,
        url: ''
      }
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  filters: {
    parseCity (val) {
      if (val !== null) {
        var arr = val.split(',')
        var tmp = ''
        for (var i in arr) {
          tmp += CodeToText[arr[i]]
        }
        return tmp
      }
    }
  },
  methods: {
    submitSetConfig () {
      var form = {
        id: this.hospitalConfig.id,
        hospital_id: this.hospitalConfig.hospital_id,
        config: JSON.stringify({url: this.hospitalConfig.url}),
        type: 1
      }
      setHospitalConfig(form).then(response => {
        if (response.code) {
          this.dialogConfigVisible = false
        }
      })
    },
    handleConfig (row) {
      getHospitalConfig({hospital_id: row.id}).then(response => {
        if (response.data.id != undefined) {
          this.hospitalConfig = response.data
          var config = JSON.parse(response.data.config)
          this.hospitalConfig.url = config.url
        } else {
          this.hospitalConfig.id = ''
          this.hospitalConfig.url = ''
        }
        this.dialogConfigTitle = '配置'
        this.dialogConfigVisible = true
        this.hospitalConfig.hospital_id = row.id
        this.hospitalConfig.hospital_name = row.name
      })
    },
    handleHide (row) {
      this.$confirm('确认删除此医院？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideHospital({hospital_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleCityChange (value) {
      this.hospitalForm.district_id = this.hospitalForm.district_id_arr.join(',')
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.hospitalForm = {
        id: '',
        name: '',
        logo: '',
        sys_type: '0',
        district_id: '',
        district_id_arr: []
      }
      this.fileList = []
      var _this = this
      var t = setTimeout(function () {
        _this.$refs.logouploadimg.setFile(_this.fileList)
        clearTimeout(t)
      }, 200)
      this.dialogFormTitle = '新增医院'
    },
    handleEdit (row) {
      var _this = this
      this.hospitalForm.id = row.id
      this.hospitalForm.name = row.name
      this.hospitalForm.logo = row.logo
      this.hospitalForm.sys_type = row.sys_type
      this.hospitalForm.district_id = row.district_id
      this.hospitalForm.district_id_arr = row.district_id.split(',')
      this.dialogFormTitle = '修改医院'
      this.fileList = (this.hospitalForm.logo == '' ? [] : [{name: 'logo', url: this.hospitalForm.logo}])
      var t = setTimeout(function () {
        _this.$refs.logouploadimg.setFile(_this.fileList)
        clearTimeout(t)
      }, 200)
      this.dialogFormVisible = true
    },
    submitSet () {
      if (this.hospitalForm.name.length === 0) {
        Message.error('名称不能为空')
        return
      }

      setHospital(this.hospitalForm).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogFormVisible = false
        if (this.hospitalForm.id === '') {
          Message.info('新增成功')
        } else {
          Message.info('修改成功')
        }
      }).catch((e) => {
        Message.error(e.msg)
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.fetchData()
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
      getHospitalList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
