
//Models Import
const { userData } = require ('../models/Account')
const { eventData } = require ('../models/Event')
const { participant } = require ('../models/Participation')
const { connection } = require ('../models/Connection')
const { task } = require ('../models/Task')
const { groupData } = require ('../models/Group')
const { chat } = require ('../config/mongoose')

//Functions Import 
const { extractDomain , sorter, extractFields, generateUniqueId } = require ('./basicFunctions')
const { Connection } = require('mongoose')
const { messageSchema } = require('../models/Message')
const { updateActivityTable, AddActivityTable } = require('./dashboardFunctions')


//Account Related

function accInsert(firstname,lastname,username,dom,dob,gen,email,pass,id){
    let data = new userData({
      Firstname : firstname,
      Lastname : lastname,
      Username : username,
      Domain: dom,
      Dateofbirth :dob,
      Email:email,
      Password:pass,
      Gender: gen,
      UniqueId: id,
      Role: "User",
      About: null,
      SecondaryMail: null,
      imgUrl: null
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

  const checkConnection = async(fromId,toId) => {
    let query = {
        $or: [
          { 'Connection': { $regex: `^${fromId}:${toId}` } },
          { 'Connection': { $regex: `^${toId}:${fromId}` } }
        ]
      }; 
    let person = await connection.find(query, '');
    return person.length;
}

async function add_friend(from_id, To_id) {
  if (from_id != To_id) {
      let from_name = await find_friend(from_id);
      let Connecter = sorter(from_id, To_id);
      let To_name = await find_friend(To_id);

      let connect = await checkConnection(from_id, To_id);
      if (connect === 0) {
          if (To_name != 0) {
              let data = new connection({
                  FromUser: from_name, // Set FromUser field to from_name
                  FromID: from_id,
                  ToUser: To_name, // Set ToUser field to To_name
                  ToID: To_id,
                  Connection: Connecter
              });

              data.save().then(() => console.log('Friend Added'));
          }
      } else {
          console.log("Already there is a connection");
      }
  } else {
      console.log("Same User");
  }
}

  
  async function find_friend(frie_id) {
    let person = await userData.find({"UniqueId":frie_id}, 'Username');
    if(person.length==0)
      return 0;
    else
      return person[0].Username;
  }

  async function findConnection(fromId,domain){
    let query = {
        $or: [
          { 'Connection': { $regex: `^${fromId}:` } },
          { 'Connection': { $regex: `:${fromId}` } }
        ]
      }; 
    let connections = [];  
    let friend = await connection.find(query);
    let groups = await findGroup(fromId,domain);
    for(let i=0;i<friend.length;i++){
        let key;
        let data;
        // console.log(friend[i]);
        if(friend[i].FromID === fromId){
          key=friend[i].ToID;

          let person = await userData.find({"UniqueId":key}, 'Domain');
          //up can be used to display image of friend
          // console.log(person);

          data = {
            "Name" : friend[i].ToUser,
            "ID": key,
            "Domain": person[0].Domain
          }
        }else{
          key=friend[i].FromID;

          let person = await userData.find({"UniqueId":key}, 'Domain');
          //up can be used to display image of friend

          data = {
            "Name" : friend[i].FromUser,
            "ID": key,
            "Domain": person[0].Domain
          }
        }
  
        connections.push(data);
      }
    let chatTabs = {
      "Group": groups,
      "Connection": connections
    }
    return chatTabs;  
}





//Group Data 
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

//Group data
async function updateGroup(groupName, id) {
  try {
    // Check if the group already exists

    let data = await groupData.findOne({ "GroupName": groupName });

    if (!data) {
      // If group does not exist, add it
      add_group(groupName, groupName, [id], id);
      await userData.findOneAndUpdate({ UniqueId: id }, { Role: "Admin" });
    } else {
      // Update the group to add members
      const updatedGroup = await groupData.findOneAndUpdate(
        { GroupName: groupName },
        { $push: { Members: { $each: [id] } } },
        { new: true }
      );
      console.log('Group updated:', updatedGroup);
    }
  } catch (error) {
    console.error('Error updating group:', error);
  }
}


async function findGroup(id,domain){
  let person = await groupData.find({"Domain":domain});
  let data = [];
  person.forEach(group => {
    let str = group.Members.toString();
    if (str.includes(id)) {
       let specificData = {
        "GroupName": group.GroupName,
        "GroupID": group.GroupID,
        "Admin":group.Admin
       }
       data.push(specificData);
    }
  });

  return data;
}

async function checkGroup(domain, id){
  let groups = await groupData.find({"Domain": domain});
  let filteredGroups = groups.filter(group => group.Members.includes(id));
  // console.log(groups);
  // console.log(filteredGroups);
  // Map the filtered groups to th  e desired format
  let data = filteredGroups.map(group => ({
    GroupName: group.GroupName,
    GroupID: group.GroupID,
    Domain: group.Domain,
    Members: group.Members
  }));

  return data;

}



//Send Message 

function sendMessage(dataType,fromId,toId,fromName,toName,message,time){
  let tmp = ''
  if(dataType === "Group"){
    tmp = sorter(toId,toName);
  }else{
    tmp = sorter(fromId,toId);
  }
  console.log(tmp);
  let ChatModel = chat.model(tmp, messageSchema);
  let NewChat = new ChatModel({ FromUser:fromName, FromID:fromId, ToUser:toName, ToID:toId, Connection:tmp, Message: message, Time:time });
  NewChat.save().then(() => console.log(' Messageee Sentt!!!'));
}

async function getAllChatData(one,two) {
  let tmp = sorter(one, two);
  console.log(tmp);
  let ChatModel = chat.model(tmp, messageSchema);
  let data = await ChatModel.find({});
  console.log("We are at getAllCHatData");
  console.log(data);
  return data;
}


///Databasing Changing Functionss-----Harmfull

async function updateDomain(){
  try {
    // Find all documents that need to be updated
    const usersArray = await userData.find({});

    usersArray.forEach((data) => {
      let dati = data.UniqueId;
      let datName = data.Username;
      AddActivityTable(dati,datName);
      console.log(data.Username + " has been checked!");
    })

    console.log('Documents updated successfully.');
  } catch (error) {
    console.error('Error updating documents:', error);
  }
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
    add_group,
    findConnection,
    updateGroup,
    checkGroup,
    getAllChatData,
    sendMessage,


    updateDomain
  }