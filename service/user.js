const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../db");
const createUser = async (googleUserId) => {
  let db = await getDB();
  let collection = db.collection("user");
  await collection.insertMany([
    {
      userId: uuidv4(),
      googleUserId,
      animeList: [{ listName: "default", listId: uuidv4(), anime: [] }],
    },
  ]);
};

const createList = async (googleUserId, listName) => {
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { googleUserId },
    { $push: { animeList: { listName, listId: uuidv4(), anime: [] } } }
  );
  console.log("Updated documents =>", updateResult);
};

const deleteList = async (googleUserId,listId)=>{
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { googleUserId },
    { $pull: { animeList: { listId } } }
  );
  console.log("Updated documents =>", updateResult);
}

// apply array filters to update
const addToList = async (googleUserId, listId, anime) => {
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { googleUserId },
    { $push: { "animeList.$[list].anime": anime } },
    { arrayFilters: [{ "list.listId": listId }] }
  );
  console.log("Updated documents =>", updateResult);
};

const removeFromList = async (googleUserId, listId, animeId) => {
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { googleUserId },
    { $pull: { "animeList.$[list].anime": {"mal_id":animeId} } },
    { arrayFilters: [{ "list.listId": listId }] }
  );
  console.log("Updated documents =>", updateResult);
};

const findUser = async (googleUserId) => {
  let db = await getDB();
  let collection = db.collection("user");
  const findResult = await collection.find({ googleUserId }).toArray();
  return findResult;
};

module.exports = {
  createUser,
  findUser,
  addToList,
  removeFromList,
  createList,
  deleteList
};
