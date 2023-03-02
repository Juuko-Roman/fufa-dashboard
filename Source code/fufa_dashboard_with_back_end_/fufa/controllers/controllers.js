
const {firestore,auth,storage}=require('../config/config')
const { setDoc,doc,getDocs,collection,getDoc,updateDoc,serverTimestamp,addDoc,query,where}=require('firebase/firestore')
const { createUserWithEmailAndPassword,signInWithEmailAndPassword,getAuth,deleteUser } =require("firebase/auth");
const {errorHandler,uploadImage}=require('../helpers/magic');
const jwt=require('jsonwebtoken')
const {getStorage, ref, deleteObject} =require("firebase/storage") ;
const path=require('path');
const { async } = require('@firebase/util');


/*****************************CREATE ADMIN*********************************** */
exports.createAdmin=async(req,res)=>{
    try {
      const {email,password,name,id,role}=req.body        
       if(!email ||!password||!name||!id||!role){
        return res.status(201).json({
            message:"Empty Fields"
        })
       }
      const {user}=await createUserWithEmailAndPassword(auth, email, password)
      //send user to firestore for storage usin their id
      let location='images/admins'
      const image=await uploadImage(req,location)
      const docRef = await setDoc(doc(firestore, "admins",user.uid), {
          name,
          email,
          role,
          image,
          id,
          password
        });
    
   // Add a new document with a generated id.
      res.status(201).json({
           image,
          success: true,
          message:'Registration Successful',
      })
      } catch (error) {
            errorHandler(res,500,error,"Something TEST Went Wrong")
      }
}

/*********************************************LOGIN ROUTE********************************************************** */
exports.login=async(req,res)=>{
    try {
      const {email,password}=req.body        
      if(!email || !password){
       return res.status(201).json({
           message:"Empty Fields"
       })
      }
      //sending a token to frontend with role encrypted using jwt
      const sign=await signInWithEmailAndPassword(auth,email,password)
      const adminRef = collection(firestore, "admins");
      const q = await query(adminRef, where("email", "==",email));

       let role="";
           const querySnapshot = await getDocs(q);
           querySnapshot.forEach((doc) => {
           role=doc.data().role
       });
     //decode token
     const token= jwt.sign({role},process.env.TOKEN_SECRET,{expiresIn:'1440m'})//token expires in one day
      res.status(201).json({
          success:true,
          message:"SuccessFully logged In",
          token
         // sign//get token from login for verification
      })
    } catch (error) {
      errorHandler(res,500,error,"Something TEST Went Wrong")
    }
  }
/*********************************************LOGOUT ROUTE********************************************************** */
exports.logout=async(req,res)=>{
  try {
    
     let auth=await deleteUser('AGWehGYM2yNuQQIUYY0KR6FNlK02')
     res.json({
      auth
     })
  } catch (error) {
    res.json({
      kk:auth.currentUser,
      error:error.message
    })
  }
}
  /******************************************************FETCH ALL ADMINS****************************************** */

  exports.getAllAdmins =async(req,res)=>{
    try {
        const colRef = collection(firestore, "admins");
        const docs=await getDocs(colRef)
        let adminDocs=[]
        docs.forEach(doc => {
         adminDocs.push({
          data: doc.data(),
          id:doc.id
        })
      })
        res.status(201).json({
          success:true,
          adminDocs
        })
    } catch (error) {
        errorHandler(res,500,error,"Something TEST Went Wrong")


    }
  }

 /******************************************************update admin***************************************** */
 exports.updateAdmin=async(req,res)=>{
  try {
    const {role,id}=req.body
    if(!role||!id){
      return res.status(201).json({
        message:"Empty Fields"
    })
    }
    const adminRef=doc(firestore, "admins",id);
    await updateDoc(adminRef,{
     role
    })
    res.json({
      success:true,
      message:"Update Succesful"
    })
  } catch (error) {
     errorHandler(res,500,error,"Something TEST Went Wrong")
  }
 }

