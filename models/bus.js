const mongoose=require("mongoose")
let schema=mongoose.Schema(
    {
        "route":{type:String,required:true},
        "bno":{type:String,required:true, unique: true},
        "available":{ type: Boolean,default:true }
    }
)

let busmodel=mongoose.model("FisatBuses",schema);
module.exports={busmodel}