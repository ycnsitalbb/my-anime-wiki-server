const { v4: uuidv4 } = require("uuid");
const { getDB } = require("../../db");
const { saltAndHash, match } = require("../hash");
const createGoogleUser = async (googleUserId) => {
  let db = await getDB();
  let collection = db.collection("user");
  await collection.insertMany([
    {
      userId: uuidv4(),
      googleUserId,
      username: null,
      password: null,
      email: null,
      animeList: [{ listName: "default", listId: uuidv4(), anime: [] }],
    },
  ]);
};

const createNormalUser = async (username, password, email) => {
  let db = await getDB();
  let collection = db.collection("user");
  await collection.insertMany([
    {
      userId: uuidv4(),
      googleUserId: null,
      username,
      password: saltAndHash(password),
      email,
      animeList: [{ listName: "default", listId: uuidv4(), anime: [] }],
    },
  ]);
};

const findUserById = async (userId)=>{
    let db = await getDB();
    let collection = db.collection("user");
    const findResult = await collection.find({ userId }).toArray();
    if(findResult.length===1){
        return {userId,animeList:findResult[0].animeList}
    }else{
        return null;
    }
}

const checkUserExists = async (username,password)=>{
    let db = await getDB();
    let collection = db.collection("user");
    const findResult = await collection.find({ username }).toArray();
    if(findResult.length === 1){
        return true
    }else{
        return false
    }
}

const findNormalUser = async (username, password) => {
  let db = await getDB();
  let collection = db.collection("user");
  const findResult = await collection.find({ username }).toArray();
  if (findResult.length === 1 && match(password, findResult[0].password)) {
    return { userId: findResult[0].userId, animeList: findResult[0].animeList };
  } else {
    return null;
  }
};

const findGoogleUser = async (googleUserId) => {
  let db = await getDB();
  let collection = db.collection("user");
  const findResult = await collection.find({ googleUserId }).toArray();
  if (findResult.length === 1) {
    return { userId: findResult[0].userId, animeList: findResult[0].animeList };
  } else {
    return null;
  }
};
module.exports = {
  createGoogleUser,
  findGoogleUser,
  findUserById,
  createNormalUser,
  findNormalUser,
};
