// express node应用搭建模块
var express = require('express');

// 加载表单序列化模块
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');

var session = require('express-session');
var logger = require('morgan');

var mongoStore = require('connect-mongo')(session);

//加载路径处理模块
var path = require('path');

//加载mongoDB数据处理模块
var mongoose = require('mongoose');

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

//设置视图文件夹
app.set('views','./app/views/pages');
//设置默认的模板引擎
app.set('view engine','jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}));


if('development' === app.get('env')){
	app.set('showStackError',true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug',true);
}
require('./config/routes')(app);



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



app.listen(port);
console.log('app started on port ' + port);