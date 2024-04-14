
    const socket = io();

    // const Name = `<%= Name %>`;
    // const ID = `<%= ID %>`;
    socket.emit("loggedIn", ID);
    console.log(Name);
    console.log(ID);

    //mobile
    const MenuShowBtn = document.querySelector('#MenuShowBtn');
    const MobileMenu = document.querySelector('#MobileMenu');
    const MenuCloseBtn = document.querySelector('#MenuCloseBtn');


    MenuShowBtn.addEventListener('click', disMenu);
    MenuCloseBtn.addEventListener('click', hideMenu)

    function disMenu() {
        MobileMenu.classList.toggle('hidden');
    }

    function hideMenu() {
        MobileMenu.classList.toggle('hidden');
    }





    //LogOut
    const LogOut = document.getElementById('LogOut')


    LogOut.addEventListener('click', function () {
        confirm('Are you sure to LogOut?');

    })





    //active chats
    const chatList = document.querySelectorAll('.actChat');


    chatList.forEach(e => {
        e.addEventListener('click', () => {
            document.querySelector('.act')?.classList.remove('text-white', 'bg-blue', 'act');
            e.classList.add('bg-blue', 'text-white', 'act');


        })
    })
    // console.log(chatList)


    
    // const group = document.getElementsByClassName('group');
    // const human = document.getElementsByClassName('human');
    const toggle = document.getElementById('botToggle');    
    const grpChats = document.getElementById('grpChats');    
    const botChats = document.getElementById('Chats');    

    // Find the span element within the "Chats" section
    // const spanElement = querySelectorAll('span.text-2xl');


    // console.log(human);



document.addEventListener('DOMContentLoaded', function() {

    const bot = document.getElementById('bot');
    bot.addEventListener('click',()=>{
        if(botChats.classList.contains('hidden')){
            botChats.classList.remove('hidden');
            grpChats.classList.add('hidden');
        }
        if(toggle.classList.contains('hidden') && Role === "Admin"){
                toggle.classList.remove('hidden');
        }

                    // Update the image URL and span text
        let botFieldImg = document.querySelector('#chatField img');
        let botFieldSpan = document.querySelector('#chatField span');


        // Update the image URL
        botFieldImg.src = "img1/bot.jpg";
        // Update the span text
        botFieldSpan.textContent = "Let me help you with your tasks!";

        socket.emit("joinChat", "BotGang");
        // else{
        //     botChats.classList.add('hidden');
        //     grpChats.classList.remove('hidden');
        // }
    })



    // Add event listener to all elements with the 'group' class
    const groups = document.querySelectorAll('.group');
    groups.forEach(function(group) {
        group.addEventListener('click', function() {
            // Get the capitalized string from the clicked group
            const groupName = this.querySelector('.text-xl').textContent;
            
            // Update the image URL and span text
            const groupFieldImg = document.querySelector('#groupField img');
            const groupFieldSpan = document.querySelector('#groupField span');

            // Update the image URL
            groupFieldImg.src = this.querySelector('img').src;

            // Update the span text
            groupFieldSpan.textContent = groupName;

            //Send Socket
            console.log(groupName);
            socket.emit("joinGroup", groupName);



            // Toggle visibility of chat sections
            if(grpChats.classList.contains('hidden')) {
                grpChats.classList.remove('hidden');
                botChats.classList.add('hidden');
            }
            if(!toggle.classList.contains('hidden')) {
                toggle.classList.add('hidden');
            }
            console.log('Group clicked!');
        });
    });

    // Add event listener to all elements with the 'human' class
    const humans = document.querySelectorAll('.human');
    humans.forEach(function(human) {
        human.addEventListener('click', function() {
            // Get the capitalized string from the clicked group
            const chatName = this.querySelector('.text-xl').textContent;
            
            // Update the image URL and span text
            const chatFieldImg = document.querySelector('#chatField img');
            const chatFieldSpan = document.querySelector('#chatField span');

            // Update the image URL
            chatFieldImg.src = this.querySelector('img').src;

            // Update the span text
            chatFieldSpan.textContent = chatName;
            const Toid = getFriendId(chatName.trim())
            console.log(Toid);

            socket.emit("joinChat", {toId: Toid , myId: ID});

            // Toggle visibility of chat sections
            if(botChats.classList.contains('hidden')) {
                botChats.classList.remove('hidden');
                grpChats.classList.add('hidden');
            }
            if(!toggle.classList.contains('hidden')) {
                toggle.classList.add('hidden');
            }
            console.log("Human clicked!");
        });
    });


    const personalInput = document.querySelector('#chatInput');
    personalInput.addEventListener('keypress', function(event) {
        // Check if the pressed key is Enter
        if (event.key === 'Enter') {
            // Prevent default behavior of Enter key (form submission)
            event.preventDefault();
            // Call the sendMessage function when Enter key is pressed
            sendMessage('chatInput','#chatField');
        }
    });


    const groupInput = document.querySelector('#groupInput');
    groupInput.addEventListener('keypress', function(event) {
        // Check if the pressed key is Enter
        if (event.key === 'Enter') {
            // Prevent default behavior of Enter key (form submission)
            console.log("Getting CLicked");
            event.preventDefault();
            // Call the sendMessage function when Enter key is pressed
            sendMessage('groupInput','#groupField');
        }
    });

});



