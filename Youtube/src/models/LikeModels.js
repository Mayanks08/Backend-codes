import mongoose,{Schema} from 'mongoose';
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const LikesSchema = new Schema({
    video:{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    Comment:{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    Tweet:{
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    } 
   },{
    timestamps: true   
   }
   
);                                                                                                                                                                                 


LikesSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model('Like', LikesSchema);
