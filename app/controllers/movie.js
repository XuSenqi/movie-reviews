var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');

//detail page
exports.detail = function(req,res){
	//当客服端访问某个id的movie时，触发服务器查询该id的movie
	var id = req.params.id;
	Movie.findById(id,function(err,movie){
		//去Comment表里查询movie下所有的评论
		Comment
			.find({movie:id})
			.populate('from','name')
			.exec(function(err,comments){
			console.log('++' + comments);
			res.render('detail',{
				title:movie.title,
				movie:movie,
				comments:comments
			});
		});	
	});
};

//admin new page
exports.addnew = function(req,res){
    	res.render('admin',{
		title:'录入一个新电影',
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

	});
};

//admin update movie
exports.update = function(req,res){
	var id = req.params.id;

	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}

			res.render('admin',{
				title:'更新电影信息',
				movie:movie
			});
		});
	}
};

//admin post movie
exports.save = function(req,res){
	//提交后尝试获取当前movie的id
	var id = req.body.movie._id;
	//提交后获取当前movie的对象字面量
	var movieObj = req.body.movie;
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
				res.redirect('/movie/'+ movie._id);
			});
		});
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
		});

		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			//保存成功后，跳转到更新的movie详情页
			res.redirect('/movie/'+ movie._id);
		});
	}
};


exports.list = function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title:'电影列表',
			movies:movies
	    });

	});
};

//list delete movie
exports.del = function(req,res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err);
                res.json({success:0});
			}
			else{
				res.json({success:1});
			}
		});
	}
};