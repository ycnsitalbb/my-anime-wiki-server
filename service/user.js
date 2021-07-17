const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../MongoDB");
const createUser = async (googleUserId) => {
  let db = await getDB();
  let collection = db.collection("user");
  await collection.insertMany([
    { userId: uuidv4(), googleUserId, animeList: [] },
  ]);
};

const addToList = async (googleUserId, anime) => {
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { googleUserId },
    { $push: { animeList: anime } }
  );
  console.log("Updated documents =>", updateResult);
};

const removeFromList = async (googleUserId, animeId) => {
  let db = await getDB();
  let collection = db.collection("user");
  const updateResult = await collection.updateOne(
    { googleUserId },
    { $pull: { animeList: { mal_id: animeId } } }
  );
  console.log("Updated documents =>", updateResult);
};

const findUser = async (googleUserId) => {
  let db = await getDB();
  let collection = db.collection("user");
  const findResult = await collection.find({ googleUserId }).toArray();
  return findResult;
};

module.exports = { createUser, findUser, addToList, removeFromList };
