<template>
    <d2-container>
        <!-- header 查询条件 -->
        <template slot="header">
            <el-row>
                <el-col>
                    <el-form ref="form" inline :model="listQuery">
                        <el-form-item label="订单类型">
                            <el-select v-model="listQuery.number_type" placeholder="请选择订单类型">
                                <el-option value="">全部</el-option>
                                <el-option
                                        v-for="option in numberType"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单编号" v-if="listQuery.number_type">
                            <el-col>
                                <el-input v-model="listQuery.number" placeholder="订单编号"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="角色类型">
                            <el-select v-model="listQuery.role_type" placeholder="请选择角色类型">
                                <el-option value="">全部</el-option>
                                <el-option
                                        v-for="option in roleType"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="角色名称" v-if="listQuery.role_type">
                            <el-select
                                    v-model="listQuery.role_id"
                                    filterable
                                    remote
                                    clearable
                                    reserve-keyword
                                    placeholder="请输入手机号码/昵称/姓名"
                                    :remote-method="searchUser"
                                    :loading="loading">
                                <el-option
                                        v-for="item in userList"
                                        :key="item.id"
                                        :label="item.name + ' | ' + item.phone "
                                        :value="item.role_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="订单来源医院">
                            <el-select
                                    v-model="listQuery.hospital_id">
                                <el-option value="">全部</el-option>
                                <el-option
                                        v-for="item in hospitalList"
                                        :key="item.hospital_id"
                                        :label="item.hospital_name"
                                        :value="item.hospital_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="日期">
                            <el-date-picker
                                    v-model="listQuery.date"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" @click="fetchData(1)"><i class="el-icon-search"></i> 搜索</el-button>
                            <el-button type="success" size="small" @click="dialogExport = true"><i class="el-icon-download"></i> 导出</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-dialog title="导出数据"
                           :visible.sync="dialogExport"
                           width="50%">
                    <p style="color: red">*注意：导出只能按日期及订单类型导出，日期与订单类型是必填的*</p>
                    <el-form label-width="80px" label-position="left">
                        <el-form-item label="订单类型">
                            <el-select v-model="exportQuery.number_type" placeholder="请选择订单类型">
                                <el-option value="">全部</el-option>
                                <el-option
                                        v-for="option in numberType"
                                        :key="option.value"
                                        :label="option.label"
                                        :value="option.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="日期">
                            <el-date-picker
                                    v-model="exportQuery.date"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="small" @click="exportData">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </el-row>
        </template>
        <!-- table表格 -->
        <el-table :data="list"
                  v-loading="listLoading"
                  element-loading-text="拼命加载中..."
                  highlight-current-row
                  stripe
                  style="width: 100%">
            <el-table-column prop="number" align="center" label="订单编号" min-width="100"></el-table-column>
            <el-table-column align="center" label="订单类型" min-width="150">
                <template slot-scope="{$index, row}">
                    {{ row.number_type | parseNumberType }}
                </template>
            </el-table-column>
            <el-table-column prop="amount" align="center" label="订单金额" min-width="100"></el-table-column>
            <el-table-column prop="hospital_name" align="center" label="来源医院" min-width="150"></el-table-column>
            <el-table-column prop="name" align="center" label="姓名/昵称" min-width="100"></el-table-column>
            <el-table-column prop="phone" align="center" label="手机号码" min-width="120"></el-table-column>
            <el-table-column  align="center" label="角色类型" min-width="100">
                <template slot-scope="{$index, row}">
                    {{ row.role_type | parseRoleType }}
                </template>
            </el-table-column>
            <el-table-column  align="center" label="收益类型" min-width="100">
                <template slot-scope="{$index, row}">
                    {{ row.income_type | parseIncomeType }}
                </template>
            </el-table-column>
            <el-table-column  align="center" label="收益金额" min-width="150">
                <template slot-scope="{$index, row}">
                    <span>{{ row.income_amount}} <small style="color: red" v-if=" row.refund_income_amount">(退款：{{ row.refund_income_amount}})</small></span>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" align="center" label="统计时间" min-width="150"></el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="{$index, row}">
                    <el-button type="primary" size="small" @click="showInfo($index, row)"><i class='el-icon-more'></i> 显示详情</el-button>
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
        <!-- 编辑弹窗 -->
        <el-dialog
                title="订单分成明细"
                :visible.sync="dialogInfo"
                width="80%">
            <el-row>
                <el-col :span="24">
                    <el-table :data="indexList"
                              element-loading-text="拼命加载中..."
                              highlight-current-row
                              stripe
                              style="width: 100%">
                        <el-table-column prop="code" align="center" label="商品编号" min-width="100"></el-table-column>
                        <el-table-column prop="name" align="center" label="商品名称" min-width="100"></el-table-column>
                        <el-table-column prop="price" align="center" label="单价" min-width="100"></el-table-column>
                        <el-table-column prop="quantity" align="center" label="数量" min-width="100"></el-table-column>
                        <el-table-column prop="refund_price" align="center" label="退款金额" min-width="100"></el-table-column>
                        <el-table-column prop="user_index" align="center" label="邀新用户指数" min-width="100"></el-table-column>
                        <el-table-column prop="employee_index" align="center" label="邀新医生指数" min-width="100"></el-table-column>
                        <el-table-column prop="order_index" align="center" label="开单指数" min-width="100"></el-table-column>
                        <el-table-column prop="cost_index" align="center" label="成本指数" min-width="100"></el-table-column>
                        <el-table-column prop="clinic_index" align="center" label="诊所指数" min-width="100"></el-table-column>
                        <el-table-column prop="platform_rate" align="center" label="平台指数" min-width="100"></el-table-column>
                    </el-table>
                    <div style="float: right;margin-top: 10px; font-size: 20px;" v-if="detailList">总价：￥ {{ detailList[0].amount }}</div>
                </el-col>
                <el-col :span="24">
                    <el-row style="margin-top: 20px;">
                        <el-col :span="6" v-for="item in detailList" :key="item.id">
                            <el-card style="margin-right: 10px">
                                <el-form label-position="left" label-width="100px" inline class="demo-table-expand" v-if="detailList">
                                    <el-form-item label="姓名">
                                        <span style="color: #617fc2;font-size: 15px;">
                                            {{ item.name }}
                                        </span>
                                    </el-form-item>
                                    <el-form-item label="角色">
                                        <span style="color: #617fc2;font-size: 15px;">
                                            {{item.role_type | parseRoleType}}
                                        </span>
                                    </el-form-item>
                                    <el-form-item label="联系方式">
                                        <span style="color: #617fc2;font-size: 15px;">
                                            {{ item.phone }}
                                        </span>
                                    </el-form-item>
                                    <el-form-item label="收益类型">
                                        <span style="color: #617fc2;font-size: 15px;">
                                            {{ item.income_type | parseIncomeType }}
                                        </span>
                                    </el-form-item>
                                    <el-form-item label="收益金额">
                                        <span style="color: #617fc2;font-size: 15px;">{{item.income_amount}}
                                            <small style="color: red" v-if="item.refund_income_amount" >
                                              (退款： {{item.refund_income_amount}})</small>
                                        </span>
                                    </el-form-item>
                                </el-form>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogInfo = false">取 消</el-button>
                <el-button type="primary" @click="dialogInfo = false">确 定</el-button>
            </span>
        </el-dialog>
    </d2-container>
