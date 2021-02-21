const fs = require("fs-extra");
const slugify = require("slugify");


const content = require("../../src/course/content.json")

content.forEach(c => {
  if(c.type == "collection"){
    c.children[0].spellingRules = c.spellingRules
    delete c.spellingRules
    // c.children = c.children.map(exercise => {
    //   // console.log('slugify(exercise.text): ', slugify(exercise.text, {strict: true}).toLowerCase());
    //   const slug = exercise.id
    //   delete exercise.id
    //   return {
    //     ...exercise,
    //     type: "exercise",
    //     slug
    //     // id: slugify(exercise.text, {strict: true, lower:true})
    //   }
    // })
  } else {
  }

  // if(c.phonetic){
  //   // c.video = c.title
  //   if(!c.video){
  //     c.video = ""

  //   }
  // }
})

fs.writeJSONSync("../../src/course/content.json", content, {
})