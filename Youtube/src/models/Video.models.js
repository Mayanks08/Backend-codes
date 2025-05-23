import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        VideoFile:{
            type: String,
            required: true

        },
        thumbnail:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        Description:{
            type:String,
            required:true
        },
        Duration:{
            type:Number,
            required:true
        },
        views:{
            type:Number,
            default:0
        },
        isPublised:{
            type:Boolean,
            default:true,
        },
        owner:{
            type:Schema.Types.ObjectId
        },
    },
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)