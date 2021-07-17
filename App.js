const express = require("express");
const cors = require("cors");
const { initDB } = require("./MongoDB");
const {
  createUser,
  findUser,
  addToList,
  removeFromList,
} = require("../my-anime-wiki-server/service/user");
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

app.post("/users/:userId/animeList", async (req, res) => {
  console.log("add anime to list request received, processing");
  const userId = req.params.userId;
  const anime = req.body.anime;
  await addToList(userId, anime);
  const results = await findUser(userId);
  res.send({
    animeList: results[0].animeList,
    message: "we have added the anime of" + anime.mal_id + "to anime list",
  });
});
app.delete("/users/:userId/animeList/:animeId", async (req, res) => {
  console.log("remove anime from list request received, processing");
  const userId = req.params.userId;
  // While the anime id in anime object is saved as number,the parameter pass in a string
  // We should turn it into a number for later db query
  const animeId = Number(req.params.animeId);
  await removeFromList(userId, animeId);
  const results = await findUser(userId);
  res.send({
    animeList: results[0].animeList,
    message: "we have removed the anime of" + animeId + "from anime list",
  });
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
