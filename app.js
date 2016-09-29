var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var port  = process.env.PORT || 3001;


app.set('views','./views/pages');
app.set('view engine','jade');
app.use(express.static(path.join(__dirname, 'bower_components')))
app.use(bodyParser.urlencoded());

//设置index路由
app.get('/',function(req,res){
	res.render('index',{
		title:'首页',
		movies: [{
			title: '机械战警',
			_id: 1,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title: '机械战警',
			_id: 2,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title: '机械战警',
			_id: 3,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title: '机械战警',
			_id: 4,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title: '机械战警',
			_id: 5,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},
		{
			title: '机械战警',
			_id: 6,
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		}]
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