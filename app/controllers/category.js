var Category = require('../models/category');



//admin new page
exports.addnew = function(req,res){
    	res.render('category_admin',{
		title:'录入一个电影分类',
		category:{}
	});
};


//admin post movie
exports.save = function(req,res){
	
	var _category = req.body.category;
	var category = new Category(_category);

	category.save(function(err,category){
		if(err){
			console.log(err);
		}
		//保存成功后，跳转到更新的movie详情页
		res.redirect('/admin/category/list');
	});
	
};


exports.list = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err);
		}
		res.render('categorylist',{
			title:'电影列表',
			categories:categories
	    });

	});
};
