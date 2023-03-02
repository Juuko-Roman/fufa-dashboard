const multer=require('multer')
const jwt=require('jsonwebtoken')
/*************************IMAGE MIDDLEWARE***************************************** */
exports.storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

/*************************************TOKEN VALIDATION FROM CLIENT*************************************************** */
exports.authorizeUser=(permissions)=>{
    return (req,res,next)=>{
       const {token}=req.body
       if(!token){
        return res.status(403).json({
            message:"Unauthorized Access"
        })
       }
       const decoded= jwt.verify(token,process.env.TOKEN_SECRET)
       if(permissions.includes(decoded.role)){
        next()
       }else{
         res.status(403).json({
            message:"Unauthorized to perform action",
            decoded
         })
       }
    }
}