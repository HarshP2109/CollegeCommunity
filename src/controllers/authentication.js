
//Import Functions
const sendMail = require ('../middleware/nodemailing');
const { findacc , accInsert, updateDomain } = require ('../utils/databaseFunctions')
const { generateUniqueId , generateOTP, extractDomain} = require ('../utils/basicFunctions');
const { AddActivityTable } = require('../utils/dashboardFunctions');


const landingPage = async(req,res) => {

    res.render('pages/index');
}

const loginPage = (req,res) => {
  res.render('pages/login');
}

const validateUser = async(req,res) => {
  let l_email = req.body.loginemail;
  let l_pass = req.body.loginpass;

  
  let r_email = req.body.registeremail;
  let r_pass = req.body.registerpass;

  if((l_email!="")&&(l_pass!="")){        //login
     let LoginUser = {
      "Email": l_email,
      "Password": l_pass
    }
    console.log("Login");
    // email = l_email;
    console.log(LoginUser);

   let valid = await findacc(l_email,l_pass);
   console.log(valid);

    if(valid){
      if(valid == 1){
        console.log("Password failed");
        req.session.Email = l_email;
        res.redirect('/otp');
      }
      else{
        console.log("User Logged in");
        req.session.User = valid;
        res.redirect('/dash');
      }
    }
    else{
    res.redirect('/login');
    }
  }

  else if(r_email != "" && r_pass != ""){                                             //register
    let RegisterUser = {
      "Email" : r_email,
      "Pass" : r_pass
    }
    console.log("Register");
    // email = r_email;
    req.session.Email = r_email;
    req.session.Password = r_pass;
    // console.log(RegisterUser);

    res.redirect('/otp');
  }

}

const sendOtp = (req,res) => {
  console.log("Hello");
  let email = req.session.Email;
  if((email=="")||(email==undefined)){
    console.log("Error");
    res.redirect('/login');
  }
else{
    let randomOTP = generateOTP();
    req.session.otp = randomOTP;

    let subject = 'OTP for Login';
    let text = 'Your One-Time Password (OTP) is '+ randomOTP +' Please use this OTP to proceed with [action or verification process]. Do not share this OTP with anyone for security reasons.';
    sendMail(email, subject , text);
    
    console.log(randomOTP);
    // res.sendFile(__dirname+'/html/otp.html');
    res.render('pages/otp');
}
}

const otpVerify = (req,res) => {
  console.log(req.session.otp);
  let otp = req.session.otp;
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
}

const accountCreationForm = (req,res) => {
  let email = req.session.Email;
  if((email=="")||(email==undefined)){
    console.log("Error");
    res.redirect('/login');
  }
  else{
  let specialID = generateUniqueId();
  req.session.spID=specialID;
  res.render('pages/register',{'specialID':specialID});
  }
}

const accountCreationPost = async(req,res)=>{
  let fname = req.body.fname;
  let lname = req.body.lname;
  let username = req.body.username;
  let dob = req.body.dob;
  let mail = req.session.Email;
  let pass = req.session.Password;
 let gen = req.body.gender;
  let id = req.session.spID;
  req.session.User = id;
  AddActivityTable(id,username);
  console.log(fname,lname,username,dob,pass,gen,id);
  // Accounts.push(newAccount);
  let dom = extractDomain(id);
  accInsert(fname,lname,username,dom,dob,gen,mail,pass,id);
  await updateGroup(dom,id);
  res.redirect('/dash');
}


module.exports = {
    landingPage,
    loginPage,
    validateUser,
    sendOtp,
    otpVerify,
    accountCreationForm,
    accountCreationPost
}