import models from "../../../infra/models";

async function createState(stateName: string, stateId: string) {
  const state = await models.StateModel.create({
    state: stateName,
    state_id: stateId,
    cities: [],
  });

  return state;
}

async function findStateById(stateId: string) {
  const state = await models.StateModel.findOne({ state_id: stateId });

  return state;
}

async function getAllStates(page: any = 1) {
  const skip = (page - 1) * 30;

  const states = await models.StateModel.find().select('-cities').skip(skip).limit(30);

  return states;  
}

async function getStatesPageCount(){
  const totalStates = await models.StateModel.countDocuments();
  const totalPages = Math.ceil(totalStates / 30);

  return totalPages;
}

async function deleteAll() {
  return await models.StateModel.deleteMany({});
}

export default Object.freeze({
  createState,
  findStateById,
  getAllStates,
  deleteAll,
  getStatesPageCount,
});
