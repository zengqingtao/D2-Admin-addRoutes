<template>
  <d2-container>
    <template slot="header">
      <div class="headerNav">
        <div @click="jump">&lt;</div>
        <div>{{searchTime}} {{searchFactoryName}}的详细信息</div>
      </div>
    </template>
    <!-- d2-crud表 -->
    <div class="d2crud">
      <d2-crud
        :columns="crudColumns"
        :data="crudData"
        :loading="loading"
        :pagination="pagination"
        :rowHandle="rowHandle"
        @custom-emit-1="handleCustomEvent"
        @pagination-current-change="paginationCurrentChange"
      />
    </div>
    <!-- 对话框 -->
    <el-dialog
    title=""
    :visible.sync="dialogVisible"
    width="80%"
    height="1000px"
    >
    <span>{{fname}}</span>
    <ve-line class="ve-line" :data="chartData1"></ve-line>    
    <ve-line class="ve-line" :data="chartData2"></ve-line> 
    </el-dialog>
  </d2-container>
</template>

<script>
import { getDetailInfo } from '@/api/stat/getDetailInfo'
import { getStatList } from '@/api/stat/getStatList'
export default {
  name: 'detailinfo',
  data:function(){
    return {
      searchTime:'',//保存传递过来需要搜索的时间
      searchFactoryName:'',//保存传递过来需要搜索的工厂名称 
      fid:0,//详细信息的工厂id
      f_id:0,//查看的工厂id
      crudColumns:[
          {title:'日期',key:'date'},
          {title:'日订单量',key:'orderVolume'},
          {title:'日下单量',key:'unitQuantity'},
          {title:'uv与单量比',key:'proportion'},
          {title:'工厂',key:'factory'},
      ],
      crudData:[],
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
            text: '查看',
            type: 'success',
            size: 'small',
            emit: 'custom-emit-1'
          }
        ]
      },
      // 对话框
      dialogVisible:false,//保存对话框的默认关闭状态
      chartData1: {
        columns: ['date', 'orderVolume'],
        rows: []
      },
      chartData2: {
        columns: ['date', 'unitQuantity'],
        rows: []
      },
      fname:"",
    }
  },
  mounted(){
    this.searchTime = this.$route.query.date;
    this.searchFactoryName = this.$route.query.factory;
    this.fid = this.$route.query.fid;
    this.detailInfo();
  },
  methods:{
    // 返回上一页
    jump(){
      this.$router.go(-1);
    },
    // 请求数据
    detailInfo(){
      getDetailInfo({
        page:this.pagination.currentPage,//当前页码
        limit:this.pagination.pageSize,//当前页码数据最大条数
        date:this.searchTime,
        factory_id:this.fid
      }).then(res=>{
        this.crudData = res.list; //把数据赋值给d2-crud的crudData
        this.pagination.total = res.total;
      }).catch(err=>{
      })
    },
    // 请求统计数据
    statList(){
      const start_date = new Date(); 
      const end_date = new Date();
      start_date.setTime(start_date.getTime() - 3600 * 1000 * 24*15); //设置时间为昨天的前十五天
      end_date.setTime(end_date.getTime() - 3600 * 1000 * 24); //设置时间为昨天
      getStatList({
        page:1,//当前页码
        limit:this.pagination.pageSize,//当前页码数据最大条数
        start_date:start_date,
        end_date:end_date,
        factory_id:this.f_id //当前工厂id
      }).then(res=>{
        //把数据分别赋值给折线图的rows和d2-crud表的crudList
        console.log("res-------------:",res);
        var list =res.list;
        var row1 = [];
        var row2 = [];
        var obj1 = {};
        var obj2 = {};
        for(var i=0;i<list.length;i++){
          obj1["date"] = list[i]["date"];
          obj1["orderVolume"] = list[i]["orderVolume"];
          row1.push(obj1);
          obj2["date"] = list[i]["date"];
          obj2["unitQuantity"] = list[i]["unitQuantity"];
          row2.push(obj2);
          obj1 = {}; 
          obj2 = {}
        }
        this.chartData1.rows = row1;
        this.chartData2.rows = row2;
      }).catch(err=>{
        console.log(err);
      })
    },
    // d2-crud的自定义点击事件
    handleCustomEvent ({index, row}) {
      this.f_id = row.fid;
      this.statList(); //请求数据
      this.dialogVisible = true; //打开该对话框
      this.fname = row.factory;
    },
    // 点击页码触发的事件
    paginationCurrentChange(currentPage){
      this.pagination.currentPage = currentPage;
      this.detailInfo();//页码变动，重新请求对应页码的数据
      // this.currentPageChange();
    },

  }
}
</script>
<style scoped>
  .headerNav{
    width:300px;
    display:flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap:nowrap;
  }
  .headerNav>div:first-child{
    font-weight: 800;
    font-size:20px;
    color:#409eff;
  }
  .headerNav>div:first-child:hover{
    cursor: pointer;
    /* font-size:22px; */
  }
</style>