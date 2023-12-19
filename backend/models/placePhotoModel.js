import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Places from "./placeModel.js";

const { DataTypes } = Sequelize;

const PlacePhotos = db.define(
  "place_photos",
  {
    place_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    place_photo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 100],
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Places.hasMany(PlacePhotos);
PlacePhotos.belongsTo(Places, { foreignKey: "place_id", as: "PlaceId" });

export default PlacePhotos;
