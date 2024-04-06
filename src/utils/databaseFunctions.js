
//Models Import
const { userData } = require ('../models/Account')
const { eventData } = require ('../models/Event')
const { participant } = require ('../models/Participation')
const { connection } = require ('../models/Connection')
const { task } = require ('../models/Task')
const { groupData } = require ('../models/Group')

//Functions Import
const { extractDomain , sorter, extractFields, generateUniqueId } = require ('./basicFunctions')


//Account Related

function accInsert(firstname,lastname,username,dob,gen,email,pass,id){
    let data = new userData({
      Firstname : firstname,
      Lastname : lastname,
      Username : username,
      Domain: extractDomain(email),
      Dateofbirth :dob,
      Email:email,
      Password:pass,
      Gender: gen,
      UniqueId: id,
      Role: "User"
    })
    data.save().then(() => console.log("Permanents account created!!!"));
  }

  async function findacc(email,pass){
    let User = await userData.findOne({ Email:email }).exec();
  
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

  async function find_data(id){
    let User = await userData.findOne({ UniqueId:id }).exec();
  
    return User;
  }



//Event Related

function Event_Inserter(title,ven,std,end,stt,ent,parti,link,img,descrip,tagi,organi,id,composer){
let data = new eventData({
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


function Participation_Inserter(title,ven,std,descrip,tagi,organi,Ev_id,Us_id,Us_name,comp){
    let data = new participant({
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

  
  async function find_Event(id){
    let User = await eventData.findOne({ EventID:id }).exec();
  
    return User;
  }
  
  async function extract_EVE(){
    let Events = await eventData.find({ En_d : { $gt: new Date() }});
    let results = [];
    // console.log(Events);
    if(Events != null)
    results = extractFields(Events);
  
    return results;
  }


  //Task 
  
  async function find_task(meriID){
    let Task = await task.find({ ToID:meriID }).exec();
    return Task;
  }


  //Add friend

  async function add_friend(from_id,To_id){     
    let from_name = await find_friend(from_id);
    let Connecter = sorter(from_id,To_id);
  
    let To_name = await find_friend(To_id);
    if(To_name!=0){
        let data = new connection({
            FromUser: from_name, FromID: from_id, ToUser: To_name, ToID: To_id, Connection: Connecter
        });
  
        data.save().then(() => console.log('Connection Data Inserted!!!'));
    }
  }
  
  async function find_friend(frie_id) {
    let person = await userData.find({"UniqueId":frie_id}, 'Name');
    if(person.length==0)
      return 0;
    else
      return person[0].Name;
  }
  
  function add_group(GroupName,domain,Users,Admin) {
    let Data = new groupData({
      GroupName: GroupName,
      GroupID: generateUniqueId(),
      Domain : domain ,
      Admin : Admin,
      Members : Users 
    })
    Data.save().then(() => console.log('Group Data Inserted!!'));
  }
  
  module.exports = {
    accInsert,
    findacc,
    find_data,
    Event_Inserter,
    Participation_Inserter,
    find_Event,
    extract_EVE,
    find_task,
    add_friend,
    find_friend,
    add_group
  }