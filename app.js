// express node应用搭建模块
var express = require('express');

// 加载表单序列化模块
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var session = require('express-session');

var mongoStore = require('connect-mongo')(session);

//加载路径处理模块
var path = require('path');

//加载mongoDB数据处理模块
var mongoose = require('mongoose');

//加载mongoDB数据模型集
var Movie = require('./models/movie');

//加载User数据集
var User = require('./models/user');

// 加载函数库
// Underscor.js定义了一个下划线（_）对象，类似jquery的$
// 函数库的所有方法都属于这个对象。这些方法大致上可以分成：
// 集合（collection）、数组（array）、函数（function）、
// 对象（object）和工具（utility）五大类
// 说白了就是一个对以上数据有强大处理能力的模块
var _ = require('underscore');

// 端口设置
// process.env.PORT 这里是指Node环境中默认的端口
var port  = process.env.PORT || 3001;

//创建服务应用实例
var app = express();

var dbUrl = 'mongodb://localhost:27017/imooc';

//替换mongoose默认的promise为全局的promise
mongoose.Promise = global.Promise;
// 连接字符串格式为mongodb://主机名:端口/数据库名
mongoose.connect(dbUrl);


app.set('views','./views/pages');
//设置默认的模板引擎
app.set('view engine','jade');
app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}))

// 加载时间处理模块
// app.locals对象字面量中定义的键值对，
// 是可以直接在模板中使用的，
// 就和res.render时开发者传入的模板渲染参数一样
// 这里是指可以在模板中使用moment方法
// 在list.jade中我们需要将数据中的时间转换成mm/dd/yyyy
// 那么就需要用到moment，所以这里是为了将该方法能传入到模板中
// 这里如果换成app.locals.dateFun = require('moment');
// 在list模板中我们就需要 #{dateFun(xxxxx).format(MM/DD/YYYY)}
app.locals.moment = require('moment');


//设置index路由
app.get('/',function(req,res){
		console.log('user in session');
		console.log(req.session.user);
		var _user = req.session.user;
		if(_user){
			app.locals.user = _user;
		}
    //客服端发起请求服务器，取出movies所有的数据，此时movies是一个movie的数组集
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		// console.log(movies);
		res.render('index',{
			title:'首页',
			movies:movies
	    })

	})
})

//signup 

app.post('/user/signup',function(req,res){
	var _user = req.body.user;

	User.findOne({name:_user.name},function(err,user){
		 if(err){ console.log(err); }

		 if(user){ return res.redirect('/');}

		 else{
		 		var user = new User(_user);
				user.save(function(err,user){
					if(err){ console.log(err); }
					res.redirect('/admin/userlist')
				})
		 }
	})
})

//userlist page
app.get('/admin/userlist',function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist',{
			title:'用户列表页',
			users:users
	    })

	})
})

//signin 
app.post('/user/signin',function(req,res){
	//先拿到提交的用户名和密码信息
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;

	//去数据库查询用户名为name的数据，如果有就执行比对密码的方法
	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err);
		}

		//用户名不存在时，跳转到首页
		if(!user){
			return res.redirect('/');
		}

		//用户名存在，比对密码
		user.comparePassword(password,function(err,isMatch){
			if(err){ 
				console.log(err);
			}

			if(isMatch){
				req.session.user = user;
				return res.redirect('/');
			}
			else{
				console.log('Your password is not Match!');
				return res.redirect('/');
			}
		})
	})
})


app.get('/logout',function(req,res){
	 delete req.session.user;
	 delete app.locals.user;
	 res.redirect('/');
})
// 加载detail page
// 访问路径就是localhost :3000/movie/id
app.get('/movie/:id',function(req,res){
	//当客服端访问某个id的movie时，触发服务器查询该id的movie
	var id = req.params.id
	Movie.findById(id,function(err,movie){
		res.render('detail',{
		title:'Imooc'+movie.title,
		movie:movie
		})
	})
})

app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'后台录入页',
		movie: {
		title: '',
		doctor: '',
		country: '',
		year: '',
		poster: '',
		flash: '',
		summary: '',
		language: ''
		}

	})
})

//admin update movie
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id;

	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}

			res.render('admin',{
				title:'Imooc 后台更新页面',
				movie:movie
			})
		})
	}
})
//admin post movie
app.post('/admin/movie/new',function(req,res){
	//提交后尝试获取当前movie的id
	var id = req.body.movie._id;
	//提交后获取当前movie的对象字面量
	var movieObj = req.body.movie;
	console.log(movieObj);
	var _movie;
	//如果id存在，执行更新操作
	if(id !== 'undefined'){
		//查询某id的movie
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			//查询出来后，合并更新的和老的movie
			_movie = _.extend(movie,movieObj);
			//执行保存方法
			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				//保存成功后，跳转到更新的movie详情页
				res.redirect('/movie/'+ movie._id)
			})
		})
	}
	//如果id不存在，执行新增方法
	else{
		_movie = new Movie({
			doctor:movieObj.doctor,
			title:movieObj.title,
			country:movieObj.country,
			language:movieObj.language,
			year:movieObj.year,
			poster:movieObj.poster,
			summary:movieObj.summary,
			flash:movieObj.flash
		})

		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			//保存成功后，跳转到更新的movie详情页
			res.redirect('/movie/'+ movie._id)
		})
	}
})

app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'imooc 列表页',
			movies:movies
	    })

	})
})

//list delete movie
app.delete('/admin/list',function(req,res){
	var id = req.query.id

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
			}
			else{
				res.json({success:1})
			}
		})
	}
})

app.listen(port);
console.log('app started on port ' + port);