/********************************************PACKAGE CONTROLLERS************************************************ */
//0.get package
  exports.getAllOnePackage=async(req,res)=>{
    try {
      const{pack}=req.body
      // console.log(pack)
      if(!pack){
        return res.status(201).json({
          message:"Empty Fields"
      })
      }
      //create package array document
      const all=[]
      const colRef = collection(firestore, "categories","home",pack);
      const docs=await getDocs(colRef)
       
      docs.forEach(doc => {
        all.push({
          data:doc.data(),
          id:doc.id
        })
     })
     //adding id to element
    
     res.status(201).json({
      success:true,
      all
    })
    } catch (error) {
      errorHandler(res,500,error,"Something TEST Went Wrong")
    }
  }

//1.add video to specific 
exports.addVideo=async(req,res)=>{
  try {
    const {pack,description,title,url}=req.body
    if(!pack||!description ||!title||!url){
      return res.status(201).json({
        message:"Empty Fields"
    })
    }
    //upload video thumbnail
    let location=`images/${pack}`
    const ImageUrl= await uploadImage(req,location)
    //create a reference
    const packRef = collection(firestore, "categories","home",pack);
    let serverTime=serverTimestamp();
    const docRef=await addDoc(packRef,{
       created:serverTime,
       id:pack,
       likes:0,
       premium:false,
       video_description:description,
       video_title:title,
       video_url:url,
       views:0,
       video_thumbnail:ImageUrl
    })
//response
res.status(201).json({
  success:true,
  docRef
})

  } catch (error) {
    errorHandler(res,500,error,"Something TEST Went Wrong")
  }
}

//2.update document
exports.updateVideo=async(req,res)=>{
  try {
    const{id,premium,description,pack,title,url}=req.body
    if(!id||!premium||!description||!title||!url ||!pack){
      return res.status(201).json({
        message:"Empty Fields"
    })
    }
    //check if image exists in body
    const videoRef=doc(firestore, "categories","home",pack,id);

    if(req.file){
      // const desertRef = ref(storage, 'https://firebasestorage.googleapis.com/v0/b/fufa-media-workspace.appspot.com/o/admin%2Fscan0001.jpg?alt=media&token=1520105b-4ef0-420c-a9a2-b923fec8092d');
      // await deleteObject(desertRef)
      let location=`images/${pack}`
      const ImageUrl= await uploadImage(req,location)
      await updateDoc(videoRef,{
        premium:premium,
        video_description:description,
        video_thumbnail:ImageUrl,
        video_title:title,
        video_url:url,
      })
      res.json({
        success:true,
        message:"Update Succesful"
      })
    }//else remove existing image fromstorage
    else{
      await updateDoc(videoRef,{
        premium:premium,
        video_description:description,
        video_title:title,
        video_url:url,
      })
      //response
      res.json({
        success:true,
        message:"Update Succesful"
      })
    }
  } catch (error) {
    errorHandler(res,500,error,"Something TEST Went Wrong")
  }
}

/************************************APP SETTINGS**************************************** */
exports.settingOne=async(req,res)=>{
  try {
    const {contact,copyright,description,email,facebook,logo,name,version,website,bkImage} = req.body
    if(!contact||!copyright||!description||!email||!facebook||!logo||!name||!version||!website||!bkImage){
      return res.status(201).json({
        message:"Empty Fields"
    })
    }
    //set doc
    const docRef=doc(db, "settings", "about_app");
    await updateDoc(docRef, {
      app_contact:contact,
      app_copyright:copyright,
      app_description:description,
      app_email:email,
      app_facebook:facebook,
      app_logo:logo,
      app_name:name,
      app_version:version,
      app_website:website,
      background_image:bkImage
    });
    return res.status(200).json({success:true,message:"Updated Successfully"})
  } catch (error) {
    errorHandler(res,500,error,"Something TEST Went Wrong")
  }
}

