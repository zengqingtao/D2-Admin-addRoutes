<template>
    <el-dialog title="活动留言记录" :visible.sync="dialogRecord" width="80%" top="5vh">
        <el-form inline>
            <el-form-item label="关键词检索">
                <el-input v-model="listQuery.keyword" placeholder="手机号码/姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" size="small" @click="exportData"><i class="el-icon-download"></i> 导出全部</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="list"
                :v-loading="listLoading"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" label-width="150px" inline class="demo-table-expand" v-if="props.row.info_message">
                        <el-form-item label="来源医院">
                            <span v-html="props.row.hospital_name" style="color: #617fc2;font-size: 15px;"></span>
                        </el-form-item>
                        <el-form-item v-for="item in props.row.info_message" :key="item.label" :label="item.label">
                            <span v-html="item.value" style="color: #617fc2;font-size: 15px;"></span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    label="来源医院"
                    prop="hospital_name">
            </el-table-column>
            <el-table-column
                    label="姓名"
                    prop="name">
            </el-table-column>
            <el-table-column
                    label="手机号码"
                    prop="phone">
            </el-table-column>
            <el-table-column
                    label="活动渠道"
                    prop="desc">
            </el-table-column>
            <el-table-column
                    label="备注"
                    prop="desc">
            </el-table-column>
        </el-table>
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
    </el-dialog>
</template>

<script>
    import { getActivityFormMessage, exportRecord } from '@/api/activityform'
    export default {
        name: 'record',
        data () {
            return {
                dialogRecord: false,
                listLoading: false,
                listQuery: {
                    limit:20,
                    form_id:'',
                    keyword:'',
                    page:1,
                },
                total: 0,
                list: []
            }
        },
        watch:{
            'listQuery.keyword'(val) {
                this.listQuery.page = 1
                this.fetchData()
            },
        },
        methods: {
            handleSizeChange (val) {
                this.listQuery.limit = val
                this.fetchData(1)
            },
            handleCurrentChange (val) {
                this.listQuery.page = val
                this.fetchData()
            },
            showRecord(val){
                this.listQuery.form_id = val
                this.fetchData()
                this.dialogRecord = true

            },
            fetchData(page){
                if(page) this.listQuery.page = page
                this.listLoading = true
                getActivityFormMessage(this.listQuery).then(response => {
                    this.total = response.data.total
                    this.list = response.data.list
                    this.listLoading = false
                })
            },
            exportData () {
                exportRecord({form_id: this.listQuery.form_id}).then(response => {
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