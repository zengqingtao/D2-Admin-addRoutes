<template>
    <el-row>
        <el-col>
            <el-form label-width="100px" label-position="left">
                <el-form-item label="活动标题">
                    <el-input v-model="form.title" placeholder="必填"></el-input>
                </el-form-item>
                <el-form-item label="显示状态">
                    <el-select v-model="form.status" placeholder="请选择显示类型">
                        <el-option
                                v-for="status in showStatus"
                                :key="status.value"
                                :label="status.label"
                                :value="status.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="活动展示">
                    <el-select v-model="form.show_type" placeholder="请选择展示类型">
                        <el-option
                                v-for="type in activityShowType"
                                :key="type.value"
                                :label="type.label"
                                :value="type.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                -->
                <el-form-item label="展示机构" v-if="form.show_type === '1'">
                    <el-select v-model="form.hospitals"  multiple  placeholder="请选择展示机构">
                        <el-option
                                v-for="type in activityShowType"
                                :key="type.value"
                                :label="type.label"
                                :value="type.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input v-model="form.desc" type="textarea" :rows="4" placeholder="请输入活动简介"></el-input>
                </el-form-item>
                <el-form-item label="主图">
                    <uploadimg ref="logouploadimg" v-model="form.main_image" :max="1" :filelist="fileList"></uploadimg>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="form.sort"></el-input-number>
                    <p style="color: red">*数字越大越靠前*</p>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                            v-model="form.start_at"
                            type="datetime"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                            v-model="form.end_at"
                            type="datetime"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col>
            <el-card>
                <div slot="header">
                    <span>表单内容</span>
                    <el-button style="float: right" size="small" @click="handleItems"><i class="el-icon-plus"></i> 添加表单内容</el-button>
                    <el-table :data="form.items"
                              element-loading-text="拼命加载中..."
                              highlight-current-row
                              stripe
                              style="width: 100%">
                        <el-table-column align="center" prop="label" label="项目名称" min-width="100"></el-table-column>
                        <el-table-column align="center" prop="is_required" label="必填" min-width="50">
                            <template slot-scope="scope">
                                {{ scope.row.is_required | parseIsStatus }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="value_type" label="类型" min-width="50">
                            <template slot-scope="scope">
                                {{ scope.row.value_type | parseValueType }}
                            </template>
                        </el-table-column>
                        <el-table-column align="center"  label="排序(数字大排前面)" min-width="50">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.sort"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="项目可选值" min-width="150">
                            <template slot-scope="scope">
                                <div v-html="scope.row.value_options"></div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作" min-width="100">
                            <template slot-scope="scope">
                                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"><i class="el-icon-close"></i> 删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </el-col>
        <el-col style="text-align: center; margin-top: 20px;">
            <el-button type="primary" @click="submit()">提交</el-button>
        </el-col>
        <el-dialog title="选择项目" :visible.sync="dialogItems" width="60%" append-to-body>
            <div>
                <el-button size="small" @click="newItem = !newItem" :type="!newItem ? 'primary' : 'danger'"> {{ !newItem ? '新增' : '取消'  }} </el-button>
                <el-input size="small" style="float: right;width: 200px;" v-show="!newItem" v-model="itemQuery.keyword" placeholder="输入关键字匹配"></el-input>
            </div>
            <el-form label-width="100px" label-position="left" v-show="newItem" style="margin-top: 10px">
                <el-form-item label="项目名称">
                    <el-input v-model="itemForm.label" placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="itemForm.value_type" placeholder="请选择类型">
                        <el-option
                                v-for="type in valueType"
                                :key="type.value"
                                :label="type.label"
                                :value="type.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="必填">
                    <el-select v-model="itemForm.is_required" placeholder="请选择是否必填">
                        <el-option
                                v-for="status in isStatus"
                                :key="status.value"
                                :label="status.label"
                                :value="status.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="可选项" v-if="multiple.includes(itemForm.value_type)">
                    <el-input type="textarea" :rows="4" v-model="itemForm.value_options" placeholder="多个选项可用英文, 隔开例如： A选项,B选项"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="addItems()">提交</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="items" v-show="!newItem"
                      ref="multipleTable"
                      tooltip-effect="dark"
                      element-loading-text="拼命加载中..."
                      highlight-current-row
                      v-loading="itemsLoading"
                      stripe
                      @selection-change="selectionChange"
                      style="width: 100%">
                <el-table-column align="center" prop="label" label="项目名称" min-width="100"></el-table-column>
                <el-table-column align="center" prop="is_required" label="必填" min-width="50">
                    <template slot-scope="scope">
                        {{ scope.row.is_required | parseIsStatus }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="value_type" label="类型" min-width="50">
                    <template slot-scope="scope">
                        {{ scope.row.value_type | parseValueType }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="项目可选值" min-width="150">
                    <template slot-scope="scope">
                        <div v-html="scope.row.value_options"></div>
                    </template>
                </el-table-column>
                <el-table-column
                        type="selection"
                        width="55"
                >
                </el-table-column>
            </el-table>
            <!-- footer 分页条 -->
            <template slot="footer">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="itemQuery.page"
                        :page-sizes="[10,20,30,50]"
                        :page-size="itemQuery.limit"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="itemQuery.total"
                        style="margin: -10px;">
                </el-pagination>
            </template>
            <div style="text-align: center;margin-top: 10px">
                <el-button size="small" type="primary" v-show="!newItem" @click="joinFrom">加入表单</el-button>
            </div>

        </el-dialog>
    </el-row>
</template>

<script>
    import { submitActivityForm } from '@/api/activityform'
    import { submitItemForm } from '@/api/activityform'
    import { Message } from 'element-ui'
    import {showStatus, activityShowType, isStatus, valueType } from '@/data/data'
    import { getActivityFormItems, getActivityFormInfo } from '@/api/activityform'
    import uploadimg from '@/components/lianhe/uploadimg'
    export default {
        name: 'detail',
        components: {
            uploadimg
        },
        data () {
            return {
                showStatus,
                activityShowType,
                isStatus,
                valueType,
                multiple:['2','3','5'],
                dialogItems:false,
                itemsLoading:false,
                newItem:false,
                form:{
                    title:'',
                    status:'',
                    show_type:'',
                    desc:'',
                    sort:'',
                    main_image:'',
                    start_at:'',
                    end_at:'',
                    items:[],
                    hospitals:[],
                },
                itemQuery:{
                    keyword:'',
                    limit:20,
                    page:1,
                    total:0,
                },
                itemForm:{
                    label:'',
                    is_required:'1',
                    value_type:'1',
                    sort:1,
                    value_options:'',
                },
                fileList: [],
                items:[],
                tableSelect: [],
                insertTableSelectList: [],
                selectItems: [],


            }
        },
        watch: {
            'itemQuery.keyword'(val) {
                this.getItems(1)
            }
        },
        methods: {
            handleItems(){
                this.getItems(1);
                this.newItem = false;
                this.dialogItems = true
            },
            selectionChange(val){
                this.insertTableSelectList = val;
            },
            toggleSelection(rows){
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row.id);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            submit(){
            	submitActivityForm(this.form).then(response => {
            	    let msg = this.form.id ? '修改' : '添加'
                    Message.success(msg+'活动成功')
                    this.newItem = false;
            	    this.$emit('hiddenThis',true)
                })
            },
            handleDelete(index, row){
                this.form.items.splice(index,1);
            },
            addItems(){
                submitItemForm(this.itemForm).then(response => {
                    Message.success('添加新表单项成功')
            	    this.getItems(1);
            	    this.newItem = false;
            	    this.itemForm = {
                        label:'',
                        is_required:'1',
                        value_type:'1',
                        sort:1,
                        value_options:'',
                    }
                })
            },
            resetForm(){
                this.form = {
                        title:'',
                        status:'',
                        show_type:'',
                        desc:'',
                        sort:'',
                        main_image:'',
                        start_at:'',
                        end_at:'',
                        items:[],
                        hospitals:[],
                }
                this.fileList = []
                let _this = this
                _this.$refs.logouploadimg.setFile(_this.fileList)
            },
            fetchData(id){
                getActivityFormInfo({id:id}).then(response => {
                    this.form = response.data
                    this.fileList = (this.form.main_image == '' ? [] : [{name: 'main_image', url: this.form.main_image}]);
                    let _this = this
                    let t = setTimeout(function () {
                        _this.$refs.logouploadimg.setFile(_this.fileList)
                        clearTimeout(t)
                    }, 200)
                    console.log(this.form)
                })

            },
            handleSizeChange (val) {
                this.itemQuery.limit = val
                this.getItems(1)
            },
            handleCurrentChange (val) {
                this.itemQuery.page = val
                this.getItems()
            },
            getItems(page){
                if(page){
                    this.itemQuery.page = page;
                }
                this.itemsLoading = true
                getActivityFormItems(this.itemQuery).then(response => {
                    this.itemQuery.total = response.data.total
                    this.items = response.data.list
                    this.itemsLoading = false
                })
            },
            joinFrom(){
                this.insertTableSelectList.forEach((row,index)=>{
                    row.sort = 1;
                    this.form.items.push(row);
                });
                this.insertTableSelectList = [];
                this.dialogItems = false;
            }
        }
    };

</script>

<style scoped>

</style>