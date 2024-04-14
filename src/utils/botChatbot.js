
const { run } = require("../middleware/geminiAPI");
const { userData } = require("../models/Account");
const { task } = require("../models/Task");


async function chatwithbot(message){

   let query = " ' " + message +" ' If this message is vulgar then dont reply or else reply him normally ";
   let response = await run(query);
   console.log("Message received "+response);
   return response;
}



async function getResponse(input, Groups, myId){

    let data = [];
    Groups.forEach(perGroup => {
        if (perGroup.Admin === myId){
            data = data.concat(perGroup.Members);
        }
    })

    console.log(data);
    let MembersData = await userData.find({ UniqueId: { $in: data } });

    const names = MembersData.map(user => user.Firstname);
    //   const MembersData.push({Name : })
      console.log(names);

      const namesString = names.join(", "); // Join array elements with a comma and space
    // console.log(string);




    console.log(input);
    let query1 = " ' " + input + " ' if this sentence is like assigning any task to a particular person or personID defined in line then give output it in form of 'Task : (Elaborate the task), To : (Individual Name or PersonCode), Till: (Date/Deadline) in (3 letter of month and then date format eg Mar 3)' if no committee or person Specified just say 'Specify clear information whom to assign task' if no deadline then write just 'Add 5', and task can only be given to the below names. this is list of people ' "+namesString+" ', if To is not in list then say (Cannot Identify the person) ";
    let query2 = "' " + input + " ' from the sentence Please provide the task assignment details, including the task description, the person or ID to whom it should be assigned, and the deadline if any. If the task is assigned to an individual, ensure their name matches one of the following: '"+ namesString + "'. If any information is unclear or missing, please respond as specify detail information, return response format 'To: , Task: , Deadline: ' separate To/Task/Deadline with comma, and deadline in (3 letter of month and then date format eg Mar 3 and if to and task is not defined then response should be 'Specify proper information of Task or Task Receiver' and if deadline is not set then write 'Add 5' in deadline ";
    //  To can be SPCA Committee, CCC Committee, CSI Committee, People can be akash , aryan, prajwal, rohan, yash, vrushal , gaurav, nirmit, sanika, sakshi, bhavya, ahswini "; 
    // console.log(query2);
    let response = await run(query2);
    console.log(response);
    let index = searcher(response ,'Specify','specify');
    if(index  == -1){
      let data = distributer(response);
      console.log(data);
      response = "Task assigned Successfully"
      await TaskAdder(MembersData,data, myId,Groups)

    }
    return response;
}


function searcher(line, word1, word2) {
    let index = line.indexOf(word1);
    if(index<0) 
    index = line.indexOf(word2)
  // document.getElementById("demo").innerHTML = index; 
  
    return index;
  }

  function getCurrentDatePlus5() {
    const currentDate = new Date();
    // Add 5 days to the current date
    const futureDate = new Date(currentDate.getTime() + (5 * 24 * 60 * 60 * 1000));
  
    // Array of month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
    // Get the 3-letter abbreviation of the month
    const monthAbbreviation = monthNames[futureDate.getMonth()];
  
    // Get the day of the month with leading zero if necessary
    const dayOfMonth = futureDate.getDate().toString().padStart(2, '0');
  
    // Return the formatted date string
    return `${monthAbbreviation} ${dayOfMonth}`;
  }


  function distributer(lines){
    // Split the string into an array of substrings using comma and space as separators
    const parts = lines.split(', ');
    
    // Initialize variables to store task, to, and till
    let task = '';
    let to = '';
    let till = '';
    
    // Iterate through the parts array to extract task, to, and till
    parts.forEach(part => {
        const [key, value] = part.split(': ');
    
        switch (key.trim()) {
            case 'To':
                to = value.trim();
                break;
            case 'Task':
                task = value.trim();
                break;
            case 'Deadline':
                till = value.trim();
                break;
            default:
                break;
        }
    });

    let iner = searcher(till,"add","Add");
    console.log(iner);
    if(iner != -1){
      till = getCurrentDatePlus5();
    }
    
    let data = {
      "Task": task,
      "To":to,
      "Deadline":till
    }
    // Output the extracted values
    // console.log("Task:", task);
    // console.log("To:", to);
    // console.log("Deadline:", till);
  
    return data;
  }


async function TaskAdder(Main,data,Id,Groups){
    let realUser = '';
    Main.forEach(user =>{
        if (user.Firstname === data.To){
            realUser = user;
        }
    });


    let grpName = '';
    Groups.forEach(gr => {
        let mem = gr.Members;
        if(mem.includes(realUser.UniqueId)){
            grpName = gr.GroupName;
        }
    })

    // console.log(Main);

    let userName = await userData.findOne({UniqueId: Id});


    let Data = new task({
        FromID: Id,   //UniqueId
        FromName: userName.Username,   //Username
        ToID: realUser.UniqueId,      //UniqueID
        ToName: realUser.Username,    //Username
        Committee: grpName,
        TaskDescript: data.Task,     
        Deadline: data.Deadline,
        Status: "Pending"
    })
    console.log(Data);
    Data.save().then(() => console.log('Task Data Inserted!!'));
}





module.exports = {
    chatwithbot,
    getResponse
}
