const mongoose=require("mongoose")
let schema=mongoose.Schema(
    {
        "name":{type:String,required:true},
        "adminid":{type:String,required:true, unique: true},
        "email":{type:String,required:true, unique: true},
        "mob":{type:String,required:true, unique: true},
        "pswd":{type:String,required:true}
    }
)

let adminmodel=mongoose.model("Admins",schema);
module.exports={adminmodel}