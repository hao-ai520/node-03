var mongoose = require('mongoose');

//连接本机test数据库,如果没有就自动创建
mongoose.connect('mongodb://127.0.0.1:27017/test',{useNewUrlParser:true});

//引用模式类型处理器
var schema = mongoose.Schema;

//设计模型
var userSchema=new schema({
    email:{
        type:String,
        require:true
    },
    nickname: {
        type: String,
        require: true
    },
    password:{
        type:String,
        require:true
    },
    created_time:{
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type:String,
        default:'../public/img/avatar-default.png'

    },
    bio:{
        type:String,
        default:''
    },

    gender:{
        type:Number,
        enum:[-1,0,1],
        default:-1
    },

    birthday:{
        type:Date
    },
    status:{
        type:Number,
        //0 没有权限限制
        //1 不可以评论
        //2 不可以登录 号已经封了
        enum: [0,1,2],
        default: 0

    }
});

//导出model
module.exports=mongoose.model('User',userSchema);