import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; 
const menuSchema = new Schema(
    {
    menuname : {
        type :String,
        required : true
       },
       category : {
        type : String,
        required :true
       },
       price : {
        type : Number,
        required : true
       },
       owner : {
        type : Schema.Types.ObjectId,
        ref : 'User'
       }
    },
    {
        timestamps:true
    }
)
menuSchema.plugin(mongooseAggregatePaginate)
export const Menu = mongoose.model("Menu",menuSchema)