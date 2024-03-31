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




// var randomOTP = "";

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
  
const requireAuth = (req, res, next) => {   //Authenticator
    if (req.session.User) {
        next();
    } else {
        res.redirect('/');
    }
}

const goo = (req, res, next) => {
  if (req.session.User) {
      res.redirect('/dash');
  } else {
      next();
  }
}


app.get('/',goo,(req,res)=>{
    // res.sendFile(__dirname+'/html/index.html');
    res.render('pages/index');
})

app.get('/login',goo,(req,res)=>{
  // res.sendFile(__dirname+'/html/login.html');
  res.render('pages/login');
})

app.post('/validate',async(req,res) => {
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
  let randomOTP = generateOTP();
  req.session.otp = randomOTP;
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
})

app.get('/register',(req,res)=>{
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
})

app.post('/getdata',(req,res)=>{
  let fname = req.body.fname;
  let lname = req.body.lname;
  let username = req.body.username;
  let dob = req.body.dob;
  let mail = req.session.Email;
  let pass = req.session.Password;
 let gen = req.body.gender;
  let id = req.session.spID;
  req.session.User = id;
  console.log(fname,lname,username,dob,pass,gen,id);
  // Accounts.push(newAccount);
  accInsert(fname,lname,username,dob,gen,mail,pass,id);
  res.redirect('/dash');
})

app.get('/dash',requireAuth,async(req,res)=>{
  setTimeout(async () => {
    // let email = req.session.Email;
    // if((email=="")||(email==undefined)){
    //   console.log("Error");
    //   res.redirect('/login');
    // }
    // else
    let ide = req.session.User;
    let data = await find_data(ide);
    let task = await find_task(ide);
    req.session.MAIN_DATA = data;
    let name = data.Username;
    let role = data.Role;
    console.log(task);

    res.render('pages2/dashboard', { "Name": name, "Role": role, "Tasks": task });
}, 2000);
})

app.get('/events',requireAuth,async(req,res)=>{
  // res.sendFile(__dirname+'/html/events.html');
  let data = req.session.MAIN_DATA;
  let name = data.Username;
  let role = data.Role;
  let EventData = await extract_EVE();
  console.log(EventData);
  res.render('pages2/events',{"Name":name,"Role":role,"Events":EventData});
})

app.get('/communities',requireAuth,(req,res)=>{
  // res.sendFile(__dirname+'/html/communities.html');
  let data = req.session.MAIN_DATA;
  let name = data.Username;
  let role = data.Role;
  res.render('pages2/communities',{"Name":name,"Role":role});
})

app.get('/messages',requireAuth,(req,res)=>{
  // res.sendFile(__dirname+'/html/messages.html');
  let data = req.session.MAIN_DATA;
  let name = data.Username;
  let role = data.Role;
  res.render('pages2/messages',{"Name":name,"Role":role});
})

app.get('/mycollege',requireAuth,(req,res)=>{
  // res.sendFile(__dirname+'/html/settings.html');
  let data = req.session.MAIN_DATA;
  let name = data.Username;
  let role = data.Role;
  res.render('pages2/mycollege',{"Name":name,"Role":role});
})

//sub 

app.get('/profile',requireAuth,(req,res)=>{
  // res.sendFile(__dirname+'/html/settings.html');
  let data = req.session.MAIN_DATA;
  let name = data.Firstname + " " + data.Lastname;
  let firstname = data.Firstname;
  let email = data.Email;
  // let name = data.firstname + " " + data.lastname;
  res.render('pages2/profile',{'Name':name,'Email':email, 'Firstname':firstname });
})

app.get('/creation',(req,res)=>{
  // res.sendFile(__dirname+'/html/settings.html');
  // let data = req.session.MAIN_DATA;
  // let name = data.firstname + " " + data.lastname;
  res.render('pages2/createEvents');
})

app.get('/eventhomie/:EveID',async(req,res)=>{
  // res.sendFile(__dirname+'/html/settings.html');
  let ID = req.params.EveID;
  let EventData = await find_Event(ID);
  EventData.St_d = formatDateAndTime(EventData.St_d,EventData.St_t);
  let Tag = EventData.tag.split(',');
  // console.log("Event Data: ",EventData)
  // let name = data.firstname + " " + data.lastname;
  res.render('pages2/eventHome',{EventData:EventData,Tag:Tag});
})

