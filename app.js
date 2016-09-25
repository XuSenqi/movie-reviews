var express = require('express');
var app = express();
var port  = process.env.PORT || 3001;


app.set('views','./views');
app.set('view engine','jade');


//设置index路由
app.get('/',function(req,res){
	res.render('index',{
		title:'首页'
	})
})

app.get('/movie/:id',function(req,res){
	res.render('detail',{
		title:'详情页'
	})
})

app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'后台录入页'
	})
})

app.get('/admin/',function(req,res){
	res.render('list',{
		title:'列表页'
	})
})

app.listen(port);
console.log('app started on port ' + port);