
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
  
  function extractDomain(email) {
    const match = email.match(/@([^.]*)\./);
    return match ? match[1] : null;
  }
  
  const customOrder = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  function sorter(one,two){
      let result;
      for (let i = 0; i < Math.min(one.length, two.length); i++) {
              const charA = one[i];
              const charB = two[i];
              const indexA = customOrder.indexOf(charA);
              const indexB = customOrder.indexOf(charB);
              if (indexA !== indexB) {
                return result = indexA < indexB ? one+":"+two : two+":"+one ;
          }
      }
    return one.length < two.length ? one + ":" + two : two + ":" + one;;
  }

  module.exports = {
    generateOTP,
    generateUniqueId,
    extractFields,
    formatDateAndTime,
    sorter,
    extractDomain
  }