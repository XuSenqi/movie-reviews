var http = require('http');

http.request('http://www.imooc.com/search/?words=node',function(err,res){
	console.log(res);
})