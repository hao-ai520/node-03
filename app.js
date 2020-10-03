var express = require('express');
var path = require('path');
var router=require('./routes');
var bodyParser = require('body-parser');
var session = require('express-session');
var app=express();

//开放公共资源
app.use('/public/',express.static(path.join(__dirname,'./public/')));
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')));

//模板引擎支持的有 ejs jade(pug) handlebars nunjucks art-template
app.engine('html',require('express-art-template'));
app.set('views',path.join(__dirname,'./views'));

//配置body-parse 解析post请求体的插件(注意一定要在加载路由之前)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//在Express 这歌框架中，默认是不支持cookie 和session的
//但是我们可以使用第三方中间件：Express-session 来支持
//1，下载安装 npm install Express-session
//2. 配置
app.use(session({
       secret:'+itcast',//配置加密字符串 它会在原来的基础之上和这个字符串拼起来加密 目的增强安全性 防止客户端恶意伪造
       resave: false,
       saveUninitialized:true //无论你是否使用session 我默认直接给你一把钥匙
}));
//3. 使用
//当把这个插件配置号之后 我们就可以通过req.session 来访问和设置session的成员
//添加session数据 req.session.foo='bar'
//访问session数据 req.session.foo
//默认session数据是存储在内存中，服务器已重启session就会丢失 在生成环境下会把session存储到持久化数据库里 设置失效时间和销毁时间 和过期重新生成时间


//加载路油
app.use(router);

//配置一个404处理中间件
app.use(function (request,response) {
       response.render('404.html');
});



//配置一个全局处理中间件
app.use(function (err,request,response,next) {
       if (err){
              return  response.status(500).json({
                     err_code:500,
                     message: err.message
              })
       }
});




app.listen(5000,function () {
       console.log('running ........')
});