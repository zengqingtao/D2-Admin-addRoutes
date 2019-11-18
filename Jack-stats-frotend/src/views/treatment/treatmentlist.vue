<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button>
      <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;" placeholder="输入名称搜索" clearable></el-input>
      <el-select v-model="listQuery.organization_id" placeholder="请选择检查机构" @change="toggleOrganizationOption(listQuery.organization_id)" v-if="rolename != '机构管理员'">
        <el-option label="全部机构" value=""></el-option>
        <el-option
          v-for="item in organizationsList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.checkstores" placeholder="请选择门店" v-if="rolename != '机构管理员'">
        <el-option label="全部门店" value=""></el-option>
        <el-option
          v-for="item in sourceCheckStoresList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.type" placeholder="请选择检查类型">
        <el-option label="全部检查类型" value=""></el-option>
        <el-option
          v-for="item in examinationsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <br/>
      <div style="margin-left: 10px;margin-top:10px;">
        <el-button type="primary" plain @click="exportExcelTmpl()">导入模板</el-button>
        <el-button type="success" plain @click="dialogExportVisible = true, dialogExcelTitle = '导入项目'">导入数据</el-button>
        <el-button type="primary" plain @click="updateExcelTmpl()">修改模板</el-button>
        <el-button type="success" plain @click="dialogExportVisible = true, dialogExcelTitle = '批量修改治疗项目'">批量修改</el-button>
        <el-button type="primary" plain @click="dialogExportVisible = true, dialogExcelTitle = '导出项目'">导出项目</el-button>  
      </div>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="id" label="序号"></el-table-column>
      <el-table-column align="center" prop="code" label="编号"></el-table-column>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="sample" label="标本类型"></el-table-column>
      <el-table-column align="center" prop="type" label="类型"></el-table-column>
      <el-table-column align="center" prop="price" label="价格"></el-table-column>
      <el-table-column align="center" prop="organization_name" label="检查机构"></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">查看</el-button>
          <el-button size="mini" type="warning" v-if="scope.row.deleted_at == null || scope.row.deleted_at == ''" @click="handleOffSale(scope.row)">下架</el-button>
          <el-button size="mini" type="success" v-if="scope.row.deleted_at != null && scope.row.deleted_at != ''" @click="handleOnSale(scope.row)">上架</el-button>
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

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="70%" center :close-on-click-modal="false">
      <el-form ref="hospitalForm" :model="treatmentForm" label-width="15%">
        <el-form-item label="编号">
          <el-input  v-model="treatmentForm.code" placeholder="编号" clearable style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="treatmentForm.name" placeholder="请输入治疗项目名称" clearable  style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="标本类型">
          <el-input  v-model="treatmentForm.sample" placeholder="标本类型" clearable style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="treatmentForm.type" placeholder="请选择" style="width:400px">
            <el-option
              v-for="item in examinationsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-input  v-model="treatmentForm.price" placeholder="价格" type="number" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="原价">
          <el-input  v-model="treatmentForm.original_price" placeholder="原价" type="number" style="width:400px"></el-input>
        </el-form-item>
        <!--<el-form-item label="渠道指数">-->
          <!--<el-input  v-model="treatmentForm.index" placeholder="渠道指数" type="number" style="width:400px" readonly></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="邀新用户指数">
          <el-input  v-model="treatmentForm.user_index" placeholder="邀新用户指数" type="number" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="邀新医生指数">
          <el-input  v-model="treatmentForm.employee_index" placeholder="邀新医生指数" type="number" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="开单指数">
          <el-input  v-model="treatmentForm.order_index" placeholder="开单指数" type="number" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="成本指数">
          <el-input  v-model="treatmentForm.cost_index" placeholder="成本指数" type="number" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="诊所指数">
          <el-input  v-model="treatmentForm.clinic_index" placeholder="诊所指数" type="number" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="平台费率">
          <el-input  v-model="treatmentForm.platform_rate" placeholder="平台费率" type="number" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="检查机构" v-if="rolename != '机构管理员'">
          <el-select v-model="treatmentForm.organization_id" placeholder="请选择" @change="toggleOrganizationOption(treatmentForm.organization_id, 1)">
            <el-option
              key="0"
              label="全部"
              value="0">
            </el-option>
            <el-option
              v-for="item in organizationsList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查门店" v-if="rolename != '机构管理员' && sourceCheckStoresList.length > 0">
          <el-checkbox-group v-model="tmpCb">
            <el-checkbox v-for="cb in sourceCheckStoresList" :label="cb.id" :value="cb.id">{{ cb.name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="检查分类">
          <el-tag style="margin-right: 10px;" type="primary" closable v-for="(tag, index) in sourceCheckclassifications" :gutter="20" @close="handleCloseTag(tag, index)">{{ tag.name }}</el-tag>
          <el-button type="primary" @click="handleCheckClassification">新增</el-button>
        </el-form-item>
        <el-form-item label="封面" prop="surface">
          <uploadimg ref="uploadimg" v-model="treatmentForm.surface" :max="1" :filelist="fileList"></uploadimg>
        </el-form-item>
        <el-form-item label="详情">
          <!-- <el-input type="textarea" v-model="treatmentForm.detail"></el-input> -->
          <Editor v-model="treatmentForm.detail"></Editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSet">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog :title="dialogExcelTitle" :visible.sync="dialogExportVisible" width="30%" center :close-on-click-modal="false">
      选择机构：
      <el-select v-model="export_organization_id" style="margin-bottom:20px;">
        <el-option label="请选择" value="0"></el-option>
        <el-option :label="item.name" :value="item.id" v-for="item in organizationsList"></el-option>
      </el-select>
      <br/>
      <div style="text-align:center;">
        <el-button v-if="dialogExcelTitle == '导出项目'" type="primary" style="margin-left:20px" @click="exportData()">导出</el-button>
        <el-upload v-if="dialogExcelTitle == '导入项目'" 
          :auto-upload="true"
          :action="uploadExcelUrl"
          :on-success="uploadSuccess"
          :limit="1"
          :file-list="[]"
          :data="uploadData">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-upload v-if="dialogExcelTitle == '批量修改治疗项目'" 
          :auto-upload="true"
          :action="updateExcelDataUrl"
          :on-success="uploadSuccess"
          :limit="1"
          :file-list="[]">
          <el-button size="small" type="primary">点击上传修改</el-button>
        </el-upload>
      </div>
    </el-dialog>

    <checkclassification ref="checkclassification" @setCheckclassfication="setCheckclassfication"></checkclassification>
  </d2-container>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { mapState, mapActions } from 'vuex'
import { getTreatmentsList, setTreatment, getCheckStoresList, getOrganizationsList, getAllExaminationClassification, getHospitalOption } from '@/api/hospital'
import { examinationsOptions } from '@/data/data'
import { Message } from 'element-ui'
import checkclassification from '@/components/lianhe/checkclassification'
import { hideTreatment, offSaleTreatment, onSaleTreatment } from '@/api/hidedel'
import uploadimg from '@/components/lianhe/uploadimg'
import { exportTreatmentTmpl, updateTreatmentTmpl, exportTreatmentData, importTreatmentData, updateTreatmentData } from '@/api/excel'
export default {
  name: 'treatmentlist',
  components: {
    checkclassification,
    Editor,
    uploadimg
  },
  computed: {
    ...mapState('d2admin/user', [
      'rolename'
    ])
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'source': '',
        'type': '',
        'checkstores': ''
      },
      hospitalOptions: [],
      organizationsList: [],
      checkStoresList: [],
      sourceCheckStoresList: [],
      checkStoresOptions: [],
      examinationsOptions: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      dialogExportVisible: false,
      dialogExcelTitle: '',
      treatmentForm: {
        id: '',
        name: '',
        code: '',
        sample: '',
        type: '',
        organization_id: 0,
        original_price: 0,
        price: 0,
        detail: '',
        source: 'local',
        surface: '',
        index: 0,
        order_index: 0,
        cost_index: 0,
        clinic_index: 0,
        platform_rate: 0,
        user_index: 0,
        employee_index: 0,
        checkstores: '',
        checkclassifications: '',
        checkstores_arr: [],
        hospital_id: 0,
      },
      examinationClassification: [],
      sourceCheckclassifications: [],
      fileList: [],
      export_organization_id: '0',
      uploadExcelUrl: process.env.VUE_APP_UPLOAD_TREATMENT_URL,
      updateExcelDataUrl: process.env.VUE_APP_UPDATE_TREATMENT_URL,
      uploadData: {},
      tmpCb: []
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.checkstores'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.organization_id'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.type'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    export_organization_id(val) {
      this.uploadData = {organization_id: val}
    },
    tmpCb(val) {
      this.treatmentForm.checkstores_arr = val
      this.treatmentForm.checkstores = val.join(',')
    },
      'treatmentForm.user_index'(val) {
          let num1 = val ? parseFloat(val) : 0.00;
          let num2 = this.treatmentForm.employee_index ? parseFloat(this.treatmentForm.employee_index) : 0.00;
          this.treatmentForm.index = num1 + num2 ;
      },
      'treatmentForm.employee_index'(val) {
          let num1 = val ? parseFloat(val) : 0.00;
          let num2 = this.treatmentForm.user_index ? parseFloat(this.treatmentForm.user_index) : 0.00;
          this.treatmentForm.index = num1 + num2 ;
      }
  },
  created () {
    this.examinationsOptions = examinationsOptions
    this.fetchData()
    this.fetchOther()
  },
  methods: {
    uploadSuccess (response, file, fileList) {
      if (response.code != 1) {
        Message.error(response.msg)
      } else {
        Message.success('上传成功，马上刷新')
        this.dialogExportVisible = false
        this.fetchData()
      }
    },
    exportData () {
      exportTreatmentData({organization_id: this.export_organization_id}).then(response => {
        window.open(response.data)
      })
    },
    exportExcelTmpl () {
      exportTreatmentTmpl().then(response => {
        window.open(response.data)
      })
    },
    updateExcelTmpl () {
      updateTreatmentTmpl().then(response => {
        window.open(response.data)
      })
    },
    handleHide (row) {
      this.$confirm('确认删除此治疗项目？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideTreatment({treatment_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleOffSale (row) {
      offSaleTreatment({treatment_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    handleOnSale (row) {
      onSaleTreatment({treatment_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    parseOption (source) {
      for (var i in this.checkStoresOptions) {
        if (this.checkStoresOptions[i].value === source) {
          return this.checkStoresOptions[i].label
        }
      }
    },
    handleCheckClassification () {
      this.$refs.checkclassification.handleCheckClassification(this.treatmentForm.checkclassifications)
    },
    setCheckclassfication (val) {
      this.treatmentForm.checkclassifications = val
      this.parseCheckclassification(val)
    },
    searchHospital (val) {
      getHospitalOption({search: val}).then(response => {
        this.hospitalOptions = response.data
      })
    },
    handleCheckstoreChange (val) {
      var index = this.treatmentForm.checkstores_arr.indexOf(val)
      if (index >= 0) {
        this.treatmentForm.checkstores_arr.splice(index, 1)
      } else {
        this.treatmentForm.checkstores_arr.push(val)
      }
      this.treatmentForm.checkstores = this.treatmentForm.checkstores_arr.join(',')
    },
    handleCloseTag (tag, index) {
      this.sourceCheckclassifications.splice(index, 1)
      var tmp = []
      for (var i in this.sourceCheckclassifications) {
        tmp.push(this.sourceCheckclassifications[i].id)
      }
      this.treatmentForm.checkclassifications = tmp
    },
    toggleOrganizationOption (organization_id, clear) {
      this.sourceCheckStoresList = []
      if (organization_id === '') {
        return
      }
      this.organizationsList.forEach((item) => {
        if (item.id == organization_id) {
          this.treatmentForm.hospital_id = item.hospital_id
        }
      })
      for (var i in this.checkStoresList) {
        if (this.checkStoresList[i].organization_id === organization_id) {
          this.sourceCheckStoresList.push(this.checkStoresList[i])
        }
      }
      if (this.sourceCheckStoresList.length > 0) {
        this.treatmentForm.source = this.sourceCheckStoresList[0].source
      }
      if (clear && this.treatmentForm.organization_id != organization_id) {
        this.tmpCb = []
      } else if (clear && this.treatmentForm.organization_id != organization_id) {
        this.tmpCb = this.treatmentForm.checkstores_arr
      }
    },
    parseCheckclassification (val) {
      if (val === null) {
        val = ''
      }
      var tmp = []
      if (!Array.isArray(val)) {
        tmp = val.split(',')
      }
      var ids = []
      this.sourceCheckclassifications = []
      for (var i in this.examinationClassification) {
        if (tmp.indexOf(this.examinationClassification[i].id) >= 0) {
          this.sourceCheckclassifications.push(this.examinationClassification[i])
          ids.push(this.examinationClassification[i].id)
        }
      }
      this.treatmentForm.checkclassifications = ids
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.treatmentForm = {
        id: '',
        name: '',
        code: '',
        sample: '',
        type: '',
        price: 0,
        original_price: 0,
        detail: '',
        source: 'local',
        organization_id: '0',
        surface: '',
        index: 0,
        order_index: 0,
        cost_index: 0,
        clinic_index: 0,
        platform_rate: 0,
        user_index: 0,
        employee_index: 0,
        checkstores: '',
        checkclassifications: '',
        checkstores_arr: [],
        hospital_id: 0,
      }
      this.fileList = []
      var _this = this
      var t = setTimeout(function () {
        _this.$refs.uploadimg.setFile(_this.fileList)
        clearTimeout(t)
      }, 200)
      this.sourceCheckclassifications = []
      this.toggleOrganizationOption(this.treatmentForm.organization_id)
      this.dialogFormTitle = '新增治疗项目'
    },
    handleEdit (row) {
      this.treatmentForm = row
      if (row.checkstores !== null) {
        this.treatmentForm.checkstores_arr = row.checkstores.split(',')
      } else {
        this.treatmentForm.checkstores_arr = []
      }
      this.tmpCb = this.treatmentForm.checkstores_arr
      var fileList = (row.surface == '' || row.surface == null) ? [] : [{name: 'surface', url: row.surface}]
      var _this = this
      var t = setTimeout(function () {
        _this.$refs.uploadimg.setFile(fileList) 
        clearTimeout(t)
      }, 200)
      this.toggleOrganizationOption(this.treatmentForm.organization_id)
      this.parseCheckclassification(this.treatmentForm.checkclassifications)
      this.dialogFormTitle = '修改治疗项目'
      this.dialogFormVisible = true
    },
    submitSet () {
      if (this.treatmentForm.name.length === 0) {
        Message.error('名称不能为空')
        return
      }
      if (this.treatmentForm.code.length === 0) {
        Message.error('编号不能为空')
        return
      }
      if (this.treatmentForm.price < 0) {
        Message.error('价格不能为小于0')
        return
      }
      if (this.treatmentForm.hospital_id == 0 && (this.treatmentForm.checkstores === null || this.treatmentForm.checkstores.length === 0)) {
        Message.error('请选择检查门店')
        return
      }
      if (this.treatmentForm.hospital_id > 0) {
        // 特殊车处理，机构管理员找到对应机构
        this.organizationsList.forEach((item) => {
          if (item.hospital_id == this.treatmentForm.hospital_id) {
            this.treatmentForm.organization_id = item.id
          }
        })
        if (this.treatmentForm.organization_id <= 0) {
          Message.error('还没设置此医院作为检查机构，请联系联合集团平台管理员')
          return
        }
      }

      setTreatment(this.treatmentForm).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogFormVisible = false
        if (this.treatmentForm.id === '') {
          Message.info('新增成功')
        } else {
          Message.info('修改成功')
        }
        this.fetchData()
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
      getTreatmentsList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    },
    fetchOther () {
      getOrganizationsList({'page': 1, 'limit': 500}).then(response => {
        this.organizationsList = response.data.list
      })
      getCheckStoresList({ 'page': 1, 'limit': 500 }).then(response => {
        this.checkStoresList = response.data.list
      })
      getAllExaminationClassification().then(response => {
        this.examinationClassification = response.data
      })
    }
  }
}
</script>
