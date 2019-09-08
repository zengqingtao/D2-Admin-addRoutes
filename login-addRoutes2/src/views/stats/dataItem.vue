<template>
  <d2-container>
    <template slot="header">数据统计</template>
     <!-- 顶部 -->
    <div class="header">
      <div class="businessName">
        <span >工厂名称</span>
        <el-select v-model="factory"  placeholder="请选择">
          <el-option
            v-for="(item,i) in options"
            :key="i"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="statisticsTime">
        <div >统计时间</div>
        <div class="block">
          <el-date-picker
            v-model="start_time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <span> ~ </span>
          <el-date-picker
            v-model="end_time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <el-button type="success" @click="statList">搜索</el-button>
        <el-button type="danger" @click="reset">重置</el-button>
      </div>
    </div>
    <!-- 统计图部分 -->
    <div class="statisticalChart">
        <ve-line class="ve-line" :data="chartData" :settings="chartSettings"></ve-line>
    </div>
     <!-- 表格部分 此处自定义的和分页的还没添加-->
    <div>
      <d2-crud
        :columns="crudColumns"
        :data="crudList"
        :loading="loading"
        :pagination="pagination" 
        :rowHandle="rowHandle" 
        @custom-emit-1="handleCustomEvent"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
  </d2-container>
</template>

<script>
import { getAllFactory } from '@/api/factory/getAllFactory'
import { getStatList } from '@/api/stat/getStatList'
export default {
  name: 'dataitem',
  data:function(){
    // 因为列和行是对应的,所以这样才能设置指标的别名
    this.chartSettings = {
      labelMap: {
        date: '日期',
        orderVolume: '日订单量',
        unitQuantity:'日下单量',
        proportion:'uv与订单量'
      }
    }
    return {
      options:[],
      factory:"全部工厂",
      factorys:[],//保存所有的工厂
      fid:0,//保存当前工厂的id
      start_time:'',
      end_time:'',
      chartData: {//columns必须与rows同语言
        columns: ['date', 'orderVolume', 'unitQuantity', 'proportion'],
        rows: []
      },
      // crud初始数据
      crudColumns:[
        {title:'日期',key:'date'},
        {title:'日订单量',key:'orderVolume'},
        {title:'日下单量',key:'unitQuantity'},
        {title:'uv与单量比',key:'proportion'}
      ],
      crudList:[],
      loading:false,
      pagination:{
        currentPage:1,
        pageSize:15,
        total:0
      },
      // 自定义
      rowHandle: {
        custom: [
          {
            text: '详细信息',
            type: 'success',
            size: 'small',
            emit: 'custom-emit-1'
          }
        ]
      },
    }
  },
  created(){
    this.setDefaultTime();
    this.allfactory();
    this.statList();
  },
  watch:{
    /* 监听当前工厂的值，如果当前工厂的值发生变化，
    就遍历保存工厂的数组options，找到对应工厂的下标，赋值给fid*/
    factory(){
      for(var i=0;i<this.options.length;i++){
        if(this.factory == this.options[i]){
          this.fid = factorys[i].fid;
        }
      }
      this.statList();
    },    
  },
  methods:{
    // 请求所有工厂
    allfactory(){
      getAllFactory().then(res=>{
        this.options = ["所有工厂"];
        this.factorys = res.list;
        for(var i=0;i<res.list.length;i++){
          this.options.push(res.list[i].fname)
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    // 请求统计数据
    statList(){
      console.log("start_time:",this.start_time);
      console.log("end_time:",this.end_time);
      getStatList({
        page:this.pagination.currentPage,//当前页码
        limit:this.pagination.pageSize,//当前页码数据最大条数
        start_date:this.start_time,
        end_date:this.end_time,
        factory_id:this.fid //当前工厂id
      }).then(res=>{
        //把数据分别赋值给折线图的rows和d2-crud表的crudList
        this.chartData.rows = res.list;
        this.crudList = res.list;
        this.pagination.total = res.total;//修改d2-crud表的总条数
      }).catch(err=>{
        console.log(err);
      })
    },
    //d2-crud表的自定义点击事件
    handleCustomEvent ({index, row}) {
       this.$router.push({
         name:'detailinfo',
         query:{ //如果是单纯传参，此处使用params,如果是查询字符串格式，此处使用query
           "date":row.date,
           "factory":this.factory,
           "fid":this.fid
           }
       })
    },
    // 选择页码触发该方法
    paginationCurrentChange(currentPage){
      this.pagination.currentPage = currentPage;//修改页码
      this.statList();
      // this.currentPageChange();
    },
    // 设置默认时间
    setDefaultTime(){
      const start_date = new Date(); 
      const end_date = new Date();
      start_date.setTime(start_date.getTime() - 3600 * 1000 * 24*15); //设置时间为昨天的前十五天
      end_date.setTime(end_date.getTime() - 3600 * 1000 * 24); //设置时间为昨天
      this.start_time = start_date;
      this.end_time =end_date;
    },
    // 点击重置触发的方法
    reset(){
      this.setDefaultTime();
      this.statList();
    }
  }
}
</script>
<style scope> 
  .container{
    margin:0 auto;
  }
  .header,.businessName,.statisticsTime,.block{
    display:flex;
    align-items: center;
  }
  .header{
    justify-content: flex-start;
    flex-wrap: nowrap;
  }
  .businessName{
    width: 350px; 
    margin-left:10px; 
  }
  .businessName>span,.statisticsTime>div:first-child{
    width:75px;
  }
  .businessName>span,.statisticsTime>div,.block{
    margin-right:15px;
  }
  /* 统计折线图 */
  .statisticalChart{
    margin-top:20px;
  }
</style>