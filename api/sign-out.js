const auth = require("../lib/firebase");

module.exports = (req, res) => {
  let user = auth.currentUser;

  if (user) {
    auth
      .signOut()
      .then(() => {
        res.send({
          message: "User has been signed out",
          user: user.email,
        });
      })
      .catch(() => {
        res.send("err");
      });
  } else {
    res.send("No user signed in");
  }
};
