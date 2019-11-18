<template>
    <div>
        <el-row :gutter="20">
            <el-col :lg="8" :xs="24">
                <el-card style="margin-top: 20px;" >
                    <div slot="header">
                        <span>我的分组列表</span>
                        <el-button style="float: right;"  type="primary" size="mini" @click="addUsersGroup()"><i class="el-icon-plus" ></i> 添加分组</el-button>
                    </div>
                    <el-table
                            :data="list"
                            element-loading-text="拼命加载中" stripe v-loading="listLoading">
                        <el-table-column
                                prop="group_name"
                                label="分组名称"
                                min-width="150">
                        </el-table-column>
                        <el-table-column align="center" label="操作" min-width="150">
                            <template slot-scope="{$index, row}">
                                <el-button type="primary" circle @click="editUsersGroup($index, row)"><i class="el-icon-edit" ></i></el-button>
                                <el-button type="danger" circle   @click="delUsersGroup($index, row)"><i class="el-icon-delete"></i></el-button>
                                <el-button type="primary" plain size="small" round @click="showUserList($index, row)">展示 <i class="el-icon-arrow-right"></i></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- footer 分页条 -->
                    <div>
                        <el-pagination
                                background
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :current-page.sync="listQuery.page"
                                :page-sizes="[10,20,30,50]"
                                :page-size="listQuery.limit"
                                layout="total, prev, pager, next"
                                :total="total"
                                style="margin-top: 10px;text-align: center;">
                        </el-pagination>
                    </div>

                </el-card>
            </el-col>
            <el-col :lg="16" :xs="24" v-show="showUser">
                <el-card style="margin-top: 20px;">
                    <div slot="header">
                        <span><el-tag><i class="el-icon-caret-right"></i>{{groupTitle}}</el-tag>  关联的病患</span>
                        <el-button style="float: right;" type="primary" size="mini" @click="showAddUserList()"><i class="el-icon-plus"></i> 添加关联病患</el-button>
                    </div>
                    <el-row :gutter="20" v-loading="userListLoading">
                        <el-col v-for="users in userList" :key="users.user_id" :span="6">
                            <el-card style="margin-bottom: 20px;" shadow="hover">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-button type="text" style="float: right" @click="delGroupUser(users.id)">
                                            <i class="el-icon-close"></i>
                                        </el-button>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12"  class="mb2">
                                        <div class="center">
                                            <img v-if="users.avatar" :src="users.avatar" alt="" height="80"
                                                 width="80">
                                            <img v-else  src="/image/avatar/user_icon.png" alt="" height="80"
                                                 width="80">
                                        </div>
                                    </el-col>
                                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="12">
                                        <div class="center">
                                            <span class="info-content mb2"><i class="fa fa-user-circle"></i> {{users.full_name}}</span>
                                            <span class="info-content mb2"><i class="el-icon-phone"></i> {{users.phone}}</span>
                                            <el-button  type="primary" size="small" round @click="showUserInfo(users.user_id)" ><i class="el-icon-more"></i> 查看资料</el-button>
                                        </div>
                                    </el-col>
                                </el-row>
                            </el-card>
                        </el-col>
                    </el-row>
                    <!-- footer 分页条 -->
                    <div>
                        <el-pagination
                                background
                                @size-change="userListSizeChange"
                                @current-change="userListCurrentChange"
                                :current-page.sync="userListQuery.page"
                                :page-sizes="[10,20,30,50]"
                                :page-size="userListQuery.limit"
                                layout="total, prev, pager, next"
                                :total="userListTotal"
                                style="text-align: center;">
                        </el-pagination>
                    </div>
                </el-card>
            </el-col>
            <el-dialog title="添加关联病患" :visible.sync="showAddUser" width="30%">
                <el-form>
                    <el-form-item>
                        <el-input v-model="addUserListQuery.search"
                                  placeholder="昵称/备注/手机号码"></el-input>
                    </el-form-item>
                </el-form>
                <el-table
                        ref="multipleTable"
                        tooltip-effect="dark"
                        :data="addUserList"
                        element-loading-text="拼命加载中" stripe v-loading="addUserListLoading" @selection-change="selectionChange">
                    <el-table-column
                            prop="full_name"
                            label="昵称"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="nickname"
                            label="备注"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="手机号码"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            type="selection"
                            width="55"
                            index="user_id"
                    >
                    </el-table-column>
                </el-table>
                <!-- footer 分页条 -->
                <template slot="footer">
                    <el-pagination style="text-align: center"
                            background
                            @size-change="addUserListSizeChange"
                            @current-change="addUserListCurrentChange"
                            :current-page.sync="addUserListQuery.page"
                            :page-sizes="[10,20,30,50]"
                            :page-size="addUserListQuery.limit"
                            layout="total, prev, pager, next"
                            :total="addUserListTotal">
                    </el-pagination>
                </template>
                <span slot="footer" class="dialog-footer">
                <el-button @click="showAddUser = false">取消</el-button>
                <el-button type="primary" @click="submitAddUserList()">添加</el-button>
                </span>
            </el-dialog>
            <el-dialog title="分组信息" :visible.sync="dialogEdit" width="30%">
                <el-form :model="groupForm"  label-width="80px">
                    <el-form-item label="分组名称">
                        <el-input v-model="groupForm.group_name"
                                  placeholder="请输入分组名称"></el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input-number v-model="groupForm.sort" :min="0" :max="100" label=""></el-input-number>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogEdit = false">取消</el-button>
                <el-button type="primary" @click="setUsersGroup()">修改</el-button>
                </span>
            </el-dialog>
            <el-dialog title="" :visible.sync="dialogUserInfoVisible" width="90%" top="5vh">
                <patient-info ref="patient_info"></patient-info>
            </el-dialog>
        </el-row>
    </div>
