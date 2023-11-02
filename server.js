const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const server = require('http').createServer(app);
var nodemailer = require('nodemailer');
const session = require('express-session');
const ServerKey = 3000;

//Temporary Database

// var TEMPAccounts = [];
var Accounts = [{"Email":"fameerpatil@gmail.com","Password":"abc"}];

//Temporary Database




var randomOTP = "";

require('dotenv').config()
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SEND_EMAIL,
      pass: process.env.SEND_PASS
    }
  });
  

//   app.post('/', async (req,res)=>{
//     transporter.sendMail(mailOptions, function(error, info){
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });
//       res.redirect('/');
// });

app.get('/',(req,res)=>{
    // res.sendFile(__dirname+'/html/index.html');
    res.render('pages/index');
})

app.get('/login',(req,res)=>{
  // res.sendFile(__dirname+'/html/login.html');
  res.render('pages/login');
})

app.post('/validate',async(req,res) => {
  let l_email = req.body.loginemail;
  let l_pass = req.body.loginpass;

  
  let r_email = req.body.registeremail;
  let r_name = req.body.registername;
  let r_num = req.body.registernumber;

  if((l_email!=undefined)&&(l_pass!=undefined)){        //login
    let LoginUser = {
      "Email": l_email,
      "Password": l_pass
    }
    console.log("Login");
    // email = l_email;
    console.log(LoginUser);

   let valid = await findacc(l_email,l_pass);
   console.log(valid);

    if(valid > 0){
      if(valid == 1){
        console.log("User Logged in");
        req.session.Email = l_email;
        res.redirect('/dash');
      }
      else if(valid == 2){
        console.log("Password failed");
        req.session.Email = l_email;
        res.redirect('/otp');
      }
    }
    else{
    res.redirect('/login');
    }
  }

  else{                                             //register
    let RegisterUser = {
      "Name" : r_name,
      "Number" : r_num,
      "Email" : r_email
    }
    console.log("Register");
    // email = r_email;
    req.session.Email = r_email;
    // console.log(RegisterUser);

    res.redirect('/otp');
  }
  // let login_email = req.body.login-email;
  // console.log(login_email,login_pass);

  
})

app.get('/otp',(req,res)=>{
  console.log("Hello");
  let email = req.session.Email;
  if((email=="")||(email==undefined)){
    console.log("Error");
    res.redirect('/login');
  }
else{
  randomOTP = generateOTP();
  let mailOptions = {
    from: process.env.SEND_EMAIL,
    to: email,
    subject: 'OTP for Login',
    text: 'Your One-Time Password (OTP) is '+ randomOTP +' Please use this OTP to proceed with [action or verification process]. Do not share this OTP with anyone for security reasons.'
  };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    console.log(randomOTP);
    // res.sendFile(__dirname+'/html/otp.html');
    res.render('pages/otp');
}
})

app.post('/otpverify', (req,res) => {
  console.log(randomOTP);
  let otp = randomOTP;
  // let enteredotp = req.body.otp;
  let a = req.body.ek.trim();
  let b = req.body.do.trim();
  let c = req.body.teen.trim();
  let d = req.body.char.trim();
  let e = req.body.paanch.trim();
  let email = req.session.Email;
  let valid = Accounts.find((acc)=> acc.Email == email)  
  let enteredotp = a+b+c+d+e;
  console.log("Entered RandomOTP : "+randomOTP);
  console.log("Entered OTP : "+otp);
  console.log(enteredotp+"      "+otp);
  if (enteredotp!=otp) {
    res.redirect('/otp');
  }
  else if(valid){
    res.redirect('/dash');
  }
  else{
    res.redirect('/register');
  }
})

app.get('/register',(req,res)=>{
  let email = req.session.Email;
  if((email=="")||(email==undefined)){
    console.log("Error");
    res.redirect('/login');
  }
  else
  res.render('pages/register');
})

app.post('/getdata',(req,res)=>{
  let fname = req.body.fname;
  let lname = req.body.lname;
  let username = req.body.username;
  let mail = req.body.email;
  let dob = req.body.dob;
  let pass = req.body.pass;
  let gen = req.body.gender;
  console.log(fname,lname,username,dob,pass,gen);

  // Accounts.push(newAccount);
  accInsert(fname,lname,username,dob,gen,mail,pass);

  res.redirect('/dash');
})

app.get('/dash',(req,res)=>{
  let email = req.session.Email;
  if((email=="")||(email==undefined)){
    console.log("Error");
    res.redirect('/login');
  }
  else
  res.render('pages/dashboard');
})

app.get('/event',(req,res)=>{
  // res.sendFile(__dirname+'/html/events.html');
  res.render('pages/events');
})

app.get('/community',(req,res)=>{
  // res.sendFile(__dirname+'/html/communities.html');
  res.render('pages/communities');
})

app.get('/message',(req,res)=>{
  // res.sendFile(__dirname+'/html/messages.html');
  res.render('pages/messages');
})

app.get('/setting',(req,res)=>{
  // res.sendFile(__dirname+'/html/settings.html');
  res.render('pages/settings');
})




//Mongoose
const mongoose = require('mongoose');
const CCH = mongoose.createConnection(process.env.MongoDBURL);



const acc_create = CCH.model('Account', { 
  Firstname: String ,
  Lastname: String ,
  Username: String ,
  Dateofbirth: Date ,
  Gender: String ,
  Email: String,
  Password: String,
  Gender: String
});

function accInsert(firstname,lastname,username,dob,gen,email,pass){
  let data = new acc_create({
    Firstname : firstname,
    Lastname : lastname,
    Username : username,
    Dateofbirth :dob,
    Email:email,
    Password:pass,
    Gender: gen
  })
  data.save().then(() => console.log("Permanents account created!!!"));
}



async function findacc(email,pass){
  let User = await acc_create.findOne({ Email:email }).exec();

  let ans = 0;
  // console.log(User.Password);
  if(User){
    if(User.Password == pass){
      return ans=1;
    }
    else{
      return ans=2;
    }
  }
  else{
    return ans;
  }

}




//Funnctionss

function generateOTP() {
  let otp = Math.floor(10000 + Math.random() * 90000);
  return otp;
}

server.listen(ServerKey,()=>{
    console.log("Server at port ",ServerKey," !!!");
  }); 