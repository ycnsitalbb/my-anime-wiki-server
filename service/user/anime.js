const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../../db");

const createList = async (userId, listName) => {
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { userId },
    { $push: { animeList: { listName, listId: uuidv4(), anime: [] } } }
  );
  console.log("Updated documents =>", updateResult);
};

const deleteList = async (userId, listId) => {
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { userId },
    { $pull: { animeList: { listId } } }
  );
  console.log("Updated documents =>", updateResult);
};

// apply array filters to update
const addToList = async (userId, listId, anime) => {
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { userId },
    { $push: { "animeList.$[list].anime": anime } },
    { arrayFilters: [{ "list.listId": listId }] }
  );
  console.log("Updated documents =>", updateResult);
};

const removeFromList = async (userId, listId, animeId) => {
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { userId },
    { $pull: { "animeList.$[list].anime": { mal_id: animeId } } },
    { arrayFilters: [{ "list.listId": listId }] }
  );
  console.log("Updated documents =>", updateResult);
};


module.exports = {
  addToList,
  removeFromList,
  createList,
  deleteList,
};
