import models from "../../../infra/models";

async function getPage(stateId: string, cityId: string) {
  try {
    const state = await models.StateModel.findOne({
      state_id: stateId,
      cities: { $elemMatch: { city_id: cityId } },
    });

    const page = state?.cities.find((city) => city.city_id === cityId)?.page;

    return page;
  } catch (err) {
    throw new Error(`Error getting the Page: ${err}`);
  }
}

async function updateHeader(
  stateId: string,
  cityId: string,
  imageBase64?: string,
  title?: string
) {
  try {
    let editObject: any = {};
    if (imageBase64) editObject["cities.$.page.header.image"] = imageBase64;
    if (title) editObject["cities.$.page.header.title"] = title;

    const state = await models.StateModel.findOneAndUpdate(
      { state_id: stateId, cities: { $elemMatch: { city_id: cityId } } },
      { $set: editObject },
      { new: true }
    );

    return state?.cities.find((city) => city.city_id === cityId)?.page?.header;
  } catch (err) {
    throw new Error(`Error updating the header: ${err}`);
  }
}

async function updateZips(stateId: string, cityId: string, zips: string) {
  try {
    const state = await models.StateModel.findOneAndUpdate(
      { state_id: stateId, cities: { $elemMatch: { city_id: cityId } } },
      { $set: { "cities.$.page.zips": zips } },
      { new: true }
    );

    return state?.cities.find((city) => city.city_id === cityId)?.page?.zips;
  } catch (err) {
    throw new Error(`Error updating the zips: ${err}`);
  }
}

async function updateFaqs(
  stateId: string,
  cityId: string,
  faqs: {
    title: string;
    content: string;
  }[]
) {
  try {
    const state = await models.StateModel.findOneAndUpdate(
      { state_id: stateId, cities: { $elemMatch: { city_id: cityId } } },
      { $set: { "cities.$.page.faq": faqs } },
      { new: true }
    );

    return state?.cities.find((city) => city.city_id === cityId)?.page?.faq;
  } catch (err) {
    throw new Error(`Error updating the faqs: ${err}`);
  }
}

async function updateReviews(
  stateId: string,
  cityId: string,
  reviews: {
    username: String;
    image: String;
    content: String;
    starts: Number;
    created_at: String;
    user_exists_from: String;
  }[]
) {
  try {
    const state = await models.StateModel.findOneAndUpdate(
      { state_id: stateId, cities: { $elemMatch: { city_id: cityId } } },
      { $set: { "cities.$.page.reviews": reviews } },
      { new: true }
    );

    return state?.cities.find((city) => city.city_id === cityId)?.page?.reviews;
  } catch (err) {
    throw new Error(`Error updating the reviews: ${err}`);
  }
}

async function updateembeddedVideos(
  stateId: string,
  cityId: string,
  embedded_videos: {
    url: string;
    provider: "youtube" | "tiktok";
  }[]
) {
  try {
    const state = await models.StateModel.findOneAndUpdate(
      { state_id: stateId, cities: { $elemMatch: { city_id: cityId } } },
      { $set: { "cities.$.page.embedded_videos": embedded_videos } },
      { new: true }
    );

    return state?.cities.find((city) => city.city_id === cityId)?.page
      ?.embedded_videos;
  } catch (err) {
    throw new Error(`Error updating the embedded videos: ${err}`);
  }
}

async function updateAttorney(
  stateId: string,
  cityId: string,
  attorney: {
    cid: String;
    name: String;
    description: String;
    address: String;
    phone: String;
    website: String;
  }[]
) {
  try {
    const state = await models.StateModel.findOneAndUpdate(
      { state_id: stateId, cities: { $elemMatch: { city_id: cityId } } },
      { $set: { "cities.$.page.attorney": attorney } },
      { new: true }
    );

    return state?.cities.find((city) => city.city_id === cityId)?.page
      ?.attorney;
  } catch (err) {
    throw new Error(`Error updating the attorney: ${err}`);
  }
}

async function updateArticles(
  stateId: string,
  cityId: string,
  articles: {
    title: String;
    text: String;
    created_at: String;
    slug: String;
    image: String;
  }[]
) {
  try {
    const state = await models.StateModel.findOneAndUpdate(
      { state_id: stateId, cities: { $elemMatch: { city_id: cityId } } },
      { $set: { "cities.$.page.articles": articles } },
      { new: true }
    );

    return state?.cities.find((city) => city.city_id === cityId)?.page
      ?.articles;
  } catch (err) {
    throw new Error(`Error updating the articles: ${err}`);
  }
}

async function getArticle(stateId: string, cityId: string, slug: string) {
  try {
    const state = await models.StateModel.findOne({
      state_id: stateId,
      cities: { $elemMatch: { city_id: cityId } },
    });

    const article = state?.cities
      .find((city) => city.city_id === cityId)
      ?.page?.articles.find((article) => article.slug == slug);

    return article;
  } catch (err) {
    throw new Error(`Error getting the article: ${err}`);
  }
}

async function updateAttorneyClick(
  stateId: string,
  cityId: string,
  cid: string
) {
  try {
    const state = await models.StateModel.findOneAndUpdate(
      {
        state_id: stateId,
        "cities.city_id": cityId,
        "cities.page.attorney.cid": cid
      },
      {
        $inc: {
          "cities.$[cityElem].page.attorney.$[attorneyElem].clicks": 1
        }
      },
      { 
        new: true,
        arrayFilters: [
          { "cityElem.city_id": cityId },
          { "attorneyElem.cid": cid }
        ]
      }
    );

    return state
  } catch (err) {
    throw new Error(`Error updating the attorney: ${err}`);
  }
}

export default Object.freeze({
  getPage,
  updateHeader,
  updateZips,
  updateFaqs,
  updateReviews,
  updateembeddedVideos,
  updateAttorney,
  updateArticles,
  getArticle,
  updateAttorneyClick
});
