const {storage}=require('../config/config')
const {ref,uploadBytes,getDownloadURL}=require('firebase/storage')
const fs=require('fs')
/************************************HANDLE ERROR ROUTE************************************************ */

exports.errorHandler=(res,code,error,message)=>{
   return res.status(code).json({
        success:false,
        code:error.code,
        errorMessage:error.message,
        resMessage:message
   })
}

/************************************HUPLOAD IMAGE HELPER*************************************************/
exports.uploadImage=async(req,location)=>{
   try {
      const file=req.file
    
      const buff = fs.readFileSync(`uploads/${file.originalname}`);
      // // create a JSON string that contains the data in the property "blob"
     
      let cool=new Uint8Array(buff)
      // const storage = getStorage();
      const imageRef=`${location}/${file.originalname}`
      const storageRef = ref(storage, imageRef);
      
      // // 'file' comes from the Blob or File API
      const metadata = {
        contentType: file.mimetype,
      };
      const snapshot=await uploadBytes(storageRef, cool,metadata)
      const url=await getDownloadURL(snapshot.ref)
      fs.unlinkSync(`uploads/${file.originalname}`)

      return url;
 } catch (error) {
    return error.message
 }
}