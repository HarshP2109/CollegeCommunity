const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NewsApi);

function getFormattedDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function randomSpan(originalString){

    // Split the string into words
    let words = originalString.split(" ");

    // Generate a random index within the range of words array
    let randomIndex = Math.floor(Math.random() * words.length);

    // Get the word at the random index
    let randomWord = words[randomIndex];

    // Replace the random word with a span
    words[randomIndex] = `<span class="bg-purple rounded-full p-1">${randomWord}</span>`;

    // Join the words back into a string
    let modifiedString = words.join(" ");

    console.log(modifiedString);

}


async function getNews(){
    newsapi.v2.topHeadlines({
        category: 'technology',
        from: getFormattedDate(),
        to: getFormattedDate(),
        language: 'en',
        sortBy: 'relevancy',
      }).then(response => {
        console.log(response.articles.length);
        let len = response.articles.length;
        let random = Math.round(Math.random()*len);
        // res.json(response.articles[random].title);
        randomSpan(response.articles[random].title)

        let data = {
            Title : response.articles[random].title,
            Url : response.articles[random].url
        }

        return data;
      });
}

module.exports = {
    getNews
}