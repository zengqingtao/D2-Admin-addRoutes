var data = {
    "total":10,
    "list":[
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4,"fid":1,"factory":"factory1"},
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4,"fid":2,"factory":"factory2"},
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4,"fid":3,"factory":"factory3"},
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4,"fid":4,"factory":"factory4"},
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4,"fid":5,"factory":"factory5"},
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4,"fid":6,"factory":"factory6"},
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4,"fid":7,"factory":"factory7"},
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4,"fid":8,"factory":"factory8"},
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4,"fid":9,"factory":"factory9"},
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":25,"proportion":0.4,"fid":10,"factory":"factory10"},
    ]
}
export default [
    {
      path: '/api/stat/getDetailInfo',
      method: 'post',
      handle ({body}) {
        console.log("body----：",body);
        if(JSON.stringify(data) == "{}"){
            return {
              code:0,
              msg:"fail",
              data:{}
            }
          }else{
              return {
                code:1,
                msg:"success",
                data:data
              }
          }
      }
    }
  ]
  