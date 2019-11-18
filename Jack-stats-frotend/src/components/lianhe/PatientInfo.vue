<template>

    <el-form ref="form" label-width="85px">
        <el-row :gutter="10">
            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <el-card class="box-card" style="min-height: 265px; margin-bottom: 10px;">
                    <div slot="header" >
                        <span>用户信息</span>
                    </div>
                    <el-row :gutter="0">
                        <el-col>
                            <div v-if="patientInfo.avatar" class="user-avatar">
                                <img :src="patientInfo.avatar" alt="">
                            </div>
                            <div  v-else class="user-avatar">
                                <img src="/image/avatar/user_icon.png" alt="">
                            </div>
                        </el-col>
                        <el-col  v-if="patientsGroup.length > 0">
                            <el-form-item label="分组：">
                                <el-tag type="success" style="margin-right: 10px;" v-for="group in patientsGroup" :key="group.id">{{group.group_name}}</el-tag>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="昵称：">
                                <div v-html="patientInfo.full_name"></div>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="备注：">
                                <div v-html="patientInfo.nickname"></div>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="电话：">
                                <div v-html="patientInfo.phone"></div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
                <el-card class="box-card" style="min-height: 265px; margin-bottom: 10px;">
                    <div slot="header" >
                        <span>就诊人信息</span>
                    </div>
                    <el-row :gutter="0">
                        <el-col>
                            <el-form-item label="就诊人：">
                                <el-select v-model="patientId">
                                    <el-option
                                            v-for="patient in patients"
                                            :key="patient.id"
                                            :label="patient.full_name"
                                            :value="patient.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="姓名：">
                                <div v-html="healthy.full_name"></div>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="诊疗卡号：">
                                <div v-html="healthy.card"></div>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="年龄：">
                                <div v-html="healthy.age"></div>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="身份证：">
                                <div v-html="healthy.identification_number"></div>
                            </el-form-item>
                        </el-col>
                        <el-col>
                            <el-form-item label="电话：">
                                <div v-html="healthy.phone"></div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-card class="box-card" style="min-height: 866px; margin-bottom: 10px;"  v-loading="loading">
                    <div slot="header" >
                        <span>档案资料</span>
                    </div>
                    <el-row :gutter="0">
                        <el-col>
                            <el-tabs v-model="userInfoTabMenu" type="card" @tab-click="handleClick">
                                <el-tab-pane label="健康档案" name="healthFile">
                                    <el-form v-model="healthy" label-width="150px" >
                                        <el-card style="margin-bottom: 10px;" shadow="hover">
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-tag type="primary" style="font-size: 18px; margin-bottom: 10px">基本信息</el-tag>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="就诊人姓名:" >
                                                        {{ healthy.full_name }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="性别:" >
                                                        {{ healthy.sex }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="出生年月:" >
                                                        {{ healthy.birth_year }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="年龄:" >
                                                        {{ healthy.age }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="联系电话:" >
                                                        {{ healthy.phone }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="证件类型:" >
                                                        {{ healthy.papers_type | parsePapersType }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="身份证:" >
                                                        {{ healthy.identification_number }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="其他证件:" >
                                                        {{ healthy.papers }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="所在地区:" >
                                                        {{ healthy.districts_name }}
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-card>
                                        <el-card style="margin-bottom: 10px;" shadow="hover">
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-tag type="primary" style="font-size: 18px; margin-bottom: 10px">医疗信息</el-tag>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="身高:" >
                                                        {{ healthy.height }}cm
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="体重:" >
                                                        {{ healthy.weight }}kg
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="血型:" >
                                                        {{ healthy.blood_type }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="RH阴性:" >
                                                        {{ healthy.RH === 1 ? '是' : '否' }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="历史最高血压:" >
                                                        {{ healthy.lower_blood }} - {{ healthy.higher_blood }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="测量时间:" >
                                                        {{ healthy.check_time }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="腰围:" >
                                                        {{ healthy.lower_waistline }} - {{ healthy.higher_waistline }}cm
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="臀围:" >
                                                        {{ healthy.lower_hipline }} - {{ healthy.higher_hipline }}cm
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="期望体重:" >
                                                        {{ healthy.expected_weight }}kg
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="药物过敏:" >
                                                        {{ healthy.medicine_allergy }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="食物或接触物过敏:" >
                                                        {{ healthy.allergy }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="特殊人群标签:" >
                                                        {{ healthy.special_people }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="目前疾病:" >
                                                        {{ healthy.current_disease}}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="目前用药:" >
                                                        {{ healthy.current_medicine }}
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-card>
                                        <el-card style="margin-bottom: 10px;" shadow="hover">
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-tag type="primary" style="font-size: 18px; margin-bottom: 10px">其他信息</el-tag>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="婚姻状态：" >
                                                        {{ healthy.marital_status }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="生育状态：" >
                                                        {{ healthy.fertility_status }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="手术或外伤：" >
                                                        {{ healthy.injury }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="家族病史：" >
                                                        {{ healthy.family_disease }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="个人习惯：" >
                                                        {{ healthy.habit }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="医疗保险：" >
                                                        {{ healthy.medicare }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="社保地区：" >
                                                        {{ healthy.insurance_district }}
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :xl="8" :lg="12" :sm="12" :xs="24">
                                                    <el-form-item label="商业保险公司：" >
                                                        {{ healthy.insurance_company }}
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-card>
                                    </el-form>
                                </el-tab-pane>
                                <el-tab-pane label="历史病例" name="historicalCase">
                                    <el-table
                                            :data="list"
                                            style="width: 100%">
                                        <el-table-column prop="full_name" label="就诊医生" align="center"></el-table-column>
                                        <el-table-column prop="created_at" label="提交时间" align="center"></el-table-column>
                                        <el-table-column label="操作" align="center">
                                            <template slot-scope="scope">
                                                <el-button type="primary" size="small" @click="onMedical(scope.$index, scope.row)">查看</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-pagination
                                            background
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :current-page.sync="listQuery.page"
                                            :page-sizes="[10,20,30,50]"
                                            :page-size="listQuery.limit"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="total"
                                            style="margin-top: 10px; text-align: center">
                                    </el-pagination>
                                </el-tab-pane>
                                <el-tab-pane label="服务订单" name="serviceOrder">
                                    <el-table :data="list" stripe size="mini" border style="width: 100%">
                                        <el-table-column prop="number" label="订单号" align="center" width="90"></el-table-column>
                                        <el-table-column prop="type_name" label="服务类型" align="center"
                                                         width="90"></el-table-column>
                                        <el-table-column prop="patient_name" label="姓名" align="center" width="90"></el-table-column>
                                        <el-table-column prop="name" label="服务名称" align="center"
                                                         width="100"></el-table-column>
                                        <el-table-column prop="created_at" label="创建时间" align="center"
                                                         min-width="100"></el-table-column>
                                        <el-table-column prop="amount" label="订单价格" align="center" width="100"></el-table-column>
                                        <el-table-column prop="status" align="center" label="订单状态" width="100">
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.status | parseOrderStatus }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="control" label="操作" align="center" width="100" fixed="right">
                                            <template slot-scope="{$index, row}">
                                                <el-button type="primary" size="small" @click="onServiceDetail($index, row)">查看</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-pagination
                                            background
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :current-page.sync="listQuery.page"
                                            :page-sizes="[10,20,30,50]"
                                            :page-size="listQuery.limit"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="total"
                                            style="margin-top: 10px; text-align: center">
                                    </el-pagination>
                                </el-tab-pane>
                                <el-tab-pane label="检查报告" name="inspectionReport">
                                    <el-table :data="list" stripe size="mini" border style="width: 100%">
                                        <el-table-column prop="number" label="订单号" align="center" width="90"></el-table-column>
                                        <el-table-column prop="patient_name" label="姓名" align="center" min-width="90"></el-table-column>
                                        <el-table-column prop="created_at" label="订单时间" align="center" width="100"></el-table-column>
                                        <el-table-column prop="amount" label="订单价格" align="center" width="100"></el-table-column>
                                        <el-table-column prop="admin_name" label="创建者" align="center" min-width="100"></el-table-column>
                                        <el-table-column prop="status" align="center" label="订单状态" width="100">
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.status | parseOrderStatus }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="control" label="操作" align="center" width="100" fixed="right">
                                            <template slot-scope="{$index, row}">
                                                <el-button type="primary" size="small" @click="onExaminationDetail($index, row)">查看</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-pagination
                                            background
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :current-page.sync="listQuery.page"
                                            :page-sizes="[10,20,30,50]"
                                            :page-size="listQuery.limit"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="total"
                                            style="margin-top: 10px; text-align: center">
                                    </el-pagination>
                                </el-tab-pane>
                                <el-tab-pane label="历史药单" name="Prescription">
                                    <el-table size="mini" stripe :data="list" border style="width: 100%">
                                        <el-table-column prop="number" label="订单号" align="center"></el-table-column>
                                        <el-table-column prop="patient_name" label="姓名" align="center" width="80"></el-table-column>
                                        <el-table-column prop="total_amount" label="订单价格" align="center"></el-table-column>
                                        <el-table-column prop="admin_name" label="创建者" align="center"></el-table-column>
                                        <el-table-column prop="created_at" label="订单时间" align="center"></el-table-column>
                                        <el-table-column prop="source" label="来源" align="center" width="90">
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.source | parseMedicineSource }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="status" align="center" label="订单状态" width="100">
                                            <template slot-scope="scope">
                                                <span>{{ scope.row.status | parseOrderStatus }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="control" label="操作" align="center" width="100" fixed="right">
                                            <template slot-scope="{$index, row}">
                                                <el-row>
                                                    <el-button type="primary" size="small" @click="onPrescriptionDetail($index, row)">查看</el-button>
                                                </el-row>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <el-pagination
                                            background
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :current-page.sync="listQuery.page"
                                            :page-sizes="[10,20,30,50]"
                                            :page-size="listQuery.limit"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="total"
                                            style="margin-top: 10px; text-align: center">
                                    </el-pagination>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
                <el-card class="box-card" style="min-height: 866px;">
                    <div slot="header" class="clearfix ">
                        <span>{{patientInfo.full_name}}</span>
                    </div>
                    <el-row :gutter="0">
                        <el-col>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </el-form>

</template>

<script>
    import { getMyPatientsInfo } from '@/api/mypatients'
    import { getPatientsList, getPatientsOrdersList } from '@/api/personnel'
    import { getServeList, getPrescriptionList, getExaminationList } from '@/api/orders'
    import { papersTypeOptions, parseOrderStatus } from '@/data/data'
    export default {
        name: 'PatientInfo',
        props: ['patientUserId'],
        components: {
        },
        data() {
            return {
                healthy: {
                    age: '',
                    full_name: '',
                    sex: '',
                    birth_year: '',
                    district: '',
                    phone: '',
                    identification_number: '',
                    height: '',
                    weight: '',
                    blood_type: '',
                    RH: '',
                    lower_blood: '',
                    higher_blood: '',
                    check_time: '',
                    medicine_allergy: '',
                    allergy: '',
                    current_disease: '',
                    current_medicine: '',
                    special_people: '',
                    marital_status: '',
                    fertility_status: '',
                    injury: '',
                    family_disease: '',
                    habit: '',
                    medicare: '',
                    insurance_district: '',
                    insurance_company: '',
                    page: 1,
                    role: '',
                    districts_name: null,
                    lower_waistline: '',
                    higher_waistline: '',
                    lower_hipline: '',
                    higher_hipline: '',
                    expected_weight: '',
                    papers_trans: '',
                    papers: '',
                },
                loading: false,
                userInfoTabMenu: 'healthFile',
                patientId: '',
                patientInfo: {},
                patientsGroup: [],
                patients: [],
                list: [],
                total: null,
                listQuery: {
                    'page': 1,
                    'limit': 20,
                    'patient_id': ''
                },
                medicalList: [],
                examList: [],
                serviceList: [],
                prescriptionList: [],
            };
        },
        watch: {
            'patientId'(val) {
                this.userInfoTabMenu = 'healthFile';
                this.handleClick()
            },
        },
        methods: {
            handleClick(tab, event) {
                this.listQuery.patient_id = this.patientId;
                this.listQuery.page = 1
                this.listQuery.limit = 20
                console.log(this.userInfoTabMenu)
                this.getData()
            },
            showHealthy() {
                let patients = this.patientInfo.patients
               for (let patient in patients){
                   if(patients[patient].id === this.patientId){
                       this.healthy = this.patientInfo.patients[patient]
                   }
               }
            },
            showMedical() {
                console.log(this.listQuery)
                getPatientsOrdersList(this.listQuery).then(res => {
                    this.loading = true
                    this.list = res.data.list
                    this.total = res.data.total
                    this.loading = false
                });
            },
            showServiceOrder() {
                getServeList(this.listQuery).then(res => {
                    this.loading = true
                    this.list = res.data.list
                    this.total = res.data.total
                    this.loading = false
                })
            },
            showInspectionReport() {
                getExaminationList(this.listQuery).then(res => {
                    this.loading = true
                    this.list = res.data.list
                    this.total = res.data.total
                    this.loading = false
                })
            },
            showPrescription() {
                getPrescriptionList(this.listQuery).then(res => {
                    this.loading = true
                    this.list = res.data.list
                    this.total = res.data.total
                    this.loading = false
                })
            },
            showPatientInfo(patientUserId) {
                getMyPatientsInfo({user_id:patientUserId}).then(res => {
                    this.patientInfo = res.data.patientInfo
                    this.patientsGroup = res.data.patientsGroup
                    this.patients = res.data.patientInfo.patients
                    this.patientId = res.data.patientInfo.patients[0].id
                    this.healthy = res.data.patientInfo.patients[0]
                    // this.patientUserId = patientUserId;
                    this.userInfoTabMenu = 'healthFile'
                    // this.$refs.imChat.initChat(patientUserId);
                }).finally(() => this.loading = false)
            },
            handleSizeChange (val) {
                this.listQuery.limit = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.listQuery.page = val
                this.getData()
            },
            getData(){
                if (this.userInfoTabMenu === 'healthFile') {
                    this.showHealthy()
                } else if (this.userInfoTabMenu === 'historicalCase') {
                    this.showMedical()
                } else if (this.userInfoTabMenu === 'serviceOrder') {
                    this.showServiceOrder()
                } else if (this.userInfoTabMenu === 'inspectionReport') {
                    this.showInspectionReport()
                } else if (this.userInfoTabMenu === 'Prescription') {
                    this.showPrescription()
                }
            },
            // 跳转检查单页面
            onExaminationDetail($index, row) {

            },
            // 跳转服务单页面
            onServiceDetail($index, row) {

            },
            // 跳转病例
            onMedical($index, row) {

            },
            // 跳转处方详情页
            onPrescriptionDetail($index, row) {

            }
        },
        mounted() {},
        created() {
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .user-avatar {
        border-radius: 50%;
        display: inline-block;
        width: 150px;
        padding: 0;
        margin-bottom: 20px;
    }

    .user-avatar img {
        width: 100%;
        border-radius: 50%;
    }

    .user-tag {
        display: inline-block;
    }

    .im-user-avatar {
        display: inline-block;
    }

    .im-user-avatar img {
        width: 40px;
        height: 40px;
        border-radius: 100%;
    }

    .im-chat-card .el-card__header {
        padding: 6px 20px;
    }
</style>
