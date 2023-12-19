import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";

const { DataTypes } = Sequelize;

const DriverProfiles = db.define(
  "driver_profiles",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    driver_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    photo_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Users.hasMany(DriverProfiles);
DriverProfiles.belongsTo(Users, { foreignKey: "user_id", as: "UserId" });

export default DriverProfiles;
