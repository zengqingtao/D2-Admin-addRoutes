<template>
    <d2-container>
        <el-card style="margin-bottom: 20px;">
            <div slot="header">
                <span>昨日数据</span>
            </div>
            <el-row >
                <el-col :span="6">
                    <span class="demonstration" style="color: #00a0e9">{{ lastDayData.recharge_total_fee ? lastDayData.recharge_total_fee :0 }}元</span>
                    <span class="demonstration">充值总额</span>
                </el-col>
                <el-col :span="6">
                    <span class="demonstration" style="color: #00a0e9">{{lastDayData.recharge_total_order ? lastDayData.recharge_total_order :0 }}笔</span>
                    <span class="demonstration">充值订单数</span>
                </el-col>
                <el-col :span="6">
                    <span class="demonstration" style="color: #00a0e9">{{lastDayData.average_order_price ? lastDayData.average_order_price :0 }}元/笔</span>
                    <span class="demonstration">订单均价</span>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="6">
                    <span class="demonstration" style="color: #127b03">{{lastDayData.first_recharge_total_fee ? lastDayData.first_recharge_total_fee :0 }}元</span>
                    <span class="demonstration">首充订单总额</span>
                </el-col>
                <el-col :span="6">
                    <span class="demonstration" style="color: #127b03">{{lastDayData.first_recharge_total_order ? lastDayData.first_recharge_total_order :0 }}笔</span>
                    <span class="demonstration">首充订单总数</span>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-bottom: 20px;" v-loading="listLoading">
            <div slot="header">
                <span><i class="fa fa-bar-chart"></i> 每日充值数据</span>
            </div>
            <el-date-picker
                    v-model="listQuery.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <div id="main" style="height: 400px;"></div>
        </el-card>
        <el-card style="margin-bottom: 20px;">
            <div slot="header">
                <span><i class="fa fa-yen"></i> 平台余额</span>
            </div>
            <el-row >
                <el-col :span="6">
                    <span class="demonstration" style="color: #00a0e9">{{totalAmountData.total_fee}}元</span>
                    <span class="demonstration">平台累计余额充值</span>
                </el-col>
                <el-col :span="6">
                    <span class="demonstration" style="color: #00a0e9">{{totalAmountData.total_free}}元</span>
                    <span class="demonstration">平台待消费余额</span>
                </el-col>
                <el-col :span="6">
                    <span class="demonstration" style="color: #00a0e9">{{totalAmountData.total_used}}元</span>
                    <span class="demonstration">平台已使用余额</span>
                </el-col>
            </el-row>
        </el-card>
    </d2-container>
</template>
<script>
    import { getRechargeDaily, getLastDayData, getTotalStat } from '@/api/stat'
    import echarts from 'echarts'; // 引入echarts
    export default {
        name: 'statrecharge',
        components: {

        },
        data () {
            return {
                listLoading: true,
                listQuery: {
                    date: [],
                },
                lastDayData:{
                    recharge_total_fee: 0,
                    recharge_total_order: 0,
                    average_order_price: 0,
                    first_recharge_total_fee: 0,
                    first_recharge_total_order: 0,
                },
                linesData:{
                    header :[],
                    content :[],
                },
                totalAmountData:{
                    total_fee: 0,
                    total_used: 0,
                    total_free: 0,
                },
            }
        },
        created () {
            this.fetchData()
            this.getLastDayDataList()
            this.getTotalStatData()
        },
        watch: {
            'listQuery.date'(val) {
                this.fetchData();
            },
        },
        methods: {
            fetchData () {
                this.listLoading = true
                getRechargeDaily(this.listQuery).then(response => {
                    this.linesData = response.data
                    //画图
                    let myChart = echarts.init(document.getElementById('main'))
                    // 绘制图表
                    myChart.setOption({
                        title: {text: ''},
                        tooltip: {},
                        xAxis: {
                            data: this.linesData.header,
                        },
                        yAxis: {},
                        series: [
                            {
                                name: '充值金额',
                                type: 'bar',
                                data: this.linesData.content,
                            },
                        ],
                    })
                    this.listLoading = false
                })
            },
            getLastDayDataList () {
                getLastDayData().then(response => {
                    this.lastDayData = response.data
                })
            },
            getTotalStatData () {
                getTotalStat().then(response => {
                    this.totalAmountData = response.data
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

    .demonstration {
        display: block;
        color: #606266;
        font-size: 15px;
        margin-bottom: 20px;
    }
</style>
