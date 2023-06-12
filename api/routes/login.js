const router = require("express").Router();
const UserLogin = require("../models/userLogin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res, next) => {
  let isPassMatch = false;
  try {
    const user = await UserLogin.findOne({ email: req.body.email }).exec();
    if (!user) {
      res.status(401).json("Incorrect credentials");
    } else {
      isPassMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!isPassMatch) {
        res.status(401).json("Incorrect credentials");
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            email: user.email
            // isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
          { expiresIn: "1h" }
        );
        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
});

module.exports = router;