function sendMessage(idTagInput,idTagField) {

    console.log(idTagField,idTagInput);
    const messageInput = document.getElementById(idTagInput);
    const message = messageInput.value.trim(); // Extract message from input

    if(message === ''){
        return;
    }


    let date = new Date();
    // console.log(date);
    const currentTime = getTime(date); // Get current time in "hh:mm" format
    sendingMessage(message, currentTime, idTagField); // Call your existing function with message and time
    let To = document.querySelector(idTagField+' span').textContent.trim();
    // console.log(To);
    if(To.includes("Community")){       //Send Message to Group
        let slicedPart = To.split('- ')[1];
        let groupId = getGroupId(slicedPart.trim());
        let groupName = slicedPart.toLowerCase();
        // console.log("Sending message");
        socket.emit("SendMessage", {dataType:'Group', FromUser: Name, FromId: ID, ToUser: groupName, ToId: groupId, Message: message, Time:currentTime})
    }
    else {
        if(To === 'Let me help you with your tasks!'){
            console.log("Bot");
            const Task = document.getElementById('TaskChecker');
            let tasker = 'Chat';
            if(Task.checked){
                // console.log("Check");
                tasker = 'Tasks';
                socket.emit("BotMessage",{Message: message, Task: tasker, myId: ID});
            }
            else{
                // console.log("NO");
                tasker = 'Chat';
                socket.emit("BotMessage",{Message: message, Task: tasker, myId: ID});
            }
            
        }
        else{
            // friendData.forEach((user) => {
            //     if (To === user.Name) {
            //         console.log(user);
            //     }
            // })()
            let friendId = getFriendId(To);
            socket.emit("SendMessage", {dataType:'Personal', FromUser:Name, FromId:ID, ToUser:To, ToId: friendId, Message:message, Time:currentTime});
        }
    }
    messageInput.value = ''; // Clear input field after sending message
}

