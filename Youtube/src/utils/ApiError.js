class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went error",  
        errors=[],
        stack= "",
        
        
     ){
            super(message)
            this.statusCode = statusCode
            this.errors = errors
            this.stack = stack
            this.data = null
            this.success=false
            this.message=message


            if(stack){
                this.stack=stack

            }else{
                Error.captureStackTrace(this,this.constructor)
            }
    }
}
 export {ApiError}