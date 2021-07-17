const { MongoClient } = require("mongodb");
let _db;

const uri =
  "mongodb+srv://astray:astrayblue@cluster0.hutmc.azure.mongodb.net/my-anime-wiki?retryWrites=true&w=majority";

const initDB = async () => {
  let client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  _db = client.db("my-anime-wiki");
  return _db;
};

const getDB = async () => {
  if (!_db) {
    return initDB();
  } else {
    return _db;
  }
};
module.exports = { initDB, getDB };