function sendLoadMessage(idTagInput,idTagField) {
    console.log(idTagField,idTagInput);
    const messageInput = document.getElementById(idTagInput);
    let message = ""
    if (messageInput) {
        message = messageInput.value.trim();
        // Proceed with further processing
    } else {
        console.error('Message input element not found');
    }
    let date = new Date();
    // console.log(date);
    const currentTime = getTime(date); // Get current time in "hh:mm" format
    sendingMessage(message, currentTime, idTagField); // Call your existing function with message and time
    let To = document.querySelector(idTagField+' span').textContent;
    console.log(To);
    if(To.includes("Community")){       //Send Message to Group
        let slicedPart = To.split('- ')[1];
        slicedPart = slicedPart.toLowerCase()
        console.log(slicedPart); 
        let groupData = GroupData;
        groupData.forEach((group) => {
            if(group.GroupName === slicedPart){
                let ide = ID
                let data = {
                    GroupId: group.GroupID,
                    from: ide,
                    message: message,
                    time: currentTime
                }
                // socket.emit("Group sendMessage",data)
            }
        });
    }
    else {
        let friendData = ([`<%= Friend %>`]);
        if(To === 'Let me help you with your tasks!'){
            console.log("Bot");
        }
        else{
            friendData.forEach((user) => {
                if (To === user.Name) {
                    console.log(user);
                }
            })
        }
    }
    messageInput.value = ''; // Clear input field after sending message
}



function getTime(date) {
    const now = date;
    const hours = String(now.getHours()).padStart(2, '0'); // Get hours with leading zero
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes with leading zero
    return `${hours}:${minutes}`;
}


//Send and Receive Message

const parent1Element = document.getElementById('personalPlay');
const parent2Element = document.getElementById('groupPlay');

function sendingMessage(spanText, h5Text, idTagField) {
    const div = document.createElement('div');
    div.classList.add('mt-4', 'px-2', 'flex', 'justify-end', 'items-end');

    const innerDiv = document.createElement('div');
    innerDiv.classList.add('w-3/4');

    // let currentFieldImg = document.querySelector('#chatField img');
    let currentFieldSpan = document.querySelector(idTagField+' span');

    // // Update the image URL
    // let url = currentFieldImg.src;

    // Update the span text
    let currentChat = currentFieldSpan.textContent;
    let type = idTagField === '#chatField' ? 'Normal' : 'Group'

    let  newChat = {
        dataType: type,
        To: currentChat,
        fromName: Name,
        fromId: ID,
        Message: spanText,
        Time: h5Text 
    }
    // socket.emit("SendMessage", newChat);

    const span = document.createElement('span');
    span.classList.add('bg-white', 'p-2', 'rounded-md', 'text-xl', 'flex');
    span.textContent = spanText;

    const h5 = document.createElement('h5');
    h5.classList.add('mt-2', 'text-sm', 'text-end');
    h5.textContent = h5Text;
    // console.log(currentChat);

    innerDiv.appendChild(span);
    innerDiv.appendChild(h5);
    div.appendChild(innerDiv);
    if(idTagField == '#chatField'){
        parent1Element.append(div);
    }
    else{
        parent2Element.append(div);
    }

    return div;
}

function receiverPersonalMessage(spanText, h5Text) {
    const div = document.createElement('div');
    div.classList.add('mt-4', 'px-2');

    const innerDiv = document.createElement('div');

    const span = document.createElement('span');
    span.classList.add('bg-white', 'p-2', 'rounded-md', 'text-xl');
    span.textContent = spanText;

    const h5 = document.createElement('h5');
    h5.classList.add('mt-2', 'text-sm');
    h5.textContent = h5Text;

    innerDiv.appendChild(span);
    innerDiv.appendChild(h5);
    div.appendChild(innerDiv);
    parent1Element.append(div)
    return div;
}

function receiverGroupMessage(fromName,spanText, h5Text) {
    const div = document.createElement('div');
    div.classList.add('mt-4', 'px-2','w-3/4');

    const fromDiv = document.createElement('div');
    const fromDivSpan = document.createElement('span')
    fromDivSpan.classList.add('text-black', 'font-semibold');
    fromDivSpan.textContent = fromName;
    fromDiv.appendChild(fromDivSpan);

    const innerDiv = document.createElement('div');

    const span = document.createElement('span');
    span.classList.add('bg-white', 'p-2', 'rounded-md', 'text-xl', 'flex');
    span.textContent = spanText;

    const h5 = document.createElement('h5');
    h5.classList.add('mt-2', 'text-sm');
    h5.textContent = h5Text;

    innerDiv.appendChild(span);
    innerDiv.appendChild(h5);
    div.appendChild(fromDiv);
    div.appendChild(innerDiv);
    parent2Element.append(div);
    return div;
}

