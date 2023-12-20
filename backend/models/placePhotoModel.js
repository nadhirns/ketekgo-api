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

Places.hasMany(PlacePhotos, { foreignKey: "place_id", as: "photos" });
PlacePhotos.belongsTo(Places, { foreignKey: "place_id", as: "placeId", onDelete: "CASCADE" });

export default PlacePhotos;
