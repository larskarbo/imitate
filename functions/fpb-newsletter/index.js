var axios = require('axios');
var FormData = require('form-data');

function getUrlParams(search) {
  const hashes = search.split('&')
  const params = {}
  hashes.map(hash => {
      const [key, val] = hash.split('=')
      params[key] = decodeURIComponent(val)
  })
  return params
}

// Works with Gumroad PING

const handler = async (event) => {
  try {
    const params = getUrlParams(event.body)
    console.log('params: ', params);
    const permalink = params.permalink
    console.log('permalink: ', permalink);
    const email = params.email
    console.log('email: ', email);



    if(permalink == "zXdoq"){
      var data = new FormData();
      data.append('api_key', process.env.SENDY_API);
      data.append("email", email);
      data.append('list', process.env.SENDY_FPB_LIST);
  
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

    }


    return {
      statusCode: 200,
      body: JSON.stringify({sent: "true"}),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    console.log('error.toString(): ', error.toString());
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
