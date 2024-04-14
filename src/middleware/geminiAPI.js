
const { GoogleGenerativeAI } = require("@google/generative-ai");

const AI = new GoogleGenerativeAI(process.env.GeminiAPI);


async function run(prop) {

    const model = AI.getGenerativeModel({ model: "gemini-pro" });


    const result = await model.generateContent(prop);
    const response = await result.response;

    console.log(response.text());

    return response.text();
  
  }


  module.exports = {
    run
  }