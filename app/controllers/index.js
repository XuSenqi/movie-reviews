var Movie = require('../models/movie');
//设置index路由
exports.index = function(req,res){
    console.log('user in session:');
    console.log(req.session.user);
    //客服端发起请求服务器，取出movies所有的数据，此时movies是一个movie的数组集
    Movie.fetch(function(err,movies){

        if(err){
            console.log(err);
        }
        
        // console.log(movies);
        res.render('index',{
            title:'首页',
            movies:movies
        });

         

    });
};