function groupORchat(){
    if (grpChats.classList.contains('hidden')) {

        let Field = document.querySelector('#chatField span');

        // Update the span text
        let To = Field.textContent;
        let data = {
            dataType: 'Normal',
            To: To,
            idFieldTag: 'chatField',
            parent: parent1Element
        }
        return data;
        // return 'Bot';
    } else if (botChats.classList.contains('hidden')) {

        let Field = document.querySelector('#groupField span');

        // Update the span text
        let To = Field.textContent;
        let data = {
            dataType: 'Group',
            To: To,
            idFieldTag: 'groupField',
            parent:  parent2Element
        }
        return data;
        // return 'Group';
    }
}


function emptyDivs(parent) {
    // const parent = document.getElementById(parentId); // Get the parent element by ID
    if (!parent) {
        console.error('Parent element not found');
        return;
    }

    // Loop through each child node of the parent
    while (parent.firstChild) {
        // Remove the first child node (div element) of the parent
        parent.removeChild(parent.firstChild);
    }
}




    //Receive Live Chat 
    //<Summary>
    //This is for receiving the chat data when any chat is already opened
    //chats data include : Message, Time, byName
    socket.on("OnlineMessage",(newData)=>{

        if(newData.dataType === 'Group'){
            let Curr = getCurrGroup();
            let CurrId = getGroupId(Curr.trim());
            if(CurrId === newData.ToId){
                receiverGroupMessage(newData.FromUser, newData.Message, newData.Time);
            }
            else{
                console.log("Person is in diff chat ---From Group");
            }

        }
        else if(newData.dataType === 'Personal'){
            let Curr = getCurrChat();
            let CurrId = getFriendId(Curr.trim());
            console.log(CurrId);
            console.log(newData);
            if(CurrId === newData.FromId){
                receiverPersonalMessage(newData.Message,newData.Time);
            }
            else{
                console.log("Person is in diff chat ---From Personal");
            }
        }
        else if(newData.dataType === 'BotGang'){
            let newDate = new Date();
            let time = getTime(newDate);
            receiverPersonalMessage(newData.Message, time)
        }
    });



    //Load Data 
    //<Summary>
    //This is for loading the chat data when any chat is clicked
    //chats data include : Message, Time, byName

    socket.on("loadChats", (chats)=>{
        console.log(chats);
        getCurrChat();
        let focus = groupORchat();
        if(focus.dataType === "Group"){
            emptyDivs(parent2Element)
            chats.forEach(data => {
                if(data.FromUser === Name){
                    sendingMessage(data.Message, data.Time, '#groupField' );
                }
                else{
                    receiverGroupMessage(data.FromUser, data.Message, data.Time);
                }
            });
        }
        else{
            emptyDivs(parent1Element);
            let curr = getCurrChat();
            if(curr === "Let me help you with your tasks!"){
                let date = new Date()
                receiverPersonalMessage("Hello!! How can I help you ?", getTime(date))
            }
            else{
                chats.forEach(data => {
                    if(data.FromUser === Name){
                        sendingMessage(data.Message, data.Time, '#chatField' );
                    }
                    else{
                        receiverPersonalMessage(data.Message, data.Time);
                    }
                });
            }
        }
    });



    function getCurrChat(){
        const chatName = document.querySelector('#chatField span').textContent;
        // console.log(chatName);
        return chatName;
    }


    function getCurrGroup(){
        const groupName = document.querySelector('#groupField span').textContent;
        let slicedPart = groupName.split('- ')[1];

        // console.log(chatName);
        return slicedPart;
    }

