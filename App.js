const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");
const {
  createUser,
  findUser,
  addToList,
  removeFromList,
  createList,
  deleteList,
} = require("./service/user");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3001;

initDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/users", async (req, res) => {
  console.log("log in request received");
  const userGoogleId = req.body.userId;
  const results = await findUser(userGoogleId);
  if (!!results && results.length == 1) {
    console.log("user found");
    res.send({
      message: "we have found the user, we are going to send back his data",
      animeList: results[0].animeList,
    });
  } else {
    console.log("user not found, create a new user");
    await createUser(userGoogleId);
    res.send({
      message:
        "we haven't found the user in our db, let's create his profile in our system",
      animeList: [],
    });
  }
});
// create new list
app.post("/users/:userId/animeList",async (req,res)=>{
  console.log("create list request received");
  const userId = req.params.userId;
  const listName = req.body.listName
  await createList(userId,listName)
  const results = await findUser(userId);
  res.send({
    animeList: results[0].animeList,
    message: "we have added the list of" + listName
  });
})
app.post("/users/:userId/animeList/:listId",async (req,res)=>{
  console.log("delete list request received");
  const userId = req.params.userId;
  const listId = req.params.listId;
  await deleteList(userId,listId)
  const results = await findUser(userId);
  res.send({
    animeList: results[0].animeList,
    message: "we have deleted the list of" + listId
  });
})
// add anime into a specific list
app.post("/users/:userId/animeList/:listId/anime", async (req, res) => {
  console.log("add anime to list request received, processing");

  const userId = req.params.userId;
  const anime = req.body.anime;
  const listId = req.params.listId;
  console.log(userId)
  console.log(anime)
  console.log(listId)
  await addToList(userId, listId,anime);
  const results = await findUser(userId);
  res.send({
    animeList: results[0].animeList,
    message: "we have added the anime of " + anime.mal_id + " to anime list",
  });
});
// add anime from a specific list
app.delete("/users/:userId/animeList/:listId/:animeId", async (req, res) => {
  console.log("remove anime from list request received, processing");
  const userId = req.params.userId;
  const listId = req.params.listId; 
  // While the anime id in anime object is saved as number,the parameter pass in a string
  // We should turn it into a number for later db query
  const animeId = Number(req.params.animeId);
  await removeFromList(userId, listId,animeId);
  const results = await findUser(userId);
  res.send({
    animeList: results[0].animeList,
    message: "we have removed the anime of " + animeId + " from anime list",
  });
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
