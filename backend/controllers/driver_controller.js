import Drivers from "../models/driverModel.js";
import DriverProfiles from "../models/driverProfileModel.js";
import Places from "../models/placeModel.js";
import { Op } from "sequelize";

export const getDriver = async (req, res) => {
  try {
    let response;
    if (req.role === 1) {
      response = await Drivers.findAll({
        attributes: ["id", "capacity", "time", "price"],
        include: [
          {
            model: DriverProfiles,
            as: "Driver",
            attributes: ["user_id", "driver_name", "rating", "photo_url"],
          },
          {
            model: Places,
            as: "PlaceStart",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
          {
            model: Places,
            as: "PlaceEnd",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
        ],
      });
    } else {
      const driver = await DriverProfiles.findOne({
        where: {
          user_id: req.thisId,
        },
      });

      if (!driver)
        return res.status(404).json({
          error: true,
          message: "Driver not found",
        });

      response = await Drivers.findAll({
        attributes: ["id", "capacity", "time", "price"],
        where: {
          user_id: driver.id,
        },
        include: [
          {
            model: DriverProfiles,
            as: "Driver",
            attributes: ["user_id", "driver_name", "rating", "photo_url"],
          },
          {
            model: Places,
            as: "PlaceStart",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
          {
            model: Places,
            as: "PlaceEnd",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
        ],
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

export const getDriverById = async (req, res) => {
  try {
    const findDriv = await Drivers.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!findDriv)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });

    let response;
    if (req.role === 1) {
      response = await Drivers.findOne({
        attributes: ["id", "capacity", "time", "price"],
        where: {
          id: findDriv.id,
        },
        include: [
          {
            model: DriverProfiles,
            as: "Driver",
            attributes: ["user_id", "driver_name", "rating", "photo_url"],
          },
          {
            model: Places,
            as: "PlaceStart",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
          {
            model: Places,
            as: "PlaceEnd",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
        ],
      });
    } else {
      const driver = await DriverProfiles.findOne({
        where: {
          user_id: req.thisId,
        },
      });

      if (!driver)
        return res.status(404).json({
          error: true,
          message: "Driver not found",
        });

      response = await Drivers.findOne({
        attributes: ["id", "capacity", "time", "price"],
        where: {
          [Op.and]: [{ id: findDriv.id }, { user_id: driver.id }],
        },
        include: [
          {
            model: DriverProfiles,
            as: "Driver",
            attributes: ["user_id", "driver_name", "rating", "photo_url"],
          },
          {
            model: Places,
            as: "PlaceStart",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
          {
            model: Places,
            as: "PlaceEnd",
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
          },
        ],
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

export const createDriver = async (req, res) => {
  const { placeStart, placeEnd, capacity, time, price } = req.body;

  try {
    const driver = await DriverProfiles.findOne({
      // attributes: { exclude: ["userId"] },
      where: {
        user_id: req.thisId,
      },
    });

    if (!driver)
      return res.status(404).json({
        error: true,
        message: "Driver not found",
      });

    await Drivers.create({
      user_id: driver.id,
      place_start_id: placeStart,
      place_end_id: placeEnd,
      capacity: capacity,
      time: time,
      price: price,
      driverProfileId: driver.id,
    });

    res.status(201).json({
      error: false,
      message: "Driver Created Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const findDriv = await Drivers.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!findDriv)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });
    const { user_id, placeStart, placeEnd, capacity, time, price } = req.body;
    if (req.role === 1) {
      await Drivers.update(
        {
          user_id: user_id,
          place_start_id: placeStart,
          place_end_id: placeEnd,
          capacity: capacity,
          time: time,
          price: price,
          driverProfileId: user_id,
        },
        {
          where: {
            id: findDriv.id,
          },
        }
      );
    } else {
      const driver = await DriverProfiles.findOne({
        where: {
          user_id: req.thisId,
        },
      });

      if (!driver)
        return res.status(404).json({
          error: true,
          message: "Driver not found",
        });

      if (req.thisId !== driver.user_id)
        return res.status(403).json({
          error: true,
          message: "Access Denied!",
        });
      await Drivers.update(
        {
          user_id: driver.id,
          place_start_id: placeStart,
          place_end_id: placeEnd,
          capacity: capacity,
          time: time,
          price: price,
          driverProfileId: driver.id,
        },
        {
          where: {
            [Op.and]: [{ id: findDriv.id }, { user_id: driver.id }],
          },
        }
      );
    }
    res.status(200).json({
      error: false,
      message: "Data Updated!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const findDriv = await Drivers.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!findDriv)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });
    const { user_id, placeStart, placeEnd, capacity, time, price } = req.body;
    if (req.role === 1) {
      await Drivers.destroy({
        where: {
          id: findDriv.id,
        },
      });
    } else {
      const driver = await DriverProfiles.findOne({
        where: {
          user_id: req.thisId,
        },
      });

      if (!driver)
        return res.status(404).json({
          error: true,
          message: "Driver not found",
        });

      if (req.thisId !== driver.user_id)
        return res.status(403).json({
          error: true,
          message: "Access Denied!",
        });
      await Drivers.destroy({
        where: {
          [Op.and]: [{ id: findDriv.id }, { user_id: driver.id }],
        },
      });
    }
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
