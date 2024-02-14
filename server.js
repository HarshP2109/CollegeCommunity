const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const server = require('http').createServer(app);
const session = require('express-session');
const ServerKey = 3000;


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// Main

app.get('/',(req,res)=>{
    res.render('pages/dashboard');
})

app.get('/events',(req,res)=>{
    res.render('pages/events');
})

app.get('/communities',(req,res)=>{
    res.render('pages/communities');
})

app.get('/messages',(req,res)=>{
    res.render('pages/messages');
})

app.get('/mycollege',(req,res)=>{
    res.render('pages/myCollege');
})

// NON MAIN

app.get('/creation',(req,res)=>{
    res.render('pages/createEvents');
})

app.get('/eventhomie',(req,res)=>{
    res.render('pages/eventHome');
})

app.get('/profile',(req,res)=>{
    res.render('pages/profile');
})



server.listen(ServerKey,()=>{
    console.log("Server at port ",ServerKey," !!!");
}); 