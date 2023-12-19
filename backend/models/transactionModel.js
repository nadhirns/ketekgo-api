import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";
import Drivers from "./driverModel.js";

const { DataTypes } = Sequelize;

const Transactions = db.define(
  "transactions",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 50],
      },
    },
    time: {
      type: DataTypes.DATE,
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

Users.hasMany(Transactions);
Transactions.belongsTo(Users, { foreignKey: "user_id", as: "UserId" });

Drivers.hasMany(Transactions);
Transactions.belongsTo(Drivers, { foreignKey: "driver_id", as: "DriverId" });

export default Transactions;
