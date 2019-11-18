<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <!-- <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button> -->
      <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;" placeholder="输入名称/编号/品牌搜索" clearable></el-input>
      <el-select v-model="listQuery.is_rx" placeholder="类型">
        <el-option label="全部类型" value=""></el-option>
        <el-option label="处方药" value="1"></el-option>
        <el-option label="非处方药" value="0"></el-option>
      </el-select>
      <el-select v-model="listQuery.source" placeholder="药库类型"  v-if="rolename != '机构管理员'">
        <el-option label="全部库房" value=""></el-option>
        <el-option label="七乐康" value="qlk"></el-option>
        <el-option label="益丰" value="yf"></el-option>
        <el-option label="至信" value="zx"></el-option>
        <el-option label="康美" value="km"></el-option>
        <el-option label="君康思博特" value="jk"></el-option>
        <el-option label="本地" value="local"></el-option>
        <el-option label="其他" value="other"></el-option>
      </el-select>
      <br/>
      <div style="margin-left: 10px;margin-top:10px;">
        <el-button type="primary" plain @click="exportExcelTmpl()">导入模板</el-button>
        <el-button type="success" plain @click="dialogExportVisible = true, dialogExcelTitle = '导入药品'">导入药品</el-button>
        <el-button type="primary" plain @click="updateExcelTmpl()">修改模板</el-button>
        <el-button type="success" plain @click="dialogExportVisible = true, dialogExcelTitle = '批量修改药品'">批量修改</el-button>
        <el-button type="primary" plain @click="dialogExportVisible = true, dialogExcelTitle = '导出药品'">导出药品</el-button>  
      </div>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
      v-loading="listLoading"
      element-loading-text="拼命加载中..."
      highlight-current-row
      stripe
      style="width: 100%">
      <el-table-column align="center" prop="drug_name" label="名称" min-width="120"></el-table-column>
      <el-table-column align="center" prop="code" label="编码" width="100"></el-table-column>
      <el-table-column align="center" prop="approval_number" label="批准文号" width="160"></el-table-column>
      <el-table-column align="center" prop="is_rx" label="药型" width="100">
          <template slot-scope="scope">
            {{ scope.row.is_rx == 0 ? '处方药' : '非处方药' }}
          </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="零售价" width="100"></el-table-column>
      <el-table-column align="center" label="分类" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.classification != null && scope.row.classification.length > 0">已绑定</span>
          <span v-else>未绑定</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="库存" prop="count" width="100">
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
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

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="85%" center :close-on-click-modal="false">
      <el-form ref="medicineForm" :model="medicineForm" label-width="15%">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所在医院">
              <el-cascader
                size="large"
                :options="cityOptions"
                v-model="cityDistrict"
                @change="handleCityChange">
              </el-cascader>
              <el-select v-model="medicineForm.hospital_id" placeholder="医院">
                <el-option label="请选择" value=""></el-option>
                <el-option :label="item.name" :value="item.id" v-for="item in cityHispital"></el-option>
              </el-select>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="medicineForm.is_rx" placeholder="类型">
                <el-option label="处方药" value="1"></el-option>
                <el-option label="非处方药" value="0"></el-option>
              </el-select>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品类型">
              <el-select v-model="medicineForm.type" placeholder="药品类型">
                <el-option label="西药" value="h"></el-option>
                <el-option label="中药" value="z"></el-option>
              </el-select>
            </el-form-item>    
          </el-col>
          <el-col :span="12" v-if="medicineForm.id.length > 0">
            <el-form-item label="来源">
              <el-select v-model="medicineForm.source" placeholder="来源" disabled >
                <el-option label="七乐康" value="qlk"></el-option>
                <el-option label="益丰" value="yf"></el-option>
                <el-option label="至信" value="zx"></el-option>
                <el-option label="康美" value="km"></el-option>
                <el-option label="君康思博特" value="jk"></el-option>
                <el-option label="本地" value="local"></el-option>
                <el-option label="其他" value="other"></el-option>
              </el-select>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品名称">
              <el-input v-model="medicineForm.drug_name" placeholder="请输入药品名称" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="通用名">
              <el-input v-model="medicineForm.generic_name" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品编码">
              <el-input v-model="medicineForm.code" placeholder="请输入药品编码" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌">
              <el-input v-model="medicineForm.brand" placeholder="请输入品牌" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="第三方编码">
              <el-input v-model="medicineForm.out_code" placeholder="请输入第三方编码" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存">
              <el-input v-model="medicineForm.count" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="原价">
              <el-input v-model="medicineForm.original_price" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="零售价">
              <el-input v-model="medicineForm.price" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="生产厂家">
              <el-input v-model="medicineForm.manufacturer" placeholder="请输入生产厂家" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="药监编码">
              <el-input v-model="medicineForm.cfda_number" placeholder="请输入药监编码" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期(天)">
              <el-input v-model="medicineForm.validity" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准文号">
              <el-input v-model="medicineForm.approval_number" placeholder="请输入批准文号" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装规格">
              <el-input v-model="medicineForm.package" placeholder="请输入包装规格" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格">
              <el-input v-model="medicineForm.specifications" placeholder="请输入规格" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="剂量单位">
              <el-input v-model="medicineForm.dose_unit" placeholder="请输入剂量单位" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="剂型">
              <el-input v-model="medicineForm.dosage_form" placeholder="请输入剂型" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="剂量限制">
              <el-input v-model="medicineForm.limit" placeholder="请输入剂量限制" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="用法用量">
              <el-input v-model="medicineForm.dosage_and_administration" placeholder="请输入用法用量" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="储藏条件">
              <el-input v-model="medicineForm.storage" placeholder="请输入储藏条件" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="成分">
              <el-input v-model="medicineForm.composition" placeholder="请输入成分" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="性状">
              <el-input v-model="medicineForm.description" placeholder="请输入性状" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="禁忌">
              <el-input v-model="medicineForm.contraindications" placeholder="请输入禁忌" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="适应症">
              <el-input v-model="medicineForm.indications" placeholder="请输入适应症" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="药物相互作用">
              <el-input v-model="medicineForm.pharmacological_actions" placeholder="请输入药物相互作用" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="不良反应">
              <el-input v-model="medicineForm.adverse_reactions" placeholder="请输入不良反应" type="textarea" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="注意事项">
              <el-input v-model="medicineForm.precautions" placeholder="请输入注意事项" type="textarea" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <!--<el-col :span="12">-->
            <!--<el-form-item label="渠道指数">-->
              <!--<el-input v-model="medicineForm.index" type="number" clearable readonly></el-input>-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="12">
            <el-form-item label="邀新用户指数">
              <el-input v-model="medicineForm.user_index" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邀新医生指数">
              <el-input v-model="medicineForm.employee_index" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医生指数">
              <el-input v-model="medicineForm.order_index" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="推荐指数">
              <el-input v-model="medicineForm.recommend_index" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>    
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本指数">
              <el-input v-model="medicineForm.cost_index" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="诊所指数">
              <el-input v-model="medicineForm.clinic_index" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台费率">
              <el-input v-model="medicineForm.platform_rate" type="number" clearable :readonly="medicineForm.source == 'local' && medicineForm.id > 0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品分类">
              <el-button class="d2-mr" @click="dialogClassificationFormVisible = true" v-if="medicineForm.source != 'local' && medicineForm.id != 0">添加</el-button>
              <el-tag
                v-for="(tag, index) in classificationOptions"
                :key="tag.name"
                closable
                size="mini"
                :gutter="20"
                @close="handleClose(index)">{{tag.name}}
              </el-tag>
            </el-form-item>    
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="medicineForm.source != 'local' && medicineForm.id != 0">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSet">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择分类" :visible.sync="dialogClassificationFormVisible" width="50%" center :close-on-click-modal="false">
      <el-form label-width="15%">
        <el-form-item label="已选择" v-if="classificationOptions.length > 0">
          <el-tag
            v-for="(tag, index) in classificationOptions"
            :key="tag.name"
            closable
            size="mini"
            :gutter="20"
            @close="handleClose(index)">{{tag.name}}
          </el-tag>
        </el-form-item>
        <el-form-item label="一级分类">
          <el-select v-model="firstClassificationId" placeholder="一级分类" @change="firstClassificationChange()">
            <el-option :label="item.name" :value="item.id" v-for="item in firstClassificationList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择二级分类" v-if="firstClassificationId.length > 0">
          <el-table :data="parseSecondClassification" height="600" v-if="parseSecondClassification.length > 0">
            <el-table-column label="分类名称" prop="name"></el-table-column>
            <el-table-column align="left" label="操作">
              <template slot-scope="scope">
                <el-button size="small" v-if="secondClassificationIdArr.indexOf(scope.row.id) < 0" @click="handleAddClassification(scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
          <span v-else>暂无</span>
        </el-form-item>
      </el-form>
    </el-dialog>  

    <el-dialog :title="dialogExcelTitle" :visible.sync="dialogExportVisible" width="30%" center :close-on-click-modal="false">
      <div v-if="dialogExcelTitle == '导出药品' || dialogExcelTitle == '导入药品'">
        选择来源：
        <el-select v-model="export_source" style="margin-bottom:20px;">
          <el-option label="七乐康" value="qlk"></el-option>
          <el-option label="益丰" value="yf"></el-option>
          <el-option label="至信" value="zx"></el-option>
          <el-option label="康美" value="km"></el-option>
          <el-option label="君康思博特" value="jk"></el-option>
          <el-option label="本地" value="local" v-if="dialogExcelTitle == '导出药品'"></el-option>
          <el-option label="其他" value="other"></el-option>
        </el-select>  
      </div>
      <div v-if="dialogExcelTitle == '批量修改药品'">
        您确认要批量修改数据? <span style="color:red">每次上传条数上限为200</span>
      </div>
      <br/>
      <div style="text-align:center;">
        <el-button v-if="dialogExcelTitle == '导出药品'" type="primary" style="margin-left:20px" @click="exportData()">导出</el-button>
        <el-upload v-if="dialogExcelTitle == '导入药品'" 
          :auto-upload="true"
          :action="uploadExcelUrl"
          :on-success="uploadSuccess"
          :limit="1"
          :file-list="[]"
          :data="uploadData">
          <el-button size="small" type="primary">点击上传导入</el-button>
        </el-upload>
        <el-upload v-if="dialogExcelTitle == '批量修改药品'" 
          :auto-upload="true"
          :action="updateExcelDataUrl"
          :on-success="uploadSuccess"
          :limit="1"
          :file-list="[]">
          <el-button size="small" type="primary">点击上传修改</el-button>
        </el-upload>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { getMedicineList, getMedicine, setMedicine, getHospitalList, getHospital, getMedicineClassificationList } from '@/api/hospital'
