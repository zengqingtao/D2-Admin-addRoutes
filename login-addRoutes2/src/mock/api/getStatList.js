var data={
    total:15,
    list:[
      {"date":"2019-08-05","orderVolume":25,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-06","orderVolume":84,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-07","orderVolume":22,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-08","orderVolume":16,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-09","orderVolume":62,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-10","orderVolume":34,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-11","orderVolume":65,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-12","orderVolume":32,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-13","orderVolume":65,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-14","orderVolume":32,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-15","orderVolume":46,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-16","orderVolume":65,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-17","orderVolume":24,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-18","orderVolume":26,"unitQuantity":15,"proportion":0.4},
      {"date":"2019-08-20","orderVolume":53,"unitQuantity":15,"proportion":0.4}
    ]
  }
  
  export default [
      {
        path: '/api/stat/getStatList',
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
    