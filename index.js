const express = require("express");
const cors = require("cors");
const { initDB } = require("./db");
const {
  createGoogleUser,
  findGoogleUser,
  createNormalUser,
  findNormalUser,
  findUserById,
} = require("./service/user/auth");
const {
  addToList,
  removeFromList,
  createList,
  deleteList,
} = require("./service/user/anime");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}

initDB();

app.get("/", (req, res) => {
  res.send("Welcome to my-anime-wiki server");
});

//normal sign up
app.post("/users/signup", async (req, res) => {
  console.log("user signup request received");
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  createNormalUser(username, password, email);
  console.log("user signup complete");
  res.send({
    message: "user sign up complete",
  });
});


// normal Login
app.post("/users/login/normal", async (req, res) => {
  console.log("normaluser log in request received");
  
  const username = req.body.username;
  const password = req.body.password;
  console.log(username)
  console.log(password)
  const userData = await findNormalUser(username, password);
  if (!!userData) {
    console.log("user found,authentication success");
    res.send(userData);
  } else {
    console.log("user not found, authentication failed");
    res.status(400)
    res.send({ state: "AUTHENTICATION_FAILED", message: "invalid combination of username and password" });
  }
});

// google login
app.post("/users/login/google", async (req, res) => {
  console.log("google log in request received");
  const userGoogleId = req.body.userGoogleId;
  const userData = await findGoogleUser(userGoogleId);
  if (!!userData) {
    console.log("user found");
    res.send(userData);
  } else {
    console.log("google user not found, create a new user");
    await createGoogleUser(userGoogleId);
    const userData = await findGoogleUser(userGoogleId);
    res.send(userData);
  }
});

// create new list
app.post("/users/:userId/animeList", async (req, res) => {
  console.log("create list request received");
  const userId = req.params.userId;
  const listName = req.body.listName;
  await createList(userId, listName);
  const data = await findUserById(userId);
  if (data) {
    res.send(data);
  } else {
    res.send({ code: 400, message: "user not found" });
  }
});
// delete list
app.delete("/users/:userId/animeList/:listId", async (req, res) => {
  console.log("delete list request received");
  const userId = req.params.userId;
  const listId = req.params.listId;
  await deleteList(userId, listId);
  const data = await findUserById(userId);
  if (data) {
    res.send(data);
  } else {
    res.send({ code: 400, message: "user not found" });
  }
});

// add anime into a specific list
app.post("/users/:userId/animeList/:listId/anime", async (req, res) => {
  console.log("add anime to list request received, processing");
  const userId = req.params.userId;
  const anime = req.body.anime;
  const listId = req.params.listId;
  await addToList(userId, listId, anime);
  const data = await findUserById(userId);
  if (data) {
    res.send(data);
  } else {
    res.send({ code: 400, message: "user not found" });
  }
});

// add anime from a specific list
app.delete("/users/:userId/animeList/:listId/:animeId", async (req, res) => {
  console.log("remove anime from list request received, processing");
  const userId = req.params.userId;
  const listId = req.params.listId;
  // While the anime id in anime object is saved as number,the parameter pass in a string
  // We should turn it into a number for later db query
  const animeId = Number(req.params.animeId);
  await removeFromList(userId, listId, animeId);
  const data = await findUserById(userId);
  if (data) {
    res.send(data);
  } else {
    res.send({ code: 400, message: "user not found" });
  }
});

app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
