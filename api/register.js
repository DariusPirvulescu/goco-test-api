const { auth, db } = require("../lib/firebase");

module.exports = (req, res) => {
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
};
