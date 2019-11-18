<template>
    <d2-container>
        <!-- header 查询条件 -->
        <template slot="header">
            <el-row>
                <el-col :span="12">
                    <el-form ref="form" :model="listQuery">
                        <el-form-item label="检索关键" >
                            <el-col :span="15">
                                <el-input v-model="listQuery.search" placeholder="用户名/手机号码/订单号"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="支付时间">
                            <el-col :span="15">
                                <el-date-picker v-model="listQuery.date"  type="daterange"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期"
                                                value-format="yyyy-MM-dd"
                                                style="width: 100%;"></el-date-picker>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="支付类型">
                            <el-checkbox-group v-model="listQuery.type">
                                <el-checkbox v-for="types in payType" :label="types.value" :key="types.value" :value="types.value">{{types.label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="充值类型">
                            <el-checkbox-group v-model="listQuery.rechargeType">
                                <el-checkbox v-for="recharge in rechargeType" :label="recharge.value" :key="recharge.value" :value="recharge.value">{{recharge.label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="订单状态">
                            <el-select v-model="listQuery.status" placeholder="请选择">
                                <el-option
                                        v-for="status in payStatus"
                                        :key="status.value"
                                        :label="status.label"
                                        :value="status.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-button type="primary" @click="handleRefresh()">搜索</el-button>
                    </el-form>
                </el-col>
            </el-row>
        </template>
        <!-- table表格 -->
        <el-table :data="list"
                  v-loading="listLoading"
                  element-loading-text="拼命加载中..."
                  highlight-current-row
                  stripe
                  style="width: 100%">
            <el-table-column prop="full_name" align="center" label="用户名" width="100"></el-table-column>
            <el-table-column prop="out_trade_no" align="center" label="订单号" min-width="140"></el-table-column>
            <el-table-column prop="recharge_type" align="center" label="充值类型" width="100">
                <template slot-scope="scope">
                    {{ scope.row.recharge_type | parseRchargeType }}
                </template>
            </el-table-column>
            <el-table-column prop="recharge_amount" align="center" label="充值金额" width="100"></el-table-column>
            <el-table-column prop="gift_amount" align="center" label="赠送金额" width="100"></el-table-column>
            <el-table-column prop="pay_type" align="center" label="支付类型" width="100">
                <template slot-scope="scope">
                    {{ scope.row.pay_type | parsePayType }}
                </template>
            </el-table-column>
            <el-table-column prop="pay_price" align="center" label="支付金额" width="100"></el-table-column>
            <el-table-column prop="pay_time" align="center" label="支付时间" min-width="140"></el-table-column>
            <el-table-column prop="status" align="center" label="订单状态" width="140">
                <template slot-scope="scope">
                    {{ scope.row.status | parsePayStatus }}
                </template>
            </el-table-column>
            <el-table-column prop="phone" align="center" label="联系电话" width="140"></el-table-column>
            <el-table-column prop="remark" align="center" label="备注" min-width="140"></el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="{$index, row}">
                    <el-button type="primary" @click="showEdit($index, row)"><i class='el-icon-edit'></i>添加备注</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--编辑弹框-->
        <el-dialog :visible.sync="dialogEdit" width="30%">
            <el-input   type="textarea"
                        :rows="2"
                        v-model="remarkFrom.remark"
                        placeholder="请输入备注内容"></el-input>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogEdit = false">取消</el-button>
                    <el-button type="primary" @click="handleEdit()">确认</el-button>
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
    import { getRechargeList, setRechargeOrder } from '@/api/orders'
    import { payType, rechargeType, payStatus } from '@/data/data'
    import { Message } from 'element-ui'
    export default {
        name: 'rechargeorderlist',
        components: {

        },
        data () {
            return {
                list: null,
                total: null,
                listLoading: true,
                payType,
                rechargeType,
                payStatus,
                listQuery: {
                    'page': 1,
                    'limit': 20,
                    'search': '',
                    'status': '',
                    'date': '',
                    'rechargeType': [],
                    'type': []
                },
                remarkFrom: {
                    'remark': '',
                    'out_trade_no': '',
                },
                dialogEdit: false,
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
        },
        methods: {
            handleRefresh() {
                this.listQuery.page = 1
                this.fetchData()
            },
            showEdit ($index, row) {
                this.dialogEdit = true;
                this.remarkFrom.remark = row.remark;
                this.remarkFrom.out_trade_no = row.out_trade_no;
            },
            handleEdit () {
                setRechargeOrder(this.remarkFrom).then(()=> {
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
                getRechargeList(this.listQuery).then(response => {
                    this.total = response.data.total
                    this.list = response.data.list
                    this.listLoading = false
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
