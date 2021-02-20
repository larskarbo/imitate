import content from "./content.ts"
import fs from "fs-extra"
console.log('content: ', content.length);
import content2 from "./content2.mjs"
console.log('content2: ', content2.length);

const newC = []
content.forEach((c, i) => {
    console.log(c.slug, content2[i].slug)
    newC.push({
        ...c,
        exercises: content2[i].exercises
    })
})
console.log('newC: ', newC);

fs.writeJSONSync("content.json", newC)
// content.map((_,i))