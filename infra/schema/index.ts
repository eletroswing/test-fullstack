import { Schema, model } from "mongoose";
import { string } from "zod";

const HeaderSchema = new Schema({
  image: String,
  title: String,
});

const ArticlesSchema = new Schema({
  title: String,
  text: String,
  created_at: String,
  slug: String,
});

const FAQSchema = new Schema({
  title: String,
  content: String,
});

const ReviewsSchema = new Schema({
  username: String,
  content: String,
  stars: Number,
  created_at: String,
  user_exists_from: String,
});

const embeddedVideosSchema = new Schema({
  url: String,
  provider: String,
});

const AttorneySchema = new Schema({
  cid: String,
  name: String,
  address: String,
  phone: String,
  email: String,
  website: String,
  description: String,
  clicks: {
    type: Number,
    default: 0
  },
});

const PageSchema = new Schema({
  zips: String,
  header: HeaderSchema,
  articles: [ArticlesSchema],
  faq: [FAQSchema],
  reviews: [ReviewsSchema],
  embedded_videos: [embeddedVideosSchema],
  attorney: [AttorneySchema],
});

const CitySchema = new Schema({
  city: String,
  city_id: String,
  page: PageSchema
});

const StateSchema =  new Schema({
    state: String,
    state_id: String,
    cities: [CitySchema] 
});


export default Object.freeze({
    StateSchema,
    CitySchema,
    PageSchema,
    AttorneySchema,
    embeddedVideosSchema,
    ReviewsSchema,
    FAQSchema,
    HeaderSchema,
});
