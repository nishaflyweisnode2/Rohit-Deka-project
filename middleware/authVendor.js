const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");
const Vendor = require("../Models/vendorDetails");
const dotenv = require("dotenv");
// dotenv.config({ path: "configs/config.env" });

const verifyToken = (req, res, next) => {
  const token =req.get("Authorization")?.split("Bearer ")[1] ||req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({message: "no token provided! Access prohibited",});
  }

  jwt.verify(token, "node5flyweis", async (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({message: "UnAuthorised !",});
    }
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(400).send({message: "The Vendor that this token belongs to does not exist",});
    }
    req.user = user;
    console.log(req.user);
    next();
  });
};
const isAdmin = (req, res, next) => {
  const token =
    req.headers["x-access-token"] ||
    req.get("Authorization")?.split("Bearer ")[1];

  if (!token) {
    return res.status(403).send({
      message: "no token provided! Access prohibited",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "UnAuthorised ! Admin role is required! ",
      });
    }

    const user = await AdminModel.findOne({ email: decoded.id });

    if (!user) {
      return res.status(400).send({
        message: "The admin that this  token belongs to does not exist",
      });
    }
    req.user = user;

    next();
  });
};

module.exports = {
  verifyToken,
  isAdmin,
};