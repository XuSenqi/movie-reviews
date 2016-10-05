var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

// 用户模式模板
var UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}

})

UserSchema.pre('save',function(next){
	var user = this;
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}

	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err) return next(err)

		bcrypt.hash(user.password,salt,function(err,hash){

			if(err) return next(err)

			user.password = hash;
		
			next();
		})
	})
})

//实例方法是什么？
UserSchema.methods = {
	comparePassword:function(_password,cb){
		//var user = this;
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err) return cb(err);
			console.log(_password);
			console.log(this.password);
      cb(null,isMatch)

		})
	}
}

//静态方法
UserSchema.statics = {
	//取出数据库所有的数据，按更新时间排序
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	//查询单条数据
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = UserSchema;