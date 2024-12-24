# sms接口文档


**简介**:sms接口文档


**HOST**:localhost:9090


**联系人**:


**Version**:1.0


**接口路径**:/v2/api-docs


[TOC]






# post-controller


## getAllPosts


**接口地址**:`/api/posts`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|page|page|query|false|integer(int32)||
|size|size|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«PostVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||array|PostVO|
|&emsp;&emsp;content||string||
|&emsp;&emsp;cover||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": [
		{
			"content": "",
			"cover": "",
			"createdAt": "",
			"id": 0,
			"title": "",
			"updatedAt": "",
			"userId": 0,
			"username": ""
		}
	],
	"map": {},
	"msg": "",
	"status": 0
}
```


## searchPosts


**接口地址**:`/api/posts/search`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|keyword|keyword|query|false|string||
|page|page|query|false|integer(int32)||
|searchType|searchType|query|false|string||
|size|size|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«PostVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||array|PostVO|
|&emsp;&emsp;content||string||
|&emsp;&emsp;cover||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": [
		{
			"content": "",
			"cover": "",
			"createdAt": "",
			"id": 0,
			"title": "",
			"updatedAt": "",
			"userId": 0,
			"username": ""
		}
	],
	"map": {},
	"msg": "",
	"status": 0
}
```


## getUserPosts


**接口地址**:`/api/posts/user/{userId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|userId|path|true|integer(int64)||
|page|page|query|false|integer(int32)||
|size|size|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«PostVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||array|PostVO|
|&emsp;&emsp;content||string||
|&emsp;&emsp;cover||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": [
		{
			"content": "",
			"cover": "",
			"createdAt": "",
			"id": 0,
			"title": "",
			"updatedAt": "",
			"userId": 0,
			"username": ""
		}
	],
	"map": {},
	"msg": "",
	"status": 0
}
```


## createPost


**接口地址**:`/api/posts/user/{userId}`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|userId|path|true|integer(int64)||
|content||query|false|string||
|cover||query|false|string||
|title||query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«Post»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||Post|Post|
|&emsp;&emsp;content||string||
|&emsp;&emsp;cover||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;deleted||integer(int32)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;userId||integer(int64)||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": {
		"content": "",
		"cover": "",
		"createdAt": "",
		"deleted": 0,
		"id": 0,
		"title": "",
		"updatedAt": "",
		"userId": 0
	},
	"map": {},
	"msg": "",
	"status": 0
}
```


## getPost


**接口地址**:`/api/posts/{postId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postId|postId|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«PostVO»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||PostVO|PostVO|
|&emsp;&emsp;content||string||
|&emsp;&emsp;cover||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": {
		"content": "",
		"cover": "",
		"createdAt": "",
		"id": 0,
		"title": "",
		"updatedAt": "",
		"userId": 0,
		"username": ""
	},
	"map": {},
	"msg": "",
	"status": 0
}
```


## updatePost


**接口地址**:`/api/posts/{postId}`


**请求方式**:`PUT`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postId|postId|path|true|integer(int64)||
|content||query|false|string||
|cover||query|false|string||
|title||query|false|string||
|userId|userId|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«PostVO»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||PostVO|PostVO|
|&emsp;&emsp;content||string||
|&emsp;&emsp;cover||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;title||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;userId||integer(int64)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": {
		"content": "",
		"cover": "",
		"createdAt": "",
		"id": 0,
		"title": "",
		"updatedAt": "",
		"userId": 0,
		"username": ""
	},
	"map": {},
	"msg": "",
	"status": 0
}
```


## deletePost


**接口地址**:`/api/posts/{postId}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|postId|postId|path|true|integer(int64)||
|userId|userId|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«Void»|
|204|No Content||
|401|Unauthorized||
|403|Forbidden||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"map": {},
	"msg": "",
	"status": 0
}
```


# user-controller


## follow


**接口地址**:`/api/users/follow/{userId}`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|currentUserId|currentUserId|query|false|integer(int64)||
|userId|userId|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«Void»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"map": {},
	"msg": "",
	"status": 0
}
```


## getUserList


**接口地址**:`/api/users/list`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|page|page|query|false|integer(int32)||
|size|size|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«UserVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||array|UserVO|
|&emsp;&emsp;avatar||string||
|&emsp;&emsp;bio||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;email||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": [
		{
			"avatar": "",
			"bio": "",
			"createdAt": "",
			"email": "",
			"id": 0,
			"username": ""
		}
	],
	"map": {},
	"msg": "",
	"status": 0
}
```


