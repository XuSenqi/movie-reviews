var User = require('../models/user');

//showsignup
exports.showSignup = function(req,res){
	res.render('signup',{
	title:'注册页面',
});
};

//showsignin
exports.showSignin = function(req,res){
	res.render('signin',{
	title:'登录页面',
});
};


//signup 
exports.signup = function(req,res){
    var _user = req.body.user;
    User.findOne({name:_user.name},function(err,user){
		 if(err){ console.log(err); }
		 if(user){ 
             return res.redirect('/signin');
            }
		 else{
		 		user = new User(_user);
				user.save(function(err,user){
					if(err){ console.log(err); }
					res.redirect('/admin/userlist');
				});
		 }
	});
};

//signin 
exports.signin = function(req,res){
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
			return res.redirect('/signup');
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
				return res.redirect('/signin');
			}
		});
	});
};


//userlist
exports.list = function(req,res){
    User.fetch(function(err,users){
		if(err){
			console.log(err);
		}
		res.render('userlist',{
			title:'用户列表页',
			users:users
	    });

	});
};

//logout
exports.logout = function(req,res){
     delete req.session.user;
	 //delete app.locals.user;
	 res.redirect('/');
};
