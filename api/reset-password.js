const { auth } = require("../lib/firebase");

module.exports = (req, res) => {
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
};
