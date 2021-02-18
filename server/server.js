const app = require('./app.js');
const http = require('http')
const server = http.createServer(app);
const PORT = 3200;


server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
})