</template>

<script>

    import { getMyUsersGroup, getUserList, getAddUserList, addGroupUser, delGroupUser, setGroup, delGroup } from '@/api/usersgroup'
    import { Message } from 'element-ui'
    import PatientInfo from '@/components/lianhe/PatientInfo'
    export default {
        name: 'usersgroup',
        components: {
            PatientInfo
        },
        data() {
            return {
                //分组列表
                list: null,
                total: null,
                listLoading: true,
                dialogEdit:  false,
                listQuery: {
                    'page': 1,
                    'limit': 20,
                },
                //分组操作表单
                groupForm: {
                    'id': '',
                    'group_name': '',
                    'sort': 0,
                },
                groupTitle: '',
                //用户列表
                userList: null,
                userListTotal: null,
                showUser:  false,
                userListLoading: true,
                userListQuery: {
                    'page': 1,
                    'group_id': '',
                    'limit': 20,
                },
                //可关联用户列表
                addUserList: null,
                addUserListTotal: null,
                showAddUser:  false,
                addUserListLoading: true,
                dialogUserInfoVisible: false,
                addUserListQuery: {
                    'search': '',
                    'page': 1,
                    'group_id': '',
                    'limit': 20,
                },
                //提交关联用户表单
                submitUsers:{
                    user_list: [],
                    group_id: '',
                },
                //取消关联用户表单
                delUsers:{
                   id: ''
                },
            };
        },
        watch: {
            'addUserListQuery.search'(val) {
                this.getAddUserList(1)
            },
        },
        methods: {
            //分组列表
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
                getMyUsersGroup(this.listQuery).then(response => {
                    this.total = response.data.total
                    this.list = response.data.list
                    this.listLoading = false
                })
            },
            //新增分组
            addUsersGroup(){
                this.groupForm.id = ''
                this.groupForm.sort = 0
                this.groupForm.group_name = ''
                this.dialogEdit = true
            },
            //修改分组
            editUsersGroup($index, row){
                this.groupForm.id = row.id
                this.groupForm.sort = row.sort
                this.groupForm.group_name = row.group_name
                this.dialogEdit = true
            },
            //提交修改or新增分组
            setUsersGroup() {
                setGroup(this.groupForm).then(() => {
                    Message.success(this.groupForm.id ? '修改成功': '添加成功')
                    this.dialogEdit = false
                    this.fetchData()
                })
            },
            delUsersGroup($index, row) {
                this.$confirm('确认删除此分组？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.groupForm.id = row.id;
                    delGroup(this.groupForm).then(() => {
                        Message.success('删除成功')
                        this.fetchData()
                    })
                })

            },
            //展示用户列表
            showUserList($index, row){
                this.userListQuery.group_id = row.id
                this.addUserListQuery.group_id = row.id
                this.submitUsers.group_id = row.id
                this.groupTitle = row.group_name
                this.getUserList(1)
                this.showUser = true
            },

            //用户列表
            userListSizeChange (val) {
                this.userListQuery.limit = val
                this.fetchData()
            },
            userListCurrentChange (val) {
                this.userListQuery.page = val
                this.fetchData()
            },
            getUserList () {
                this.userListLoading = true
                getUserList(this.userListQuery).then(response => {
                    this.userListTotal = response.data.total
                    this.userList = response.data.list
                    this.userListLoading = false
                })
            },

            //可关联用户列表
            addUserListSizeChange (val) {
                this.addUserListQuery.limit = val
                this.fetchData()
            },
            addUserListCurrentChange (val) {
                this.addUserListQuery.page = val
                this.fetchData()
            },
            getAddUserList () {
                this.addUserListLoading = true
                getAddUserList(this.addUserListQuery).then(response => {
                    this.addUserListTotal = response.data.total
                    this.addUserList = response.data.list
                    this.addUserListLoading = false
                })
            },
            //展示可添加分组的用户
            showAddUserList(){
                this.addUserListQuery.search = ''
                this.getAddUserList(1)
                this.showAddUser = true
            },
            //勾选用户操作
            selectionChange(val) {
                this.submitUsers.user_list = [];
                if (val.length > 0) {
                    for (let index = 0; index < val.length; index++) {
                        this.submitUsers.user_list.push(val[index].user_id);
                    }
                }
                console.log(this.submitUsers.user_list);
            },
            //添加用户到分组
            submitAddUserList() {
                addGroupUser(this.submitUsers).then(() => {
                    Message.success('添加成功')
                    this.showAddUser = false
                    this.getUserList()
                })
            },
            //取消用户关联分组
            delGroupUser($id) {
                this.$confirm('确认取消用户关联分组？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delUsers.id = $id;
                    delGroupUser(this.delUsers).then(() => {
                        this.getUserList()
                        Message.success('取消关联成功')
                    })
                })
            },
            showUserInfo($id){
                setTimeout(() => {
                    this.$refs.patient_info.showPatientInfo($id);
                }, 0);
                this.dialogUserInfoVisible = true
            }
        },
        created () {
            this.fetchData()
        },
    };
</script>

<style scoped>
    .info-content{
        display: inline-block;
        width: 150px;
        text-align: left;
        font-size:14px;
        color: #909399;
    }
</style>