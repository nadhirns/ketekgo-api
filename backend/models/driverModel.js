import { Sequelize } from "sequelize";
import db from "../config/database.js";
import DriverProfiles from "./driverProfileModel.js";
import Places from "./placeModel.js";

const { DataTypes } = Sequelize;

const Drivers = db.define(
  "drivers",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    place_start_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    place_end_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.FLOAT,
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

DriverProfiles.hasMany(Drivers);
Drivers.belongsTo(DriverProfiles, { foreignKey: "user_id", as: "Driver" });

Places.hasMany(Drivers);
Drivers.belongsTo(Places, { foreignKey: "place_start_id", as: "PlaceStart" });

Places.hasMany(Drivers);
Drivers.belongsTo(Places, { foreignKey: "place_end_id", as: "PlaceEnd" });

export default Drivers;
