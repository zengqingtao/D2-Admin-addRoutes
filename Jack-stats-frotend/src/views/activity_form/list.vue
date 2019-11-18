<template>
    <d2-container>
        <!-- header 查询条件 -->
        <template slot="header">
            <el-button type="primary" style="float: right;" @click="handleAdd"><i class="el-icon-plus"></i> 新增活动</el-button>
            <el-form ref="form" :model="listQuery" :inline="true">
                <el-form-item label="活动标题">
                    <el-input v-model="listQuery.title" placeholder="请输入活动标题"></el-input>
                </el-form-item>
                <el-form-item label="显示状态">
                    <el-select v-model="listQuery.status" placeholder="请选择显示类型">
                        <el-option
                                v-for="status in showStatus"
                                :key="status.value"
                                :label="status.label"
                                :value="status.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </template>
        <!-- table表格 -->
        <el-table :data="list"
                  v-loading="listLoading"
                  element-loading-text="拼命加载中..."
                  highlight-current-row
                  stripe
                  style="width: 100%">
            <el-table-column align="center" prop="id" label="活动ID" min-width="150"></el-table-column>
            <el-table-column align="center" prop="title" label="活动标题" min-width="150"></el-table-column>
            <el-table-column align="center" prop="main_image" label="主图" min-width="150">
                <template slot-scope="scope">
                    <img :src="scope.row.main_image" style="width:50px;height:50px;" v-if="scope.row.main_image != ''">
                </template>
            </el-table-column>
            <el-table-column align="center" prop="show_type" label="展示类型" min-width="150">
                <template slot-scope="scope">
                    {{ scope.row.show_type | parseActivityShowType }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="sort" label="排序" min-width="150"></el-table-column>
            <el-table-column align="center" prop="start_at" label="开始时间" min-width="150"></el-table-column>
            <el-table-column align="center" prop="end_at" label="结束时间" min-width="150"></el-table-column>
            <el-table-column align="center" prop="status" label="活动状态" min-width="150">
                <template slot-scope="scope">
                    {{ scope.row.status | parseShowStatus }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="admin_name" label="创建者" min-width="100"></el-table-column>
            <el-table-column align="center" prop="created_at" label="创建时间" min-width="150"></el-table-column>
            <el-table-column align="center" label="操作" min-width="150">
                <template slot-scope="scope">
                    <el-button size="small" style="margin-bottom: 5px;" type="primary" @click="showEdit(scope.$index, scope.row)"><i class="el-icon-edit"></i> 编辑</el-button>
                    <el-button size="small" style="margin-bottom: 5px;" type="success" @click="showRecord(scope.$index, scope.row)">查看报名</el-button>
                    <el-button size="small" type="info" @click="showQrCode(scope.$index, scope.row)"><i class="fa fa-qrcode"></i> 展示二维码</el-button>
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
        <el-dialog title="活动二维码" :visible.sync="dialogQrCode" width="30%" top="5vh">
            <div style="display: flex; align-items:center; justify-content: center" >
                <div id="qrcode"  ref="qrcode"></div>
            </div>

        </el-dialog>
        <el-dialog title="" :visible.sync="dialogDetail" width="60%" top="5vh">
            <detail ref="form_detail" @hiddenThis="hiddenDetail"></detail>
        </el-dialog>
        <record ref="form_record"></record>
    </d2-container>
</template>
<script>
    import { getActivityFormList } from '@/api/activityform'
    import {showStatus } from '@/data/data'
    import QRCode from 'qrcodejs2'
    import { Message } from 'element-ui'
    import Detail from './detail'
    import Record from './record'
    export default {
        name: 'list',
        components: {
            Detail,
            Record,
            QRCode:QRCode
        },

        data () {
            return {
                list: [
                ],
                total: null,
                qrCodeUrl: 'https://www.baidu.com/',
                listLoading: false,
                dialogDetail: false,
                dialogQrCode: false,
                showStatus,
                listQuery: {
                    'page': 1,
                    'limit': 20,
                    'title': '',
                    'status': '1',
                },
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            'listQuery.title'(val) {
                this.listQuery.page = 1
                this.fetchData()
            },
            'listQuery.status'(val) {
                this.listQuery.page = 1
                this.fetchData()
            },
        },
        methods: {
            handleRefresh() {
                this.listQuery.page = 1
                this.fetchData()
            },
            handleAdd(){
                setTimeout(() => {
                    this.$refs.form_detail.resetForm();
                }, 0);
                this.dialogDetail = true
            },
            showQrCode($index, row){
                this.dialogQrCode = true
                this.qrCodeUrl = row.url
                this.$nextTick (function () {
                    this.createCode()
                })

            },
            showEdit ($index, row) {
                setTimeout(() => {
                    this.$refs.form_detail.fetchData(row.id);
                }, 0);
                this.dialogDetail = true
            },
            showRecord($index, row){
                this.$refs.form_record.showRecord(row.id);
            },
            hiddenDetail(){
                this.dialogDetail = false
                this.fetchData(1)
            },
            // handleEdit () {
            //     // setModificationOrder(this.editFrom).then(()=> {
            //     //     Message.success('修改成功')
            //     //     this.dialogEdit = false
            //     //     this.fetchData()
            //     // })
            // },
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
                getActivityFormList(this.listQuery).then(response => {
                    this.total = response.data.total
                    this.list = response.data.list
                    this.listLoading = false
                })
            },
            createCode () {
                let that = this
                document.getElementById("qrcode").innerHTML = "";
                let qrcode = new QRCode('qrcode', {
                    width: 232,
                    height: 232,
                    text:  that.qrCodeUrl
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .h1{font-weight:800;font-size:1.1rem;}
    .list-reset{display:block;overflow:hidden;font-size:1rem;}
    .pb3{width: 33.3%;float:left;font-size:1rem;padding:5px 0;}
    .mb2{display:block;font-size:1rem;padding: 10px 0;}
</style>
