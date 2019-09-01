const data1 = {
    "username":"管理员",
    "role":"00000000",
    "rolename":"",
    "permission":1
}
const data2 = {
	"username":"编辑",
	"role":"111111",
	"rolename":"",
	"permission":2
}
import util from '@/libs/util.js'
export default [
    {
			path:"/api/getUserInfo",
			method:'get',
			handle({body}){
				var uuid = util.cookies.get("uuid");
				if(uuid == "admin-uuid"){
					return {
						code:1,
						msg:"获取成功",
						data:data1
					}
				}else if(uuid == "editor-uuid"){
					return {
							code:1,
							msg:"获取成功",
							data:data2
						}
				}
			}
    }
]