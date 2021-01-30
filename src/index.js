const bodyParser = require("body-parser");
const express = require("express");

const auth = require("./firebase");
const db = require("./db");

const app = express();

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, \
		content-type, Authorization"
  );
  next();
});

auth.onAuthStateChanged((user) => {
  if (user) {
    app.locals.currentUser = user.email;
  } else {
    app.locals.currentUser = null;
  }
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let userId = userCredential.user.uid;

      return db.ref("users/" + userId).set({ name: name, email: email });
    })
    .then(() => {
      console.log("Added user");
      res.send(
        JSON.stringify({
          type: "success",
          snapshot: {
            name: name,
            email: email,
          },
        })
      );
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/sign-out", (req, res) => {
  let user = app.locals.currentUser;

  if (user) {
    auth
      .signOut()
      .then(() => {
        res.send(
          JSON.stringify({
            type: "success",
            message: "User has been signed out",
            user: user,
          })
        );
      })
      .catch(() => {
        res.send(err);
      });
  } else {
    res.send(
      JSON.stringify({
        message: "No user signed in",
      })
    );
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      db.ref("users")
        .child(userCredential.user.uid)
        .on("value", (snapshot) => {
          const data = {
            snapshot: snapshot.val(),
            type: "success",
          };

          res.send(JSON.stringify(data));
        });
    })
    .catch((err) => {
      res.send(err);
    });
});

app.post("/reset-password", (req, res) => {
  const { email } = req.body;

  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      res.send(
        JSON.stringify({
          type: "success",
          message: "Email coming your way",
        })
      );
    })
    .catch((err) => {
      res.send(err);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
