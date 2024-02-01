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

async function getAllCityFromState(stateId: string, page: number = 1) {
  const skip = (page - 1) * 30;

  try {
    const state = await models.StateModel.findOne({ state_id: stateId }, { cities: { $slice: [skip, 30] } });

    return state?.cities;
  } catch (err) {
    throw new Error(`Error searching the cities: ${err}`);
  }
}

async function getAllCityFromStatePageCount(stateId: string){
  const state = await models.StateModel.aggregate([
    { $match: { state_id: stateId } },
    { $project: { cityCount: { $size: "$cities" } } }
  ]);

  const cityCount = state[0].cityCount;

  const totalPages = Math.ceil(cityCount / 30);

  return totalPages;
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
  getAllCityFromStatePageCount,
  findCityByIdAndStateId,
});
