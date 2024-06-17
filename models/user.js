const mongoose=require("mongoose")
let schema=mongoose.Schema(
    {
        "name":{type:String,required:true},
        "admn":{type:String,required:true, unique: true},
        "dept":{type:String,required:true},
        "gender":{type:String,required:true},
        "addrs":{type:String,required:true},
        "email":{type:String,required:true, unique: true},
        "mob":{type:String,required:true, unique: true},
        "pswd":{type:String,required:true}
    }
)

let usermodel=mongoose.model("Users",schema);
module.exports={usermodel}