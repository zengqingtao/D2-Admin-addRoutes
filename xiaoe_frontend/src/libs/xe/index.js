
/**
 * 2019-08-16
 * Powered By CATT-L
 * 
 */

import util from '@/libs/util.js';
var Base64 = require('js-base64').Base64;

var xe = {};

xe.Base64 = Base64;

xe.fakeBearerToken = function(){

	var header = {};
	var payload = {
		exp: 2147483647,
		nbf: 0,
	};

	header = JSON.stringify(header);
	payload = JSON.stringify(payload);

	header = Base64.encode(header);
	payload = Base64.encode(payload);

	var sign = "asdfghjkl";

	return `${header}.${payload}.${sign}`;

};


/**
 * 将 Bearer Token 字符串的头和载荷解码
 * @param  {string} bearerToken
 * @return {object} 
 *         header 头
 *         payload 载荷
 */
xe.decodeBearerToken = function(bearerToken){

	if(typeof bearerToken != "string") return null;

	// 根据小数点分割
	var arr = bearerToken.split(".");

	if(arr.length < 3) return null;
	
	var header  = null;
	var payload = null;

	// base64 解码和转换 JSON 对象
	try {
		header = JSON.parse(Base64.decode(arr[0]));
		payload = JSON.parse(Base64.decode(arr[1]));
	} catch (err){
		header = null;
		payload = null;
	}

	if(header == null) return null;

	return {header, payload};

};

/**
 * 在本地判断 Bearer Token 是否有效
 *
 * 通过判断是否存在符合格式的 token
 * 以及浏览器时间戳是否在 token 所宣称的有效时间区间以内(开区间)
 * 
 * @return {bool} true 有效 false 无效
 */
xe.checkTokenExpired = function(){

	var bearer = util.cookies.get("bearer");
    var bearer = xe.decodeBearerToken(bearer);

    if(! bearer) return false;


    var payload = bearer.payload;

	// 失效时间
	var exp = payload.exp;
	// 生效时间
	var nbf = payload.nbf;

	var cur = Math.round((+ new Date()) / 1E3);

    console.log({cur, exp, nbf});

    // 给 10 秒冗余
	if(cur + 10 <= nbf) return false;
	if(cur - 10 >= exp) return false;

	return true;
};





export default xe;