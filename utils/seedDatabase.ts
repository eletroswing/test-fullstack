import models from "../infra/models";
import fs from "fs";
import csvParser from "csv-parser";
const filePath = "./resources/uscities-data.csv";
import state from "../src/adapters/state";

async function clear() {
  await state.deleteAll();
}

const faqs: any = [];
for (let i = 0; i < 50; i++) {
  faqs.push({
    content: `I dont have an openAI key, so i hardcoded this.`,
    title: `FAQ number ${i + 1}`,
  });
}

var json: any = {};

console.log('cleaning');
clear();
console.log('cleaned');
console.log('compiling');
let lineCounter = 0;
let chunkCounter = 0;

async function compileChunk(){
  chunkCounter++
  console.log(`Chunk ${chunkCounter} : compiling ${1000*(chunkCounter -1)}:${1000*chunkCounter}`);
  console.log(`Chunk ${chunkCounter} : Sending`);
  const values = Object.values(json);
  await models.StateModel.insertMany(values);
  console.log(`Chunk ${chunkCounter} : Done`)
}

fs.createReadStream(filePath)
  .pipe(csvParser())
  .on("data", async (row) => {
    lineCounter++;

    if (!json[row.state_id.toLowerCase()])
      json[row.state_id.toLowerCase()] = {
        state: row.state_name,
        state_id: row.state_id.toLowerCase(),
        cities: [],
      };

    const city = {
        city: row.city,
        city_id: row.city.toLowerCase().replace(/ /g, "_"),
        page: {
          zips: row.zips,
          header: { title: `Page for ${row.city}` },
          articles: [],
          faq: faqs,
          reviews: [],
          embedded_videos: [],
          attorney: [],
        },
      }
    
    json[row.state_id.toLowerCase()].cities.push(city);
    if (lineCounter % 1000 === 0) {
      await compileChunk();
      json = {}
    }
  })
  .on("end", async () => {
    await compileChunk();
    process.exit(0)
  });
