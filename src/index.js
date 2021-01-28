const bodyParser = require("body-parser");
const express = require("express");

const auth = require('./firebase')
const db = require('./db');

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

auth.onAuthStateChanged(user => {
  if (user) {
    app.locals.currentUser = user.email;
  }else {
    app.locals.currentUser = null;
  }
})

app.post("/register", (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  auth
  .createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
    let userId = userCredential.user.uid;

      return db
        .ref("users/" + userId)
        .set({ firstName: firstName, lastName: lastName, email: email });
    })
    .then(() => {
      console.log("Added user");
      res.send({
        firstName: firstName,
        lastName: lastName,
        email: email,
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/sign-out", (req, res) => {
  let user = app.locals.currentUser

  if (user) {
    auth
      .signOut()
      .then(() => {
        res.send({
          message: "User has been signed out", 
          user: user.email
        })
      })
      .catch(() => {
        res.send("err");
      });
  } else {
    res.send("No user signed in");
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      db.ref("users")
        .child(userCredential.user.uid).on("value", (snapshot) => {
          res.send(snapshot);
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get('/reset-password', (req, res) => {
  const { email } = req.body;

  auth.sendPasswordResetEmail(email).then(() => {
    res.send('Email comming your way')
  }).catch((err) => {
    res.send(err)
  });
})

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