//1.app update
exports.appUpdate=async(req,res)=>{
  try {
    const {android,description,link,version,title,avail}=req.body
    if(!android ||!description||!link ||!version ||!title ||!avail){
      return res.status(201).json({
        success:false,
        message:"Empty Fields"
     })
    }
    //update app info
    const settingRef=doc(firestore, "settings","update");
    await updateDoc(settingRef,{
      android_link:android,
      description,
      link,
      new_version:version,
      title,
      update_available:avail
    })
    //response
    res.status(201).json({
      success:true,
     message:"Update Success"
    })

  } catch (error) {
    //error handling
    errorHandler(res,500,error,"Something TEST Went Wrong")
  }
}

//1.app update
exports.privacyU=async(req,res)=>{
  try {
     const {privacy}=req.body
     if(!privacy){
      return res.status(201).json({
        success:false,
        message:"Empty Fields"
     })
     }
     //create referenc to the doc
     const settingRef=doc(firestore, "settings","privacy_policy");
     await updateDoc(settingRef,{
      policy:privacy
    })
    //response
    res.status(201).json({
      success:true,
      message:"Update Success"
    })
  } catch (error) {
    //error handling
    errorHandler(res,500,error,"Something TEST Went Wrong")
  }
}
//2.app update
exports.paymentsUpdate=async(req,res)=>{
  try {
    //get boolean
    const {enable}=req.body
    if(!enable){
      return res.status(201).json({
        success:false,
        message:"Empty Fields"
     })
    }
  //set ref
  const settingRef=doc(firestore, "settings","payments");
       await updateDoc(settingRef,{
          enable_payments:enable
      })
  //response
  res.status(201).json({
    success:true,
    message:"Update Success"
  })

  } catch (error) {
    errorHandler(res,500,error,"Something TEST Went Wrong")
  }
}
//3.payment_gateway
exports.gateWay=async(req,res)=>{
  try {
    const {secret,public_key,enc_key}=req.body
    if(!secret ||!public_key||!enc_key){
      return res.status(201).json({
        success:false,
        message:"Empty Fields"
     })
    }
    //create reference
    const settingRef=doc(firestore, "settings","payment_gateway");
    await updateDoc(settingRef,{
      encryption_key:enc_key,
      public_key,
      secret
  })
//response
  res.status(201).json({
  success:true,
   message:"Update Success"
})

  } catch (error) {
    errorHandler(res,500,error,"Something TEST Went Wrong")
  }
}
//4.price update
exports.updatePrice=async(req,res)=>{
  try {
    const {pack,description,amount,duration}=req.body
    if(!description||!amount||!duration||!pack){
      return res.status(201).json({
        success:false,
        message:"Empty Fields"
     })
    }
    //convert string to no
    let d=parseInt(duration)
    //create reference
    const settingRef=doc(firestore, "settings","category_prices","prices",pack);
    //update doc
    await updateDoc(settingRef,{
       amount,
       description:description,
       duration,
     })
    //response
    res.status(201).json({
     success:true,
     message:"Update Success"
  })
    
  } catch (error) {
    errorHandler(res,500,error,"Something TEST Went Wrong")
  }
}

/****************************************************USER CONTROLLER******************************************************************** */
//0.get all user
exports.getAllUsers=async(req,res)=>{
  try {
    const users=[]
    const userRef = collection(firestore, "users");
    const docs=await getDocs(userRef)

    //loop through to acquire
    docs.forEach(doc => {
      users.push(doc.data())
   })

   res.status(201).json({
    success:true,
    users
   })
  } catch (error) {
    errorHandler(res,500,error,"Something TEST Went Wrong")
  }
}

exports.sample=async(req,res)=>{
  try {
    const {name}=req.body
    let location="admin"
    const url=await uploadImage(req,res,location)
    res.json({
      success:true,
      url,
      name
    })
  } catch (error) {
      res.json({
        error:error.message
      })
      console.log(error)
  }
}