import { Message } from 'element-ui'
import { regionData } from 'element-china-area-data'
import { hideMedicine, offSaleMedicine, onSaleMedicine } from '@/api/hidedel'
import { exportMedicineTmpl, updateMedicineTmpl, exportMedicineData } from '@/api/excel'
export default {
  name: 'medicinelist',
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
        'is_rx': '',
        'source': ''
      },
      // 一级分类id
      firstClassificationId: '',
      // 二级分类id
      secondClassificationId: '',
      // 改变一级分类后，得到的二级分类
      parseSecondClassification: [],
      // 选择的二级分类，或数据库返回的，包含着一份分类，恶心
      classificationOptions: [],
      // 二级分类的id集合
      secondClassificationIdArr: [],
      cityDistrict: [],
      cityOptions: regionData,
      firstClassificationList: [],
      secondClassificationList: [],
      hospitalList: [],
      cityHispital: [],
      selectedOptions: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      dialogClassificationFormVisible: false,
      dialogExportVisible: false,
      dialogExcelTitle: '',
      medicineForm: {
        id: '',
        drug_name: '',
        generic_name: '',
        code: '',
        out_code: '',
        brand: '',
        index: '',
        order_index: '',
        recommend_index: '',
        user_index: '',
        employee_index: '',
        cost_index: '',
        clinic_index: '',
        platform_rate: '',
        count: '',
        price: '',
        is_rx: '',
        specifications: '',
        validity: '',
        approval_number: '',
        manufacturer: '',
        cfda_number: '',
        dosage_form: '',
        dosage_and_administration: '',
        storage: '',
        package: '',
        indications: '',
        composition: '',
        description: '',
        dose_unit: '',
        limit: '',
        contraindications: '',
        pharmacological_actions: '',
        adverse_reactions: '',
        precautions: '',
        classification: ''
      },
      export_source: '',
      uploadExcelUrl: process.env.VUE_APP_UPLOAD_MEDICINE_URL,
      updateExcelDataUrl: process.env.VUE_APP_UPDATE_MEDICINE_URL,
      uploadData: {}
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.is_rx'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.source'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    export_source(val) {
      this.uploadData = {source: val}
    },
    'medicineForm.user_index'(val) {
      let num1 = val ? parseFloat(val) : 0.00;
      let num2 = this.medicineForm.employee_index ? parseFloat(this.medicineForm.employee_index) : 0.00;
      this.medicineForm.index = num1 + num2 ;
    },
    'medicineForm.employee_index'(val) {
      let num1 = val ? parseFloat(val) : 0.00;
      let num2 = this.medicineForm.user_index ? parseFloat(this.medicineForm.user_index) : 0.00;
      this.medicineForm.index = num1 + num2 ;
    }
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
      exportMedicineData({source: this.export_source}).then(response => {
        window.open(response.data)
      })
    },
    exportExcelTmpl () {
      exportMedicineTmpl().then(response => {
        window.open(response.data)
      })
    },
    updateExcelTmpl () {
      updateMedicineTmpl().then(response => {
        window.open(response.data)
      })
    },
    handleHide (row) {
      this.$confirm('确认删除此药品？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideMedicine({medicine_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleOffSale (row) {
      offSaleMedicine({medicine_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    handleOnSale (row) {
      onSaleMedicine({medicine_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    firstClassificationChange () {
      this.parseSecondClassification = []
      var tmpId = []
      for (var i in this.classificationOptions) {
        tmpId.push(this.classificationOptions[i].id)
      }
      for (var j in this.secondClassificationList) {
        if (this.secondClassificationList[j].pids.split(',').indexOf(this.firstClassificationId) > -1) {
          var tmp = this.secondClassificationList[j]
          if (tmpId.indexOf(tmp.id) > -1) {
            tmp.added = 1
          } else {
            tmp.added = 0
          }
          this.parseSecondClassification.push(tmp)
        }
      }
    },
    handleAddClassification (medicineClassification) {
      this.classificationOptions.push(medicineClassification)
      for (var i in this.parseSecondClassification) {
        if (this.parseSecondClassification[i].id === medicineClassification.id) {
          this.parseSecondClassification[i].added = 1
          this.secondClassificationIdArr.push(medicineClassification.id)
          break
        }
      }
    },
    handleClose (index) {
      for (var i in this.parseSecondClassification) {
        if (this.parseSecondClassification[i].id === this.classificationOptions[index].id) {
          this.parseSecondClassification[i].added = 0
          break
        }
      }
      this.secondClassificationIdArr.splice(index, 1)
      this.classificationOptions.splice(index, 1)
    },
    parseClassificationOptions (val) {
      var tmp = val.split(',')
      this.classificationOptions = []
      for (var i in this.secondClassificationList) {
        if (tmp.indexOf(this.secondClassificationList[i].id) > -1) {
          this.classificationOptions.push(this.secondClassificationList[i])
          this.secondClassificationIdArr.push(this.secondClassificationList[i].id)
        }
      }
    },
    handleCityChange (val, hospital_id) {
      if (val.length === 0) {
        return
      }
      getHospitalList({page: 1, limit: 500, district_id: val.join(',')}).then(response => {
        this.cityHispital = response.data.list
        if (hospital_id) {
          this.medicineForm.hospital_id = hospital_id  
        }
      })
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.medicineForm = {
        id: '',
        drug_name: '',
        generic_name: '',
        code: '',
        out_code: '',
        brand: '',
        index: '',
        recommend_index: '',
        count: '',
        price: '',
        source: 'local',
        is_rx: '',
        specifications: '',
        validity: '',
        approval_number: '',
        manufacturer: '',
        cfda_number: '',
        dosage_form: '',
        dosage_and_administration: '',
        storage: '',
        package: '',
        indications: '',
        composition: '',
        description: '',
        dose_unit: '',
        limit: '',
        contraindications: '',
        pharmacological_actions: '',
        adverse_reactions: '',
        precautions: '',
        classification: ''
      }
      this.dialogFormTitle = '新增药品'
    },
    handleEdit (row) {
      var hospital_id = row.hospital_id
      row.hospital_id = ''
      this.medicineForm = row

      if (hospital_id > 0) {
        getHospital({id: hospital_id}).then(response => {
          this.cityDistrict = response.data.district_id.split(',')
          this.handleCityChange(response.data.district_id.split(','), hospital_id)
        }).catch((e) => {
          Message.error(e.msg)
        })
      }
      if (row.classification !== null && row.classification.length > 0) {
        this.parseClassificationOptions(row.classification)
      } else {
        this.classificationOptions = []
        this.secondClassificationIdArr = []
      }
      this.dialogFormTitle = '修改药品'
      this.dialogFormVisible = true
    },
    submitSet () {
      if (this.medicineForm.drug_name.length === 0) {
        Message.error('名称不能为空')
        return
      }
      if (this.medicineForm.price < 0) {
        Message.error('售价应该大于0')
        return
      }
      if (this.medicineForm.original_price < 0) {
        Message.error('原价应该大于0')
        return
      }
      var tmpClassificationArr = []
      for (var i in this.classificationOptions) {
        tmpClassificationArr.push(this.classificationOptions[i].id)
        var pids = this.classificationOptions[i].pids.split(',')
        for (var j in pids) {
          if (tmpClassificationArr.indexOf(pids[j]) < 0) {
            tmpClassificationArr.push(pids[j])
          }
        }
      }
      this.medicineForm.classification = tmpClassificationArr.join(',')
      setMedicine(this.medicineForm).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogFormVisible = false
        if (this.medicineForm.id === '') {
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
      getMedicineList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
      // getHospitalList({ 'page': 1, 'limit': '5000', 'search': '' }).then(response => {
      //   this.hospitalList = response.data.list
      // })
      getMedicineClassificationList({ 'page': 1, 'limit': 1500, 'type': 'subject', 'parent': 1 }).then(response => {
        this.firstClassificationList = response.data
      })
      getMedicineClassificationList({ 'page': 1, 'limit': 1500, 'type': 'subject', 'parent': 0 }).then(response => {
        this.secondClassificationList = response.data
      })
    }
  }
}
</script>
