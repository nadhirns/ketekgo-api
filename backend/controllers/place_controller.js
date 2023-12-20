import { Op } from "sequelize";
import Places from "../models/placeModel.js";
import PlacePhotos from "../models/placePhotoModel.js";

export const getPlace = async (req, res) => {
  try {
    let response;

    if (req.role !== 1)
      return res.status(403).json({
        error: true,
        message: "Access Denied!",
      });

    const placesData = await Places.findAll({
      attributes: ["id", "place_name", "location", "description", "price", "rating"],
      raw: true,
    });
    const placePhotosData = await PlacePhotos.findAll({
      attributes: ["place_id", "place_photo"],
      raw: true,
    });
    response = placesData.map((place) => {
      const photos = placePhotosData
        .filter((photo) => photo.place_id === place.id)
        .map((photo) => ({
          id: photo.id,
          place_photo: photo.place_photo,
        }));

      return {
        ...place,
        album: photos.length > 0 ? photos : null,
      };
    });

    res.status(200).json({
      error: false,
      message: "Success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const findplace = await Places.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!findplace)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });

    let response;
    if (req.role !== 1)
      return res.status(403).json({
        error: true,
        message: "Access Denied!",
      });

    const placesData = await Places.findOne({
      attributes: ["id", "place_name", "location", "description", "price", "rating"],
      raw: true,
      where: {
        id: findplace.id,
      },
    });

    const photos = await PlacePhotos.findAll({
      where: { place_id: findplace.id },
      attributes: ["place_photo"],
      raw: true,
    });

    placesData.album = photos.length > 0 ? photos : null;
    response = [placesData];

    res.status(200).json({
      error: false,
      message: "Success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const createPlace = async (req, res) => {
  const { placeName, location, description, price, photos } = req.body;

  try {
    if (req.role !== 1)
      return res.status(404).json({
        error: true,
        message: "Access Denied!",
      });
    const newPlace = await Places.create({
      place_name: placeName,
      location: location,
      description: description,
      price: price,
      rating: 0,
    });

    if (photos && Array.isArray(photos)) {
      const placePhotosData = photos.map((photo) => ({
        place_id: newPlace.id,
        place_photo: photo,
        placeId: newPlace.id,
      }));

      await PlacePhotos.bulkCreate(placePhotosData);
    }

    res.status(201).json({
      error: false,
      message: "Place Created Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const updatePlace = async (req, res) => {
  try {
    const findplace = await Places.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!findplace)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });

    if (req.role !== 1)
      return res.status(403).json({
        error: true,
        message: "Access Denied!",
      });

    const { placeName, location, description, price, rating, photos } = req.body;

    await Places.update(
      {
        place_name: placeName,
        location: location,
        description: description,
        price: price,
        rating: rating,
      },
      {
        where: {
          id: findplace.id,
        },
      }
    );

    if (photos && Array.isArray(photos)) {
      await PlacePhotos.destroy({
        where: {
          place_id: findplace.id,
        },
      });

      const placePhotosData = photos.map((photo) => ({
        place_id: findplace.id,
        place_photo: photo,
        placeId: findplace.id,
      }));

      await PlacePhotos.bulkCreate(placePhotosData);
    }

    res.status(200).json({
      error: false,
      message: "Place Updated Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const deletePlace = async (req, res) => {
  try {
    const findplace = await Places.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!findplace)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });

    if (req.role !== 1)
      return res.status(403).json({
        error: true,
        message: "Access Denied!",
      });

    await Places.destroy({
      where: {
        id: findplace.id,
      },
    });

    res.status(200).json({
      error: false,
      message: "Data Deleted!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
