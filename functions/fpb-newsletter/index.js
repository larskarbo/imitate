var axios = require('axios');
var FormData = require('form-data');

const handler = async (event) => {
  try {
    console.log('event.body: ', event.body);
    const product_id = JSON.parse(event.body).product_id
    console.log('product_id: ', product_id);
    const full_name = JSON.parse(event.body).full_name
    console.log('full_name: ', full_name);
    const email = JSON.parse(event.body).email
    console.log('email: ', email);

    if(product_id == "zXdoq"){
      var data = new FormData();
      data.append('api_key', process.env.SENDY_API);
      data.append("email", email);
      data.append('name', full_name);
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
      body: JSON.stringify({}),
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
