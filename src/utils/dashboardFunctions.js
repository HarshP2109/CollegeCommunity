
const { userData } = require("../models/Account");
const {dailyData} = require("../models/DailyActivity");
const { eventData } = require("../models/Event");

async function AddActivityTable(Id, Name) {
    let CurrentDate =  new Date();
    let CurrentDay = CurrentDate.getDate();

    let CurrentDate0 =  new Date(CurrentDate.setDate(CurrentDay));
    let CurrentDate1 =  new Date(CurrentDate.setDate(CurrentDay - 1));
    let CurrentDate2 =  new Date(CurrentDate.setDate( CurrentDay - 2));
    let CurrentDate3 =  new Date(CurrentDate.setDate( CurrentDay - 3));
    let CurrentDate4 =  new Date(CurrentDate.setDate( CurrentDay - 4));
    let CurrentDate5 =  new Date(CurrentDate.setDate( CurrentDay - 5));
    let CurrentDate6 =  new Date(CurrentDate.setDate( CurrentDay - 6));

    let data = new dailyData({
        Username: Name,
        UniqueId: Id,
        Date1: CurrentDate6,
        DateActive1: 0,
        Date2: CurrentDate5,
        DateActive2: 0,
        Date3: CurrentDate4,
        DateActive3: 0,
        Date4: CurrentDate3,
        DateActive4: 0,
        Date5: CurrentDate2,
        DateActive5: 0,
        Date6: CurrentDate1,
        DateActive6: 0,
        Date7: CurrentDate0,
        DateActive7: 0
    });

    // console.log(data['Date7']);
    // console.log(data);

    data.save().then(() => console.log("Activity created!!!"));
}



async function updateActivityTable(Id) {
    try {
        // Find the document with the given UniqueId
        let date = await dailyData.findOne({ UniqueId: Id });

        if (!date) {
            console.log(Id + " is not in database");
            throw new Error('Data not found');
        }

        // console.log("After retrieve");
        // console.log(date);
        // Get today's date

        let data = createUpdatedData(date);

        // console.log("After transfer");
        // console.log(data);

        await data.save();

        let sendingData = {
            'date1': formatDate(data["Date1"]),
            'Active1': data['DateActive1'],
            'date2': formatDate(data["Date2"]),
            'Active2': data['DateActive2'],
            'date3': formatDate(data["Date3"]),
            'Active3': data['DateActive3'],
            'date4': formatDate(data["Date4"]),
            'Active4': data['DateActive4'],
            'date5': formatDate(data["Date5"]),
            'Active5': data['DateActive5'],
            'date6': formatDate(data["Date6"]),
            'Active6': data['DateActive6'],
            'date7': "Today",
            'Active7': data['DateActive7'],
        }

        // console.log(formatDate(data["Date7"]));
        // console.log(data);
        console.log('Data updated successfully');
        return sendingData;
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

function createUpdatedData(previousData) {
    const Newdata = previousData;
    let hashtable = {}

    let currentDate = new Date();
    let currentDay = currentDate.getDate();
    let index = 0;
    for (let key in Newdata) {
        if (key !== 'Username' && key !== 'UniqueId') { //For only doinng change in date
            const dateString = `Date${index + 1}`;
            const activeString = `DateActive${index + 1}`;
            if (key === dateString) {
                index++;
                let ind = formatDate(Newdata[key])
                hashtable[ind] = Newdata[activeString];
            }
        }
    }
    index = 0;
    console.log("START")
    for (let key in Newdata) {
        if (key !== 'Username' && key !== 'UniqueId') { //For only doinng change in date
            const dateString = `Date${index + 1}`;
            const activeString = `DateActive${index + 1}`;
            if (key === dateString) {
                let date = new Date(currentDate);
                date.setDate(currentDay - (6 - index));
                Newdata[key] = date;
            } else if (key === activeString) {
                let one = Newdata[dateString];
                if (hashtable[formatDate(one)]) {
                    Newdata[activeString] = hashtable[formatDate(one)];
                } else {
                    Newdata[activeString] = 0;
                }
            }
            if (key === activeString) {
                index++;
            }
            if (key === 'DateActive7') {
                Newdata[activeString] += 1;
            }
        }
    }
    // console.log("after transform");
    // console.log(Newdata);
    return Newdata
}


function formatDate(date) {
    // Extract day and month from the date
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1

    // Concatenate day and month with a '/'
    return `${day}/${month}`;
}

async function TotalCount(){
    let users = await userData.find({});
    return users.length;
}

async function countEvents() {
    let events = await eventData.find({});
    let currentDate = new Date();
    let totalEvents = events.length;
    let ongoingEvents = events.filter(event => new Date(event.En_d) >= currentDate);
    // console.log(ongoingEvents);


    let event = [];
    for (let index = 0; index < ongoingEvents.length; index++) {
        let element = ongoingEvents[index].Title;
        event.push(element);
    }

    let currEvent = {
        totalEvents: totalEvents,
        ongoingEvents: ongoingEvents.length
    }
    let result = {
        Data: currEvent,
        EventName : event
    };  

    console.log(result);

    return result;
}




module.exports  = {
    AddActivityTable,
    updateActivityTable,
    TotalCount,
    countEvents
}