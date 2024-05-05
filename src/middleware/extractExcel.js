const xlsx = require('xlsx');


async function convertExcell(data) {
    // const data = await userData.find({}).lean();
    // console.log(data);

    // Convert data to Excel file
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return excelBuffer;
}

module.exports = {
    convertExcell
}