</template>

<script>
    import { getDistributionStatList, getOrderDetail, getDistributionUserList, exportDistributionStatDetail } from '@/api/distribution'
    import { getHospitalConfigOption } from '@/api/hospital'
    import { roleType, numberType } from '@/data/data'
    import { Message } from 'element-ui'
    export default {
        name: 'stat',
        data () {
            return {
                roleType,
                numberType,
                list: null,
                indexList: null,
                detailList: null,
                userList: [],
                hospitalList: [],
                total: null,
                listLoading: true,
                loading: true,
                dialogInfo:  false,
                dialogExport:  false,
                exportQuery:  {
                    'date': [],
                    'number_type': '',
                },
                listQuery: {
                    'page': 1,
                    'limit': 20,
                    'role_id': '',
                    'role_type': '',
                    'number_type': '',
                    'number': '',
                    'hospital_id': '',
                    'date': [],
                },
            }
        },
        created () {
            this.getHospitalOption()
            this.fetchData()
        },
        watch:{
        },
        methods: {
            showInfo($index, row){
                getOrderDetail({order_id:row.order_id, number_type: row.number_type}).then(response => {
                    this.indexList = response.data.index
                    this.detailList = response.data.detail
                    this.dialogInfo = true;
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
            fetchData (page) {
                if(page) this.listQuery.page = page
                this.listLoading = true
                getDistributionStatList(this.listQuery).then(response => {
                    this.total = parseInt(response.data.total)
                    this.list = response.data.list
                    this.listLoading = false
                })
            },
            searchUser(query) {
                if (query !== '') {
                    this.loading = true;
                    getDistributionUserList({role_type:this.listQuery.role_type,keyword:query}).then(response => {
                        this.userList = response.data.list
                        this.loading = false;
                    })

                } else {
                    this.userList = [];
                }
            },
            getHospitalOption() {
                getHospitalConfigOption({}).then(response => {
                    this.hospitalList = response.data
                })
            },
            exportData () {
                exportDistributionStatDetail(this.exportQuery).then(response => {
                    window.open(response.data)
                })
            },
        }
    };
</script>

<style scoped>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
</style>