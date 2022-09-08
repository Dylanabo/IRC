const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const cors = require('cors');

const users = [
]



const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}

app.use(cors(corsOptions));

app.use(express.json());

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get("/getUserInfo:email", (req, res) => {
  const found = users.find(user => user.email === req.params.email);
  console.log("found", found);
  res.send(found);
})

app.put("/putUserInfo", (req, res) => {
  const index = users.findIndex(user => user.email === req.body.email);
  users[index].desc = req.body.desc;
  users[index].pseudo = req.body.pseudo;
  console.log(users);
  res.send("change");
})

app.post("/connected", (request, req) => {
  if (users) {
    const new_user = {"name" : request.body.name, "email" : request.body.email, "desc" : "NULL", "pseudo" : ""}
    users.push(new_user);
  } else {
     const new_user = {"name" : request.body.name, "email" : request.body.email, "desc" : "NULL", "pseudo" : ""}
     const found = users.some(user => user.email === request.body.email);
     if (!found) users.push(new_user);
  }
  req.send("Récu");
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

