import models from "../../../infra/models";

async function createCity(stateId: string, cityName: string, cityId: string) {
  try {
    const citie = {
      city_id: cityId,
      city: cityName,
      page: {
        zips: "",
        header: {
          image: undefined,
          title: undefined
        },
        articles: [],
        faq: [],
        reviews: [],
        embedded_videos: [],
        attorney: [],
      },
    };

    await models.StateModel.findOneAndUpdate(
      { state_id: stateId },
      { $push: { cities: citie } },
      { new: true }
    );

    return citie;
  } catch (err) {
    throw new Error(`Error creating de city: ${err}`);
  }
}

async function getAllCityFromState(stateId: string) {
  try {
    const state = await models.StateModel.findOne({ state_id: stateId });

    return state?.cities;
  } catch (err) {
    throw new Error(`Error searching the city: ${err}`);
  }
}

async function findCityByIdAndStateId(stateId: string, cityId: string) {
  try {
    const state = await models.StateModel.findOne({
      "cities.city_id": cityId,
      state_id: stateId,
    });

    const city = state?.cities.find((city) => city.city_id === cityId);

    return city;
  } catch (err) {
    throw new Error(`Error searching the city: ${err}`);
  }
}

export default Object.freeze({
  getAllCityFromState,
  createCity,
  findCityByIdAndStateId,
});
