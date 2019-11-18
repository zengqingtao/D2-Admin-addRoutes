<template>
    <d2-container>
        <!-- header 查询条件 -->
        <template slot="header">
            <el-row>
                <el-col>
                    <el-form ref="form" inline :model="listQuery">
                        <el-form-item label="检索关键" >
                            <el-col>
                                <el-input v-model="listQuery.keyword" placeholder="姓名/昵称/手机号码"></el-input>
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
            <el-table-column prop="name" align="center" label="姓名/昵称" min-width="100"></el-table-column>
            <el-table-column prop="phone" align="center" label="手机号码" min-width="140"></el-table-column>
            <el-table-column prop="role_type" align="center" label="角色类型" min-width="100">
                <template slot-scope="{$index, row}">
                    {{ row.role_type | parseRoleType }}
                </template>
            </el-table-column>
            <el-table-column prop="inviter" align="center" label="邀请人" min-width="100">
                <template slot-scope="{$index, row}">
                    <span>{{row.invite_name}} / {{ row.invite_type | parseRoleType }}</span>

                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="{$index, row}">
                    <!--<el-button type="primary" size="small" @click="showUserInfo($index, row)"><i class='el-icon-edit'></i> 编辑</el-button>-->
                    <el-button size="small" v-if="row.deleted_at === null" type="danger"  @click="banUser($index, row)"><i class='el-icon-close'></i> 禁用</el-button>
                    <el-button v-else type="success" size="small"  @click="banUser($index, row)"><i class='el-icon-check'></i> 启用</el-button>
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
    </d2-container>
</template>

<script>
    import { getDistributionUserList, setDistributionUserInfo } from '@/api/distribution'
    import { roleType } from '@/data/data'
    import { Message } from 'element-ui'
    export default {
        name: 'users',
        data () {
            return {
                roleType,
                list: null,
                total: null,
                listLoading: true,
                dialogEdit:  false,
                listQuery: {
                    'page': 1,
                    'limit': 20,
                    'keyword': '',
                    'role_type': '',
                },
            }
        },
        created () {
            this.fetchData()
        },
        watch:{
            'listQuery.keyword'(val) {
                this.fetchData(1)
            },
            'listQuery.role_type'(val) {
                this.fetchData(1)
            },
        },
        methods: {
            showUserInfo($index, row){
                console.log(row)
            },
            banUser($index, row){
                let text = row.deleted_at === null ? '禁用' : '启用'
                let deleted_at = row.deleted_at === null ? '1' : null
                this.$confirm('确认'+ text +'此分销人员？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    setDistributionUserInfo({id:row.id, deleted_at: deleted_at}).then(response => {
                        Message.success(text+'分销人员成功');
                        this.fetchData(1);
                    })
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
                getDistributionUserList(this.listQuery).then(response => {
                    this.total = parseInt(response.data.total)
                    this.list = response.data.list
                    this.listLoading = false
                })
            }
        }
    };
</script>

<style scoped>

</style>