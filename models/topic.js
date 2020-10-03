//引用数据库
 var mongoose = require('mongoose');

//创建连接
mongoose.connect('mongodb://127.0.0.1:27017/test',{useNewUrlParser:true});

//引用模型处理器
var TopicSchemas = mongoose.Schema;

//设计模型
 var topicSchemas = new TopicSchemas({
  title:{
   type:String,
   default:'',
  },
  article:{
   type:String,
   default:'',
  },
  userId:{
   type:String,
  },
  type:{
   type:String
  }
 });

//导出设计模型
module.exports=mongoose.model('Topic',topicSchemas);