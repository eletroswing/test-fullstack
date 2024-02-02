import models from "../infra/models";
import fs from "fs";
import csvParser from "csv-parser";
const filePath = "./resources/uscities-data.csv";
import state from "../src/adapters/state";

async function clear() {
  await new Promise((resolve, reject) => setTimeout(() => resolve(true), 5000));
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

async function run() {
  console.log("cleaning");
  await clear();
  console.log("cleaned");
  console.log("compiling");

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", async (row) => {
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
          header: { },
          articles: [],
          faq: faqs,
          reviews: [],
          embedded_videos: [],
          attorney: [],
        },
      };

      json[row.state_id.toLowerCase()].cities.push(city);
    })
    .on("end", async () => {
      const values: any = Object.values(json);
      console.log(`Starting Seed`);
      
      for (const value of values) {
        console.log(`Seeding ${value.state}`);
        await models.StateModel.insertMany(value);
        console.log(`Seeded`);
      }

      process.exit(0);
    });
}

run();
