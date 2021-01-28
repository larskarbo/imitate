// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

var axios = require('axios');
var FormData = require('form-data');

const handler = async (event) => {
  try {
    const email = JSON.parse(event.body).email
    const language = JSON.parse(event.body).language

    var data = new FormData();
    data.append('api_key', process.env.SENDY_API);
    data.append("email", email);
    data.append('list', process.env.SENDY_LIST);

    if(language == "french"){
      data.append('isFrenchLearner', "yes");
    } else if(language == "english"){
      data.append('isEnglishLearner', "yes");
    } else if(language == "spanish"){
      data.append('isSpanishLearner', "yes");
    } else if(language == "chinese"){
      data.append('isChineseLearner', "yes");
    } else if(language == "russian"){
      data.append('isRussianLearner', "yes");
    } else if(language == "german"){
      data.append('isGermanLearner', "yes");
    } else if(language == "norwegian"){
      data.append('isNorwegianLearner', "yes");
    } else {
      data.append('isOtherLearner', language);
    }  

    var config = {
      method: 'post',
      url: process.env.SENDY_URL,
      headers: {
        ...data.getHeaders()
      },
      data: data
    };

    const res = await axios(config)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        console.log(error.message);
        return error
      });

    return {
      statusCode: 200,
      body: JSON.stringify({}),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
