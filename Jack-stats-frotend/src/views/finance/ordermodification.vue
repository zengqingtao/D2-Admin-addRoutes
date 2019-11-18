<template>
    <d2-container>
        <!-- header 查询条件 -->
        <template slot="header">
            <el-button type="warning" style="float: right" @click="showRecord()"><i class="el-icon-time"></i> 修改记录</el-button>
            <el-form ref="form" :model="listQuery" :inline="true">
                <el-form-item label="订单号" >
                    <el-input v-model="listQuery.number" placeholder="订单编号"></el-input>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="listQuery.order_type" placeholder="请选择订单类型">
                        <el-option
                                v-for="type in orderType"
                                :key="type.value"
                                :label="type.label"
                                :value="type.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

        </template>
        <!-- table表格 -->
        <el-table :data="list" v-if="list"
                  v-loading="listLoading"
                  element-loading-text="拼命加载中..."
                  highlight-current-row
                  stripe
                  style="width: 100%">
            <el-table-column align="center" prop="number" label="订单编号" min-width="150"></el-table-column>
            <el-table-column align="center" prop="amount" label="订单价格" min-width="150"></el-table-column>
            <el-table-column align="center" prop="patient_name" label="就诊人" min-width="150"></el-table-column>
            <el-table-column align="center" prop="phone" label="手机号" min-width="150"></el-table-column>
            <el-table-column align="center" prop="card" label="诊疗卡号" min-width="150"></el-table-column>
            <el-table-column align="center" prop="admin_name" label="创建者"
                             min-width="100"></el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间" min-width="150"></el-table-column>
            <el-table-column align="center" label="操作" min-width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="showEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i> 修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--编辑弹框-->
        <el-dialog :visible.sync="dialogEdit" title="修改订单" width="30%">
            <el-form :inline="true">
                <el-form-item label="订单价格">
                    <el-input v-model="editFrom.amount" placeholder="请输入订单价格"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogEdit = false">取消</el-button>
                    <el-button type="primary" @click="handleEdit()">确认</el-button>
                </span>
        </el-dialog>
        <el-dialog :visible.sync="dialogRecord" title="修改订单记录" width="80%">
            <el-form ref="form" :model="recordListQuery" :inline="true">
                <el-form-item label="订单号" >
                    <el-input v-model="recordListQuery.number" placeholder="订单编号"></el-input>
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="recordListQuery.order_type" placeholder="请选择订单类型">
                        <el-option value="" >全部</el-option>
                        <el-option
                                v-for="type in orderType"
                                :key="type.value"
                                :label="type.label"
                                :value="type.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="recordRefresh()">搜索</el-button>
            </el-form>
            <el-table :data="recordList" element-loading-text="拼命加载中" stripe  border v-loading="recordListLoading">
                <el-table-column align="center" prop="order_code" label="订单编号" min-width="150"></el-table-column>
                <el-table-column align="center" prop="order_type" label="订单类型" min-width="150">
                    <template slot-scope="scope">
                        {{ scope.row.order_type | parseOrderType }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="before_price" label="原价" min-width="150"></el-table-column>
                <el-table-column align="center" prop="after_price" label="修改价格" min-width="150"></el-table-column>
                <el-table-column align="center" prop="patient_name" label="就诊人" min-width="150"></el-table-column>
                <el-table-column align="center" prop="phone" label="手机号" min-width="150"></el-table-column>
                <el-table-column align="center" prop="card" label="诊疗卡号" min-width="150"></el-table-column>
                <el-table-column align="center" prop="admin_name" label="操作者"
                                 min-width="100"></el-table-column>
                <el-table-column align="center" prop="created_at" label="操作时间" min-width="150"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                    <el-pagination
                            background
                            @size-change="recordSizeChange"
                            @current-change="recordCurrentChange"
                            :current-page.sync="recordListQuery.page"
                            :page-sizes="[10,20,30,50]"
                            :page-size="recordListQuery.limit"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="recordTotal"
                            style="margin-top: 10px;">
            </el-pagination>
                </span>
        </el-dialog>

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
    </d2-container>
</template>
<script>
    import { getModificationOrderList, setModificationOrder, getModificationOrderRecord } from '@/api/orders'
    import {orderType } from '@/data/data'
    import { Message } from 'element-ui'
    export default {
        name: 'ordermodification',
        components: {

        },

        data () {
            return {
                list: null,
                total: null,
                listLoading: true,
                orderType,
                listQuery: {
                    'page': 1,
                    'limit': 20,
                    'number': '',
                    'order_type': '',
                },
                recordList: null,
                recordTotal: null,
                recordListLoading: true,
                recordListQuery: {
                    'page': 1,
                    'limit': 20,
                    'number': '',
                    'order_type': '',
                },
                editFrom: {
                    'order_type': '',
                    'id': '',
                    'amount': '',
                },
                dialogEdit: false,
                dialogRecord: false,
            }
        },
        created () {
            // this.fetchData()
        },
        watch: {
            'listQuery.number'(val) {
                this.listQuery.page = 1
                this.fetchData()
            },
            'listQuery.order_type'(val) {
                this.listQuery.page = 1
                this.fetchData()
            },
        },
        methods: {
            handleRefresh() {
                this.listQuery.page = 1
                this.fetchData()
            },
            showEdit ($index, row) {
                this.dialogEdit = true
                this.editFrom.amount = row.amount
                this.editFrom.id = row.id
                this.editFrom.order_type = this.listQuery.order_type
            },
            handleEdit () {
                setModificationOrder(this.editFrom).then(()=> {
                    Message.success('修改成功')
                    this.dialogEdit = false
                    this.fetchData()
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
                getModificationOrderList(this.listQuery).then(response => {
                    this.total = response.data.total
                    this.list = response.data.list
                    this.listLoading = false
                })
            },
            showRecord () {
                this.fetchRecord()
                this.dialogRecord = true
            },
            recordSizeChange (val) {
                this.recordListQuery.limit = val
                this.fetchRecord()
            },
            recordCurrentChange (val) {
                this.recordListQuery.page = val
                this.fetchRecord()
            },
            recordRefresh() {
                this.recordListQuery.page = 1
                this.fetchRecord()
            },
            fetchRecord () {
                this.recordListLoading = true
                getModificationOrderRecord(this.recordListQuery).then(response => {
                    this.recordTotal = response.data.total
                    this.recordList = response.data.list
                    this.recordListLoading = false
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .h1{font-weight:800;font-size:1.1rem;}
    .list-reset{display:block;overflow:hidden;font-size:1rem;}
    .pb3{width: 33.3%;float:left;font-size:1rem;padding:5px 0;}
    .mb2{display:block;font-size:1rem;padding: 10px 0;}
</style>
