const user_model = require("../Models/User-Model")

//create middlewares if request body have proper and correct information

const VerfiySingUpBody = async (res, req, next) => {
    try {
        // check for mail, name , userid,same user id.
        if(!req.body.name){
            return res.status(400).send({message: 'Name is required'})
        }
        if(!req.body.email){
            return res.status(400).send({message: 'email is required'})
        }
        if(!req.body.userId){
            return res.status(400).send(
                {message: 'Failed: userid is already present'})
        }

        const user = await user_model.findOne({userId : req.body.userId});
        
        if(user){
            return res.status(400).send({message: 'email is required'})
        }
        next()

    } catch (error) {
        console.log("Error in verify sign up body: ", error);
        res.status(500).send({
            message:"error in validating body request"
        })
    }
}
 module.exports ={
    VerfiySingUpBody:VerfiySingUpBody
 }