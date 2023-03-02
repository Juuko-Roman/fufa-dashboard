const express=require('express')
const multer=require('multer')

const router=express.Router()

const{storage,authorizeUser}=require('../middleware/middleware')
const {
    createAdmin,
    login,
    getAllAdmins,
    settingOne,
    getAllOnePackage,
    addVideo,
    appUpdate,
    privacyU,
    paymentsUpdate,
    gateWay,
    updatePrice,
    sample,
    getAllUsers,
    logout,
    updateVideo,
    updateAdmin
}=require('../controllers/controllers')


//multer
const memoStorage = multer.memoryStorage();
const supload=multer({storage:storage})
const upload = multer({ memoStorage });

router.post('/test',supload.single("pic"),createAdmin)
router.post('/login',login)
router.get('/admins',getAllAdmins)
router.post('/getPackage',getAllOnePackage)
router.post('/add',supload.single("pic"),addVideo)//need to change middleware
router.post('/updatevideo',supload.single("pic"),updateVideo)
router.post('/updateadmin',authorizeUser(['super_admin']),updateAdmin)
/**********************************USERS***************************************** */
router.get('/users',getAllUsers)
/****************App Settinng *************************************/
router.post('/about',upload.single("pic"),settingOne);//need to change middlewaare
router.post('/appipdate',appUpdate)
router.post('/privacy',privacyU)
router.post('/pay',paymentsUpdate)
router.post('/gateway',gateWay)
router.post('/price',updatePrice)
/****************************TEST ROUTES************************************* */
router.get('/logout',logout)
router.post('/ss',supload.single("pic"),sample)
router.post('/te',authorizeUser(['super_admin','admin']),(req,res)=>{
    const {name}=req.body
    res.json({
        name,
        message:"Authorized"
    })
})

module.exports=router