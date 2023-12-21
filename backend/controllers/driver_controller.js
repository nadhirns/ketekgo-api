import Drivers from "../models/driverModel.js";
import DriverProfiles from "../models/driverProfileModel.js";
import Places from "../models/placeModel.js";
import { Op } from "sequelize";

export const joinDriver = async (req, res) => {
  try {
    if (req.role !== 3)
      return res.status(403).json({
        error: true,
        message: "Request Denied!",
      });

    const exist = await DriverProfiles.findOne({
      where: {
        user_id: req.thisId,
      },
    });

    if (exist)
      return res.status(403).json({
        error: true,
        message: "You are Already a Driver!",
      });

    const { driverName, photoUrl } = req.body;

    await DriverProfiles.create({
      user_id: req.thisId,
      driver_name: driverName,
      rating: 0,
      photo_url: photoUrl,
      userId: req.thisId,
    });

    res.status(200).json({
      error: false,
      message: "Successfully Joined as a Driver!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const getOnlyDriver = async (req, res) => {
  try {
    let response;
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

export const getDriver = async (req, res) => {
  try {
    let response;
    response = await Drivers.findAll({
      attributes: ["id", "capacity", "time", "price"],
      where: {
        available: true,
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

    if (response.length === 0) {
      return res.status(200).json({
        error: false,
        message: "No Drivers Yet!",
      });
    }
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
  const { placeStart, placeEnd, capacity, time, price, available } = req.body;

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
      available: available,
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
    const { user_id, placeStart, placeEnd, capacity, time, price, available } = req.body;
    if (req.role === 1) {
      await Drivers.update(
        {
          user_id: user_id,
          place_start_id: placeStart,
          place_end_id: placeEnd,
          capacity: capacity,
          time: time,
          price: price,
          available: available,
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
          available: available,
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
