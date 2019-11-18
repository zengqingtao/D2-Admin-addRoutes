<template>
    <d2-container>
        <!-- header 查询条件 -->
        <template slot="header">
            <el-row>
                <el-col :span="12">
                    <el-form ref="form" :model="listQuery">
                        <el-form-item label="检索关键" >
                            <el-col :span="15">
                                <el-input v-model="listQuery.search" placeholder="用户名/手机号码/备注"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="病患分组">
                            <el-select v-model="listQuery.group_id" placeholder="请选择">
                                <el-option value="">全部</el-option>
                                <el-option
                                        v-for="option in groupOptions"
                                        :key="option.id"
                                        :label="option.group_name"
                                        :value="option.id">
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
            <el-table-column prop="full_name" align="center" label="用户名" min-width="100"></el-table-column>
            <el-table-column prop="phone" align="center" label="手机号码" min-width="140"></el-table-column>
            <el-table-column prop="nickname" align="center" label="备注" min-width="100"></el-table-column>
            <el-table-column prop="birth_year" align="center" label="出生年份" min-width="100"></el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="{$index, row}">
                    <el-button type="primary" @click="showUserInfo($index, row)"><i class='el-icon-more'></i> 查看详情</el-button>
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
        <el-dialog title="" :visible.sync="dialogUserInfoVisible" width="90%" top="5vh">
            <patient-info ref="patient_info"></patient-info>
        </el-dialog>
    </d2-container>
</template>
<script>
    import { getMyPatientsList, getMyPatientsGroup } from '@/api/mypatients'
    import PatientInfo from '@/components/lianhe/PatientInfo'
    export default {
        name: 'mypatients',
        components: {
            PatientInfo
        },
        data () {
            return {
                list: null,
                total: null,
                listLoading: true,
                dialogEdit:  false,
                dialogUserInfoVisible:  false,
                listQuery: {
                    'page': 1,
                    'limit': 20,
                    'search': '',
                    'group_id': '',
                },
                groupOptions: []
            }
        },
        created () {
            this.getGroupOption()
            this.fetchData()
        },
        watch: {
        },
        methods: {
            handleRefresh() {
                this.listQuery.page = 1
                this.fetchData()
            },
            getGroupOption () {
                getMyPatientsGroup().then(response=> {
                   this.groupOptions = response.data
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
                getMyPatientsList(this.listQuery).then(response => {
                    this.total = response.data.total
                    this.list = response.data.list
                    this.listLoading = false
                })
            },
            showUserInfo($index, row){
                setTimeout(() => {
                    this.$refs.patient_info.showPatientInfo(row.user_id)
                }, 0)
                this.dialogUserInfoVisible = true
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
