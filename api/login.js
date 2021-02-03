const { auth, db } = require("../lib/firebase");

module.exports = (req, res) => {
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
};