app.get('/eventhomie/:EveID/DONE',async(req,res)=>{
  // res.sendFile(__dirname+'/html/settings.html');
  let ID = req.params.EveID;
  let EventData = await find_Event(ID);
  let me = req.session.MAIN_DATA
  Participation_Inserter(EventData.title, EventData.Venue, new Date(), EventData.descp, EventData.tag, EventData.Organsiation, ID, me.UniqueId, me.Username, EventData.By )
  let mailOptions = {
    from: process.env.SEND_EMAIL,
    to: me.Email,
    subject: 'Congratulations on Applying!',
    text: 'Hi '+me.Username+',\n Congratulations on applying for our events! - '+ EventData.title +'🎉 \n We appreciate your interest and can`t wait to review your application. Stay tuned for updates! \n\n Best, \nCCH'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect('/events');
})



app.post('/eventcreate', (req,res) =>{
  let title = req.body.title;
  let venue = req.body.Venue;
  let st_d = req.body.Start_d;
  let en_d = req.body.End_d;
  let st_t = req.body.Start_t;
  let en_t = req.body.End_t;
  let partic = req.body.Partici;
  if(partic == 1)
  partic = "Multiple";
  else
  partic = "Solo" ;
  let link = req.body.link;
  let img = "img1/event"+  Math.ceil(Math.random(0,3)) + ".jpeg";
  let descip = req.body.descrip;  
  let tag = req.body.tags;
  let organz = req.body.Organiz;
  let UniqueEV_Id = generateUniqueId();
  let comp = req.session.User;

  Event_Inserter(title,venue,st_d,en_d,st_t,en_t,partic,link,img,descip,tag,organz,UniqueEV_Id,comp);

  // console.log(title,venue,st_d,en_d,st_t,en_t,partic,img,link,img,descip,tag,organz);
  // console.log(partic);
  res.redirect('/events');
})

app.get('/logout',(req,res)=>{
    req.session.destroy((err) => {
      if (err) {
          console.error('Error destroying session:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.redirect('/');
      }
  });
})




//Mongoose
const mongoose = require('mongoose');
// const { Console } = require('console');
const CCH = mongoose.createConnection(process.env.MongoDBURL);


//Early
const acc_create = CCH.model('Account', { 
  Firstname: String ,
  Lastname: String ,
  Username: String ,
  Dateofbirth: Date ,
  Gender: String ,
  Email: String,
  Password: String,
  Gender: String,
  UniqueId: String,
  Role: String
});

function accInsert(firstname,lastname,username,dob,gen,email,pass,id){
  let data = new acc_create({
    Firstname : firstname,
    Lastname : lastname,
    Username : username,
    Dateofbirth :dob,
    Email:email,
    Password:pass,
    Gender: gen,
    UniqueId: id,
    Role: "User"
  })
  data.save().then(() => console.log("Permanents account created!!!"));
}



//New work
const Eve_create = CCH.model('Events', { 
  Title : String,
  Venue : String,
  St_d : Date,
  En_d :Date,
  St_t:String,
  En_t:String,
  Participant: String,
  Devfolio: String,
  img: String,
  descp: String,
  tag: String,
  Organsiation: String,
  EventID: String,
  By:String
});

function Event_Inserter(title,ven,std,end,stt,ent,parti,link,img,descrip,tagi,organi,id,composer){
  let data = new Eve_create({
    Title : title,
    Venue : ven,
    St_d : std,
    En_d :end,
    St_t:stt,
    En_t:ent,
    Participant: parti,
    Devfolio: link,
    img: img,
    descp: descrip,
    tag: tagi,
    Organsiation: organi,
    EventID: id,
    By: composer
  })
  data.save().then(() => console.log("Permanents Event created!!!"));
}

const Event_Participation = CCH.model('Participation', { 
  EventTitle : String,
  Venue : String,
  RegistrationTime : Date,
  descp: String,
  tag: String,
  Organsiation: String,
  EventID: String,
  UserID: String,
  UserName: String,
  By:String
});

function Participation_Inserter(title,ven,std,descrip,tagi,organi,Ev_id,Us_id,Us_name,comp){
  let data = new Event_Participation({
    EventTitle : title,
    Venue : ven,
    RegistrationTime : std,
    descp: descrip,
    tag: tagi,
    Organsiation: organi,
    EventID: Ev_id,
    UserID: Us_id,
    UserName: Us_name,
    By:comp
  })
  data.save().then(() => console.log("Participation created!!!"));
}

//Task Assign Bot 
const Tasks = CCH.model('Tasks', { 
  FromID: String,   //UniqueId
  FromName: String,   //Username
  ToID: String,      //UniqueID
  ToName: String,    //Username
  Message: String,     
  Deadline: String,
  Status: String
});

// class="text-white bg-l-grey text-[15px] rounded-full p-2  font-thin"

async function find_task(meriID){
  let Task = await Tasks.find({ ToID:meriID }).exec();

  
  return Task;
}









async function findacc(email,pass){
  let User = await acc_create.findOne({ Email:email }).exec();

  let ans = 0;
  // console.log(User.Password);
  if(User){
    if(User.Password == pass){
      return User.UniqueId;
    }
    else{
      return ans=1;
    }
  }
  else{
    return ans;
  }

}


//New Find 
async function find_data(id){
  let User = await acc_create.findOne({ UniqueId:id }).exec();

  return User;
}

async function find_Event(id){
  let User = await Eve_create.findOne({ EventID:id }).exec();

  return User;
}

async function extract_EVE(){
  let Events = await Eve_create.find({ En_d : { $gt: new Date() }});
  let results = [];
  // console.log(Events);
  if(Events != null)
  results = extractFields(Events);

  return results;
}



//Funnctionss

function generateOTP() {
  let otp = Math.floor(10000 + Math.random() * 90000);
  return otp;
}

function generateUniqueId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let uniqueId = '';

  for (let i = 0; i < 8; i++) {
    uniqueId += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return uniqueId;
}

// Function to extract specific fields from the array of objects
function extractFields(events) {
  return events.map(event => ({
      Title: event.Title,
      Venue: event.Venue,
      St_d: event.St_d,
      St_t: event.St_t,
      img: event.img,
      Organsiation: event.Organsiation,
      EventID: event.EventID
  }));
}

function formatDateAndTime(dateString, timeString) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const date = new Date(dateString);
  const day = days[date.getUTCDay()];
  const month = months[date.getUTCMonth()];
  const dayOfMonth = date.getUTCDate();
  const year = date.getUTCFullYear();

  const time = timeString.split(':');
  let hours = parseInt(time[0]);
  const minutes = time[1];

  // Convert hours to 12-hour format and determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Construct the formatted date and time string
  const formattedDateTime = `${day}, ${month} ${dayOfMonth} ${year}, ${hours}.${minutes} ${ampm}`;

  return formattedDateTime;
}


server.listen(process.env.Port,()=>{
    console.log("Server at port ",process.env.Port," !!!");
  }); 
