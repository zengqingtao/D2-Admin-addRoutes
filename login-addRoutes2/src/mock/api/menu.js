const data = [{
		  "id": "BDF85330-CBD5-360F-BFE9-CF5632610258",
		  "title": "数据统计",
		  "path": "\/stats",
		  "component": "Layout",
		  "icon": "navicon",
		  "parentID": "0000",
		  "_level": 1,
		  "children": [{
			  "id": "46A8335D-8A85-38FC-505A-6E9DE254B801",
			  "title": "数据统计",
			  "path": "dataItem",
			  "component": "views\/stats\/dataItem",
			  "icon": "caret-right",
			  "parentID": "BDF85330-CBD5-360F-BFE9-CF5632610258",
			  "_level": 2
		  },]
	  }]
import util from '@/libs/util.js'
export default [
{
	path: '/api/menu/usermenu',
	method: 'get',
	handle ({ body }) {
		var uuid = util.cookies.get("uuid");
		if(uuid=="admin-uuid"){
			return {
				code: 1,
				msg: '查询成功',
				data: data
			}
		}else if(uuid=="editor-uuid"){
			return {
				code: 1,
				msg: '查询成功',
				data: data1
			}
		}
	}
}
]

const data1 =[{
	"id": "33250196-28C7-08C5-5527-B915EB129C39",
	"title": "用户管理",
	"path": "\/demo",
	"component": "Layout",
	"icon": "qq",
	"parentID": "0000",
	"_level": 1,
	"children": [{
		"id": "FED731A4-45D4-C3D9-DD19-22F5460BECE1",
		"title": "就诊人",
		"path": "page1",
		"component": "views\/demo\/page1",
		"icon": "caret-right",
		"parentID": "33250196-28C7-08C5-5527-B915EB129C39",
		"_level": 2
	}]
}, {
	"id": "C8A0F119-CA51-09DD-10CA-9F6791A19D0C",
	"title": "药品管理",
	"path": "\/medicine",
	"component": "Layout",
	"icon": "medkit",
	"parentID": "0000",
	"_level": 1,
	"children": [{
		"id": "51912656-0F30-D1CF-3140-AF58C7D84892",
		"title": "药品",
		"path": "medicinelist",
		"component": "views\/medicine\/medicinelist",
		"icon": "caret-right",
		"parentID": "C8A0F119-CA51-09DD-10CA-9F6791A19D0C",
		"_level": 2
	},]
}, {
	"id": "B4242201-5DE1-6766-79B5-95DFB8EE901F",
	"title": "检查项目",
	"path": "\/examination",
	"component": "Layout",
	"icon": "medkit",
	"parentID": "0000",
	"_level": 1,
	"children": [{
		"id": "0026DAB8-2EC9-6E5E-C53E-89A13646B32D",
		"title": "检查项目",
		"path": "examinationslist",
		"component": "views\/examination\/examinationslist",
		"icon": "caret-right",
		"parentID": "B4242201-5DE1-6766-79B5-95DFB8EE901F",
		"_level": 2
	},]
}]