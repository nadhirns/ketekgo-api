import Users from "../models/userModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.token) {
    return res.status(401).json({ msg: "Please Login First!" });
  }
  const user = await Users.findOne({
    attributes: ["id", "name", "email", "user_role_id"],
    where: {
      refresh_token: req.session.token,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Not Found!" });
  req.userId = user.id;
  req.role = user.user_role_id;
  next();
};

export const adminOnly = async (req, res, next) => {
  const user = await Users.findOne({
    attributes: ["id", "name", "email", "user_role_id"],
    where: {
      refresh_token: req.session.token,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Not Found!" });
  if (user.user_role_id !== 1) return res.status(403).json({ msg: "Access Denied!" });
  next();
};
