var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
// 模式模板
var CommentSchema = new mongoose.Schema({
	//定义movie为ObjectId类型，关联表Movie
	movie:{type:ObjectId,ref:'Movie'},
	//评论者
    from:{type:ObjectId,ref:'User'},
	// reply:[{
	// 	//评论者
	// 	from:{type:ObjectId,ref:'User'},
	// 	//被评论者
	// 	to:{type:ObjectId,ref:'User'},
	// 	//评论内容
	// 	content:String	
	// }],
	//被评论者
	to:{type:ObjectId,ref:'User'},
    content:String,
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

});

CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}
	else{
		this.meta.updateAt = Date.now();
	}
	next();
});

CommentSchema.statics = {
	//取出数据库所有的数据，按更新时间排序
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	//查询单条数据
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb);
	}
};

module.exports = CommentSchema;