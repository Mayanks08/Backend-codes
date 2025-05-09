import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one who is subcribeing
        ref: 'User',
    },
    channel:{
        type: Schema.Types.ObjectId, // one whom is being subsciber 
        ref: '"User',
    },
}, {
    
    timestamps: true
})


export const Subscription = mongoose.model("Subscription", subscriptionSchema);