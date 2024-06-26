

const { userData } = require("../models/Account");
const { groupData } = require("../models/Group");
const { task } = require("../models/Task");
const { generateUniqueId } = require("../utils/basicFunctions");
const { chatwithbot, getResponse } = require("../utils/botChatbot");
const { checkGroup, getAllChatData, sendMessage } = require("../utils/databaseFunctions");
const { changeNameMailNum } = require("../utils/profileFunctions");

let Active = [];
let RoomsActive = [];

function registerEvents(io){

    io.on('connection', (socket) => {
        
        socket.on('loggedIn', async (UniqueId) => {
            try {
                // Find user's domain based on UniqueId
                let Domain = await userData.findOne({"UniqueId": UniqueId}, 'Domain');
        
                // Add user to Active array
                Active.push({ID: UniqueId, Socket: socket.id, Domain: Domain.Domain });

                io.to(socket.id).emit("ActiveUser",Active.length);  // Send number of active users to client
        
                // Uncomment the following section to join groups based on the user's domain
                /*
                let Data = await checkGroup(Domain.Domain, UniqueId);
                Data.forEach(group => {
                    let existingRoomIndex = RoomsActive.findIndex(room => room.GroupID === group.GroupID);
                    socket.join(group.GroupID);
                    if (existingRoomIndex !== -1) {
                        // If the room already exists, add the UniqueId to its Members array
                        let existingMemberIndex = RoomsActive[existingRoomIndex].Members.findIndex(member => member === UniqueId);
                        if (existingMemberIndex === -1) {
                            // If the member doesn't exist, add it
                            RoomsActive[existingRoomIndex].Members.push(UniqueId);
                        } else {
                            console.log("Already Joined Room");
                        }
                    } else {
                        // If the room doesn't exist, create a new room object and add it to RoomsActive
                        let newRoom = {
                            RoomID: generateUniqueId(), // Function to generate unique RoomID
                            GroupID: group.GroupID,
                            Domain: group.Domain,
                            Members: [UniqueId]
                        };
                        RoomsActive.push(newRoom);
                    }
                });
                */
        
                // Log the Active array to console
                console.log(Active);
            } catch (error) {
                console.error('Error in loggedIn event handler:', error);
            }
        });
        
        

        socket.on('joinGroup', async (group) => {
            try {
                // Check if group parameter is provided
                if (!group) {
                    throw new Error('Group name not provided');
                }
        
                // Leave old groups
                const rooms = Array.from(socket.rooms.keys());
                console.log(rooms);
                socket.leave(rooms);
        
                // Extract the group name from the input
                let slicedPart = group.split('- ')[1];
                slicedPart = slicedPart.toLowerCase();
                console.log(slicedPart);
        
                // Query the database to find group data
                let G_Data = await groupData.findOne({ GroupName: slicedPart });
        
                // Check if group data exists
                if (!G_Data) {
                    throw new Error('Group not found');
                }
        
                // Find the user's data in the Active array
                let data = Active.find(curr => curr.Socket === socket.id);
        
                // Add the user to the RoomsActive array
                RoomsActive.push({
                    Socket: socket.id,
                    PersonId: data.ID,
                    Domain: data.Domain,
                    Group: slicedPart,
                    GroupId: G_Data.GroupID
                });
        
                // Join the group room
                socket.join(G_Data.GroupID);
        
                // Retrieve and send chats for the joined group
                let chats = await getAllChatData(slicedPart, G_Data.GroupID);
                io.to(socket.id).emit("loadChats", chats);
            } catch (error) {
                // Handle errors gracefully
                console.error('Error joining group:', error.message);
                // Send error message to the client
                io.to(socket.id).emit('joinGroupError', { error: error.message });
            }
        });
        
        
        socket.on('joinChat', async (data) => {
            try {
                console.log('Data received for joining chat:', data);

                if(data === "BotGang"){
                    io.to(socket.id).emit("loadChats", data)
                }
                else{
        
                    // Check if data object contains required fields
                    if (!data || !data.toId || !data.myId) {
                        throw new Error('Invalid data received for joining chat');
                    }
                    // Send chat data to the client
                    let chats = await getAllChatData(data.myId, data.toId);
                    console.log('Chat data:', chats);
                    io.to(socket.id).emit("loadChats", chats);

                }
            } catch (error) {
                // Handle errors gracefully
                console.error('Error joining chat:', error.message);
                // Send error message to the client
                io.to(socket.id).emit('joinChatError', { error: error.message });
            }
        });
        

        socket.on("personalMessage", async(data) => {
            // console.log(data);
            let friend = await userData.findOne( {Username : data.ToUser} ); 
            // console.log(friend);
            let toId = friend.UniqueId;

            sendMessage(data.FromId, toId, data.FromUser, data.ToUser, data.Message, data.Time);

        })
        


        socket.on("SendMessage", async(newChat) => {
            let To = newChat.ToUser;
            let Toid ='';
            if(newChat.dataType === 'Group'){
                let group = await groupData.findOne({GroupID: newChat.ToId});
                // console.log(group,newChat);
                let users = group.Members;
                users.forEach(user => {
                    // Check if the user ID exists in any of the Active user objects
                    Active.forEach(activeUser => {
                        if (activeUser.ID === user && newChat.FromId !== activeUser.ID) {
                            // Log the socket of the active user
                            io.to(activeUser.Socket).emit("OnlineMessage",newChat);
                        }
                    });
                });

            }
            else{
                // friend = await userData.findOne({Username: To},'UniqueId');
                // console.log(To, friend);
                Toid = newChat.ToId;
                if (Active.some(user => user.ID === Toid)) {
                    const userSocket = Active.find(user => user.ID === Toid).Socket;
                    io.to(userSocket).emit("OnlineMessage", newChat);
                }
            }

            console.log(Toid);
            sendMessage(newChat.dataType,newChat.FromId, newChat.ToId, newChat.FromUser, To, newChat.Message, newChat.Time);

        });


        socket.on("BotMessage", async(data) => {
            console.log("sockett");
            if(data.Task === 'Chat'){
                let reply = await chatwithbot(data.Message);
                console.log(reply);
                io.to(socket.id).emit("OnlineMessage",{dataType:"BotGang", Message:reply});
            }
            else {
                let AdminPower = await groupData.find({Admin: data.myId});
                // console.log("Admin");
                let reply = await getResponse(data.Message, AdminPower, data.myId)
                io.to(socket.id).emit("OnlineMessage",{dataType:"BotGang", Message:reply});             
            }
        })

        socket.on("TaskComplete", async(data) => {

            // console.log(data);
            let Task = await task.findOne({ToID: data.myId, TaskDescript: data.taskDescription});
            if(Task.Status === "Pending"){
                Task.Status = "Done";
            }
            else{
                Task.Status = "Pending";
            }

            await Task.save();
        })


        socket.on('disconnect', () => {
            console.log("Disconnected: " + socket.id);
            
            // Remove the disconnected socket from the Active array
            Active = Active.filter(user => user.Socket !== socket.id);
        
            // Find the rooms where the disconnected user is a member
            const roomsWithDisconnectedUser = RoomsActive.filter(room => room.Socket === socket.id);
        
            roomsWithDisconnectedUser.forEach(room => {
                // If only the disconnected user is in the room, remove the entire room
                const roomIndex = RoomsActive.indexOf(room);
                RoomsActive.splice(roomIndex, 1);
            });
        
            console.log("Active users:", Active);
            console.log("Active rooms:", RoomsActive);
        });
        

        socket.on("ChangeMyData",async(data)=>{

            console.log("For Data Change");
            console.log(data);
            await changeNameMailNum(data);
        })
        
    });

}

module.exports = registerEvents