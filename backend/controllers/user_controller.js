import { where } from "sequelize";
import Users from "../models/userModel.js";
import Roles from "../models/roleModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll({
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Roles,
          as: "UserRole",
          attributes: ["name"],
        },
      ],
    });
    if (response.length === 0) {
      return res.status(200).json({
        error: false,
        message: "No Users Yet!",
      });
    }
    res.status(200).json({
      error: false,
      message: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const getUsersById = async (req, res) => {
  try {
    const response = await Users.findOne({
      attributes: ["id", "name", "email"],
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Roles,
          as: "UserRole", // Gantilah dengan model Roles yang sesuai
          attributes: ["name"], // Kolom yang ingin Anda ambil dari tabel Roles
        },
      ],
    });
    res.status(200).json({
      error: false,
      message: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const createUsers = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ msg: "Password and Confirm Password Not Match!" });
  const hashPass = await argon2.hash(password);
  try {
    await Users.create({
      name: name,
      email: email,
      password: hashPass,
      user_role_id: role,
      userRoleId: role,
    });
    res.status(201).json({
      error: false,
      messsage: "Register Successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

export const updateUsers = async (req, res) => {
  const user = await Users.findOne({
    // attributes: { exclude: ["userRoleId"] },
    where: {
      id: req.params.id,
    },
  });

  if (!user)
    return res.status(404).json({
      error: true,
      message: "User Not Found!",
    });

  const { name, email, password, confirmPassword, role } = req.body;

  let hashPass;

  if (password === "" || password === null) {
    hashPass = user.password;
  } else {
    hashPass = await argon2.hash(password);
  }
  if (password !== confirmPassword)
    return res.status(400).json({
      error: true,
      message: "Password and Confirm Password Not Match!",
    });
  try {
    await Users.update(
      {
        name: name,
        email: email,
        password: hashPass,
        user_role_id: role,
        userRoleId: role,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({
      error: false,
      message: "Update User Successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

export const deleteUsers = async (req, res) => {
  const user = await Users.findOne({
    // attributes: { exclude: ["userRoleId", "createdAt", "updatedAt"] },
    where: {
      id: req.params.id,
    },
  });
  if (!user)
    return res.status(404).json({
      error: true,
      message: "User Not Found!",
    });
  try {
    await Users.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({
      error: false,
      message: "Delete User Successfully!",
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};
