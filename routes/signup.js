const bcrypt = require("bcryptjs");
const replaceErr = require("../utils");
const { User } = require("../db");
async function signup(req, res) {
  try {
    const { email, fullname, password, role } = req.body;
    if (!email || !fullname || !password || !role) {
      const err = new Error("provide accurate information");
      err.code = 400;
      throw err;
    }
    if (password.length <= 5) {
      const err = new Error("password fields should be greater than 5");
      err.code = 400;
      throw err;
    }
    const existingUser = await replaceErr(User.findOne({ email }));
    if (existingUser) {
      const err = new Error(
        "User with the specified email already exists, try logging in"
      );
      err.code = 404;
      throw err;
    }
    const newUser = new User({
      email,
      name: fullname,
      role,
      password: await replaceErr(bcrypt.hash(password, 10)),
    });
    const savedUser = await replaceErr(newUser.save());
    return res.send(savedUser);
  } catch (err) {
    return res.status(err.code).send(err.message);
  }
}
module.exports = signup;
