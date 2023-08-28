let mongoose= require("mongoose")

let querieSchema= new mongoose.Schema({
 question:{type:String},
 answer:{type:String},
 step:{type:Number}
},{timestamps:true})

let queriesModel= mongoose.model("querie",querieSchema)
module.exports=queriesModel