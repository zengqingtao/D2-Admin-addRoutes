# 小伊开放平台 Vue 前端

![Version](https://img.shields.io/badge/Version-v1.0-f61b73)
[![CATT-L](https://img.shields.io/static/v1?label=Powered%20by&message=CATT-L&color=f61b73)](https://github.com/CATT-L)



默认账密: admin



### 部署说明

温馨提示: 在国内直接用 `npm` 镜像会很慢, 但是我们有万能的淘宝!

所以可以使用[淘宝镜像](https://npm.taobao.org/)


执行下列语句安装淘宝镜像, 从此以后就可以用 `cnpm` 替代 `npm`
```shell
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

在 nodejs 10.x 以上的环境下, 执行

```shell
npm install
```

安装所需依赖以后, 执行

```shell
npm run serve
```

运行, 这时候就可以通过访问 `http://localhost:8080/` (也有可能是其它端口, 控制台会输出) 进行访问了;  

`npm run dev`, `npm run start` 都是 `npm run serve` 的糖语句, 详情可查看 `package.json`



### 更新记录

* 2019-08-16 CATT-L 登录和路由动态加载功能
