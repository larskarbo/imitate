const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
// const randomItem = require('random-item');


const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ segments: [] })
  .write()

exports.db = db