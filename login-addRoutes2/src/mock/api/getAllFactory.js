  var list = [
    {"fid":0,"fname":"factory0"},
    {"fid":1,"fname":"factory1"},
    {"fid":2,"fname":"factory2"},
    {"fid":3,"fname":"factory3"},
    {"fid":4,"fname":"factory4"},
    {"fid":5,"fname":"factory5"},
    {"fid":6,"fname":"factory6"},
    {"fid":7,"fname":"factory7"},
    {"fid":8,"fname":"factory8"},
    {"fid":9,"fname":"factory9"},
    {"fid":10,"fname":"factory10"}
  ]
  export default [
    {
      path: '/api/factory/getAllFactory',
      method: 'post',
      handle () {
        // console.log("body----");
        if(list.length == 0){
            return {
              code:0,
              msg:"fail",
              data:{}
            }
          }else{
              return {
                code:1,
                msg:"success",
                data:{list}
              }
          }
      }
    }
  ]
  