## login


**接口地址**:`/api/users/login`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|password||query|false|string||
|username||query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«User»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||User|User|
|&emsp;&emsp;avatar||string||
|&emsp;&emsp;bio||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;deleted||integer(int32)||
|&emsp;&emsp;email||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;password||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": {
		"avatar": "",
		"bio": "",
		"createdAt": "",
		"deleted": 0,
		"email": "",
		"id": 0,
		"password": "",
		"updatedAt": "",
		"username": ""
	},
	"map": {},
	"msg": "",
	"status": 0
}
```


## updateProfile


**接口地址**:`/api/users/profile`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|avatar||query|false|string||
|bio||query|false|string||
|createdAt||query|false|string(date-time)||
|deleted||query|false|integer(int32)||
|email||query|false|string||
|id||query|false|integer(int64)||
|password||query|false|string||
|updatedAt||query|false|string(date-time)||
|username||query|false|string||
|userId|userId|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«User»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||User|User|
|&emsp;&emsp;avatar||string||
|&emsp;&emsp;bio||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;deleted||integer(int32)||
|&emsp;&emsp;email||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;password||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": {
		"avatar": "",
		"bio": "",
		"createdAt": "",
		"deleted": 0,
		"email": "",
		"id": 0,
		"password": "",
		"updatedAt": "",
		"username": ""
	},
	"map": {},
	"msg": "",
	"status": 0
}
```


## register


**接口地址**:`/api/users/register`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|email||query|false|string||
|password||query|false|string||
|username||query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«User»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||User|User|
|&emsp;&emsp;avatar||string||
|&emsp;&emsp;bio||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;deleted||integer(int32)||
|&emsp;&emsp;email||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;password||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": {
		"avatar": "",
		"bio": "",
		"createdAt": "",
		"deleted": 0,
		"email": "",
		"id": 0,
		"password": "",
		"updatedAt": "",
		"username": ""
	},
	"map": {},
	"msg": "",
	"status": 0
}
```


## unfollow


**接口地址**:`/api/users/unfollow/{userId}`


**请求方式**:`POST`


**请求数据类型**:`application/json`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|currentUserId|currentUserId|query|false|integer(int64)||
|userId|userId|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«Void»|
|201|Created||
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"map": {},
	"msg": "",
	"status": 0
}
```


## getUserInfo


**接口地址**:`/api/users/{userId}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|userId|userId|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«User»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||User|User|
|&emsp;&emsp;avatar||string||
|&emsp;&emsp;bio||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;deleted||integer(int32)||
|&emsp;&emsp;email||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;password||string||
|&emsp;&emsp;updatedAt||string(date-time)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": {
		"avatar": "",
		"bio": "",
		"createdAt": "",
		"deleted": 0,
		"email": "",
		"id": 0,
		"password": "",
		"updatedAt": "",
		"username": ""
	},
	"map": {},
	"msg": "",
	"status": 0
}
```


## getFollowers


**接口地址**:`/api/users/{userId}/followers`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|page|page|query|false|integer(int32)||
|size|size|query|false|integer(int32)||
|userId|userId|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«UserVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||array|UserVO|
|&emsp;&emsp;avatar||string||
|&emsp;&emsp;bio||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;email||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": [
		{
			"avatar": "",
			"bio": "",
			"createdAt": "",
			"email": "",
			"id": 0,
			"username": ""
		}
	],
	"map": {},
	"msg": "",
	"status": 0
}
```


## getFollowing


**接口地址**:`/api/users/{userId}/following`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|page|page|query|false|integer(int32)||
|size|size|query|false|integer(int32)||
|userId|userId|query|false|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|R«List«UserVO»»|
|401|Unauthorized||
|403|Forbidden||
|404|Not Found||


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|data||array|UserVO|
|&emsp;&emsp;avatar||string||
|&emsp;&emsp;bio||string||
|&emsp;&emsp;createdAt||string(date-time)||
|&emsp;&emsp;email||string||
|&emsp;&emsp;id||integer(int64)||
|&emsp;&emsp;username||string||
|map||object||
|msg||string||
|status||integer(int32)|integer(int32)|


**响应示例**:
```javascript
{
	"data": [
		{
			"avatar": "",
			"bio": "",
			"createdAt": "",
			"email": "",
			"id": 0,
			"username": ""
		}
	],
	"map": {},
	"msg": "",
	"status": 0
}
```