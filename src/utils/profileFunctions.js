const { userData } = require("../models/Account");




async function changeNameMailNum(update) {

    let Name = update.Name;
    let Mail = update.Mail;
    let Num = update.Num;
    let id = update.ID;


    let data = await userData.findOne({UniqueId: id});
    console.log(data,id);

    if(Name !== "" && Name !== null && Name !== undefined){
        data.Username = Name;
    }
    if(Mail !== "" && Mail !== null && Mail !== undefined){
        data.SecondaryMail = Mail;
    }
    if(Num !== "" && Num !== null && Num !== undefined){
        data.Number = Num;
    }

    await data.save().then(() =>{
        console.log(`User ${data.Username} has been updated`);
    })

};


module.exports = {
    changeNameMailNum
}