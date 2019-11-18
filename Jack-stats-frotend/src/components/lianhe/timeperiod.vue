<template>
  <div>
    <el-dialog title="设置预约检查日期" :visible.sync="dialogFormVisible">
      <el-form label-width="120px">
          <el-form-item label="检查门店：">
              <el-select v-model="item.organization_id" placeholder="检查机构">
                  <el-option v-for="(v, i) in organizationList" :label="v.name" :key="i"
                             :value="v.id" v-if="item.organization_id === v.id"></el-option>
              </el-select>
              <el-select v-model="item.shop_code" placeholder="检查门店">
                  <el-option
                          v-for="(v,i) in sourceCheckStoresList"
                          :key="i"
                          :label="v.name"
                          :value="v.id">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="预约检查日期：">
              <el-date-picker
                      v-model="item.date"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      :picker-options="pickerOptions0">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="时间段：">
              <el-select v-model="item.time_period">
                  <el-option label="上午" value="morning"></el-option>
                  <el-option label="下午" value="afternoon"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="次数：" v-if="type == 'treatment'">
                <el-input-number v-model="item.count"></el-input-number>
            </el-form-item>
          <div class="center mt2 mb2">
              <el-button type="primary" @click="confirmMessage">确认</el-button>
          </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getOrganizationsList, getCheckStoresList } from '@/api/hospital'
export default {
  name: 'timeperiod',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'source': '',
        'type': '',
        'checkstores': ''
      },
      shop_code: '',
      checkStoresList: [],
      sourceCheckStoresList: [],
      organizationList: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      item: {},
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      type: 'examination'
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleTimeperiod (item, type) {
      this.type = type
      this.item = item
      this.toggleCheckStoresOption(item.organization_id)
      this.dialogFormVisible = true
    },
    confirmMessage () {
      this.dialogFormVisible = false
      for (var i in this.sourceCheckStoresList) {
        if (this.item.shop_code === this.sourceCheckStoresList[i].id) {
          this.item.checkstore_name = this.sourceCheckStoresList[i].name
        }
      }
      this.$emit('handleSetTimeperiod', this.item)
    },
    handleFilter () {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.fetchData()
    },
    toggleCheckStoresOption (organization_id) {
      this.sourceCheckStoresList = []
      if (organization_id === '') {
        return
      }
      for (var i in this.checkStoresList) {
        if (this.checkStoresList[i].organization_id === organization_id) {
          this.sourceCheckStoresList.push(this.checkStoresList[i])
        }
      }
    },
    fetchData () {
      this.listLoading = true
      getCheckStoresList({ 'page': 1, 'limit': 500 }).then(response => {
        this.checkStoresList = response.data.list
        this.listLoading = false
      })
      getOrganizationsList({ 'page': 1, 'limit': 500 }).then(response => {
        this.organizationList = response.data.list
      })
    }
  }
}
</script>
