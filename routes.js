var express = require('express');
var User=require('./models/user');
var Topic = require('./models/Topic');
var md5 = require('blueimp-md5');

var router=express.Router();

//首页
router.get('/',function (request,response) {
    //console.log(request.session.isLogin);//true
    /*console.log(request.session.user);*/
   response.render('index.html',{
       user:request.session.user
   });
});

//登录
router.get('/login',function (request,response) {
   response.render('login.html');
});

//注册
router.get('/register',function (request,response) {
   response.render('register.html');
});

//注册的表单业务处理
router.post('/register',async function (request,response,next) {
  var body= request.body;
       try {
           //判断是否存在
           if (await User.findOne({email: body.email})) {
               return response.status(200).json({
                   err_code: 1,
                   message: '邮箱已存在!'
               })
           }

           if (await User.findOne({nickname: body.nickname})) {
               return response.status(200).json({
                   err_code: 2,
                   message: '用户名已存在!'
               })
           }
           //上面所有的条件都不满足则保存
           //对密码使用MD5加密
           body.password=md5(md5(body.password)+'itcast');
           await new User(body).save(function (err,user) {
              if (err){
                  return  next(err);
              }
               //注册成功 使用session来记录用户的登录状态
               request.session.user=user;
           });

           //重定向只对同步请求起作用对异步请求不起作用
           //response.redirect('/');

           response.status(200).json({
               err_code: 0,
               message: 'ok'
           })

       }catch (err) {
           return  next(err);
       }

   }
   );

//登录的表单业务处理
 router.post('/login',async function (request,response,next) {
     //获取数据
     var body=request.body;
     try{
         body.password=md5(md5(body.password)+'itcast');
         User.findOne({
             email:body.email,
             password:body.password
         },function (err,user) {
             if (err){
                 return  next(err);
             }
             if (!user){
                 return  response.status(200).json({
                     err_code:2,
                     message:'Email or password is invalid..'
                 })
             }
             //记录用户登录状态
             request.session.user=user;

             response.status(200).json({
                 err_code:0,
                 message:'success'
             })
         });


     }catch (err) {
        return  next(err);
     }
 });

 router.get('/topics/new',async  function (request,response) {

     response.render('topic/new.html',{user:request.session.user});
 });


 router.post('/topics/new',async  function (request,response,next) {
     //接收表单参数
     var body = response.body;

     //存入数据库
     new Topic(body).save(function (err,data) {
          if (err){
             return next(err);
          }
         response.status(200).json({
             err_code:0,
             message:'success'
         })
     });

 });

router.get('/topics/show',(req,res) => {
    Topic.findOne({_id:req.query.id},(err,data) => {
        if(err) {
            throw(err);
        }
        res.render('topic/show.html',{topic:data})
    })
});

router.post('/settings/profile',function(req,res) {
    var body = req.body;
    body.birthday = body.birthday + '';
    User.findByIdAndUpdate(req.session.user._id,body,function(err,data) {
        if(err) {
            return res.json({
                err_code:500
            })
        }
        req.session.user = data;
        console.log(req.session.user);
        res.json({
            err_code:0
        })
    })
});

router.get('/logout',(req,res) => {
    req.session.user = null;
    res.redirect('/');
});

//导出路由
module.exports=router;