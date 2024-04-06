// Import Functions
const sendMail = require('../middleware/nodemailing');
const { sendImage } = require('../middleware/uploadImage');
const { formatDateAndTime, generateUniqueId } = require ('../utils/basicFunctions')
const { find_data, find_task, extract_EVE, find_Event, Event_Inserter, Participation_Inserter } = require ('../utils/databaseFunctions')


const dashboardPage = async(req,res)=>{
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
  }
  
  const eventPage = async(req,res)=>{
    // res.sendFile(__dirname+'/html/events.html');
    let data = req.session.MAIN_DATA;
    let name = data.Username;
    let role = data.Role;
    // let name = "harsh";
    // let role = "Admin";
    let EventData = await extract_EVE();
    console.log(EventData);
    res.render('pages2/events',{"Name":name,"Role":role,"Events":EventData});
  }
  
  const communityPage = (req,res)=>{
    // res.sendFile(__dirname+'/html/communities.html');
    let data = req.session.MAIN_DATA;
    let name = data.Username;
    let role = data.Role;
    res.render('pages2/communities',{"Name":name,"Role":role});
  }
  
  const messagesPage = (req,res)=>{
    // res.sendFile(__dirname+'/html/messages.html');
    let data = req.session.MAIN_DATA;
    let name = data.Username;
    let role = data.Role;
    res.render('pages2/messages',{"Name":name,"Role":role});
  }
  
//   app.get('/mycollege',requireAuth,(req,res)=>{
//     // res.sendFile(__dirname+'/html/settings.html');
//     let data = req.session.MAIN_DATA;
//     let name = data.Username;
//     let role = data.Role;
//     res.render('pages2/mycollege',{"Name":name,"Role":role});
//   })
  
  //sub 
  
  const profilePage = (req,res)=>{
    // res.sendFile(__dirname+'/html/settings.html');
    let data = req.session.MAIN_DATA;
    let name = data.Firstname + " " + data.Lastname;
    let firstname = data.Firstname;
    let email = data.Email;
    // let name = data.firstname + " " + data.lastname;
    res.render('pages2/profile',{'Name':name,'Email':email, 'Firstname':firstname });
  }
  
  const createEvent = (req,res)=>{
    // res.sendFile(__dirname+'/html/settings.html');
    // let data = req.session.MAIN_DATA;
    // let name = data.firstname + " " + data.lastname;
    res.render('pages2/createEvents');
  }
  
  const createPost = (req,res)=>{
    res.render('pages2/createPost');
  }
  
  
  const particularEvent = async(req,res)=>{
    // res.sendFile(__dirname+'/html/settings.html');
    let ID = req.params.EveID;
    let EventData = await find_Event(ID);
    EventData.St_d = formatDateAndTime(EventData.St_d,EventData.St_t);
    let Tag = EventData.tag.split(',');
    // console.log("Event Data: ",EventData)
    // let name = data.firstname + " " + data.lastname;
    res.render('pages2/eventHome',{EventData:EventData,Tag:Tag});
  }
  
  const eventParticipatedDone = async(req,res)=>{
    // res.sendFile(__dirname+'/html/settings.html');
    let ID = req.params.EveID;
    let EventData = await find_Event(ID);
    let me = req.session.MAIN_DATA
    Participation_Inserter(EventData.title, EventData.Venue, new Date(), EventData.descp, EventData.tag, EventData.Organsiation, ID, me.UniqueId, me.Username, EventData.By )

    let subject = 'Congratulations on Applying!';
    let text = 'Hi '+me.Username+',\n Congratulations on applying for our events! - '+ EventData.title +'🎉 \n We appreciate your interest and can`t wait to review your application. Stay tuned for updates! \n\n Best, \nCCH'
    sendMail(me.Email, subject, text);
  
    res.redirect('/events');
  } 
  
  
  const eventCreatePost =  async(req,res) =>{
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
    // let img = "img1/event"+  Math.ceil(Math.random(0,3)) + ".jpeg";
    let descip = req.body.descrip;  
    let tag = req.body.tags;
    let organz = req.body.Organiz;
    let UniqueEV_Id = generateUniqueId();
    let comp = req.session.User;
  
    // Event_Inserter(title,venue,st_d,en_d,st_t,en_t,partic,link,img,descip,tag,organz,UniqueEV_Id,comp);
    console.log(req.file);
    // cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async(error, result) => {
    //   if (error) {
    //     console.error('Error uploading image:', error);
    //     return res.status(500).json({ error: 'Error uploading image' });
    //   }
    //   // Image uploaded successfully, return Cloudinary URL
    //   // res.json({ url: result.url });
    //   let img = result.url;
    //   Event_Inserter(title,venue,st_d,en_d,st_t,en_t,partic,link,img,descip,tag,organz,UniqueEV_Id,comp);
    //   res.redirect('/events');
    // }).end(req.file.buffer);

    sendImage().then((imageUrl)=>{
        Event_Inserter(title,venue,st_d,en_d,st_t,en_t,partic,link,imageUrl,descip,tag,organz,UniqueEV_Id,comp);
        res.redirect('/events');
    });
  
  
  }
  
  const logout = (req,res)=>{
      req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/');
        }
    });
  }


  module.exports = {
    dashboardPage,
    eventPage,
    communityPage,
    messagesPage,
    profilePage,
    createEvent,
    createPost,
    particularEvent,
    eventCreatePost,
    eventParticipatedDone,
    logout
  }