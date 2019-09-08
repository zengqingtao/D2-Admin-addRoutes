const data = {
	code:1,
	msg:'可以登录',
	isLogined:0
}
export default [
    {
				path:"/api/checklogined",
				method:"post",
				handle({body}){
					return {
						code:1,
						msg:"success",
						data:data
					}
				}
    }
]