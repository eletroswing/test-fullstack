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

async function getAllStates() {
  const states = await models.StateModel.find();

  return states;
}

async function deleteAll() {
  return await models.StateModel.deleteMany({});
}

export default Object.freeze({
  createState,
  findStateById,
  getAllStates,
  deleteAll,
});
