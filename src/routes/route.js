const express = require('express');
const router = express.Router();
const authentication = require('../controllers/authentication');
const mainControl = require('../controllers/mainController');
const { requireAuth, goo } = require('../middleware/Authenticator');

const multer = require('multer');
const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage: storage });


// Define routes for chat functionality

//Before Login

router.get('/',goo,authentication.landingPage)

router.get('/login',goo,authentication.loginPage)
router.post('/validate',authentication.validateUser)

router.get('/otp',requireAuth,authentication.sendOtp)
router.post('/otpverify',authentication.otpVerify)

router.get('/register',requireAuth,authentication.accountCreationForm)
router.post('/otpverify',authentication.accountCreationPost)

//After Login
//Main Pages
router.get('/profile',requireAuth,mainControl.profilePage)
router.get('/dash',requireAuth,mainControl.dashboardPage)
router.get('/events',requireAuth,mainControl.eventPage)
router.get('/communities',requireAuth,mainControl.communityPage)
router.get('/messages',requireAuth,mainControl.messagesPage)
router.get('/logout',requireAuth,mainControl.logout)

//Sub Pages
router.get('/creation',requireAuth,mainControl.createEvent)
router.post('/eventcreate',upload.single('eventpic'),mainControl.eventCreatePost)

router.get('/postcreate',requireAuth,mainControl.createPost)

router.get('/eventhomie/:EveID',requireAuth,mainControl.particularEvent)
router.get('/eventhomie/:EveID/DONE',requireAuth,mainControl.eventParticipatedDone)


// Define other chat routes...

module.exports = router;