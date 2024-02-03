import models from "../infra/models";
import fs from "fs";
import csvParser from "csv-parser";
const filePath = "./resources/uscities-data.csv";
import state from "../src/adapters/state";
import OpenAI from "openai";

const useOpenAi = false;
var openai: OpenAI | null = null;

if (useOpenAi) {
  openai = new OpenAI();
}

async function clear() {
  await new Promise((resolve, reject) => setTimeout(() => resolve(true), 5000));
  await state.deleteAll();
}

var json: any = {};

const generateFaq = async (state: any, city: any) => {
  const titleData = await openai?.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Generate an FAQ title for personal injury attorney in ${state}, ${city}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const title = titleData?.choices[0];

  const responseData = await openai?.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      {
        role: "user",
        content: `Generate an FAQ answer for personal injury attorney in ${state}, ${city} about: ${title}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  const response = responseData?.choices[0];

  return {
    title: title,
    content: response,
  };
};

var faqsGenerated = 0;

const generateFaqList = async (number: number = 5, state: any, city: any) => {
  var list: any = [];

  for (let i = 0; i < number; i++) {
    const faq = generateFaq(state, city);
    list.push(faq);
    faqsGenerated += 1;
  }

  return list;
};

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

      useOpenAi &&
        faqsGenerated < 200 &&
        console.log(`Generating faqs for ${row.state}, ${row.city}`);

      let useFaq =
        useOpenAi && faqsGenerated < 200
          ? await generateFaqList(5, row.state, row.city)
          : [];

      useOpenAi &&
        faqsGenerated < 200 &&
        console.log(`Generated`);

      const city = {
        city: row.city,
        city_id: row.city.toLowerCase().replace(/ /g, "_"),
        page: {
          zips: row.zips,
          header: {
            title: `Header for ${row.city}`,
          },
          articles: [],
          faq: useFaq,
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
