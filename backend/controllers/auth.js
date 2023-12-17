import Users from "../models/userModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await Users.findOne({
    attributes: { exclude: ["userRoleId"] },
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User Not Found!" });

  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Wrong Password!" });
  req.session.token = user.refresh_token;
  const uuid = user.refresh_token;
  const name = user.name;
  const email = user.email;
  const role = user.user_role_id;
  res.status(200).json({ uuid, name, email, role });
};

export const Me = async (req, res) => {
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
  res.status(200).json(user);
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Cannot Log Out!" });
    res.status(200).json({ msg: "Log Out Successfully!" });
  });
};