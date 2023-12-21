import Drivers from "../models/driverModel.js";
import DriverProfiles from "../models/driverProfileModel.js";
import Places from "../models/placeModel.js";
import Transactions from "../models/transactionModel.js";
import Users from "../models/userModel.js";
import { Op } from "sequelize";

export const getTransaction = async (req, res) => {
  try {
    const response = await Transactions.findAll({
      attributes: ["id", "total_price", "status", "time"],
      include: [
        {
          model: Users,
          as: "UserId",
          attributes: ["name"],
        },
        {
          model: Drivers,
          as: "DriverId",
          attributes: ["id", "capacity", "time", "price"],
          include: [
            {
              model: DriverProfiles,
              as: "Driver",
              attributes: ["driver_name", "photo_url"],
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
        },
      ],
    });

    if (response.length === 0) {
      return res.status(200).json({
        error: false,
        message: "No Transactions Yet!",
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

export const getTransactionById = async (req, res) => {
  try {
    const findTrans = await Transactions.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!findTrans)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });

    const response = await Transactions.findAll({
      attributes: ["id", "total_price", "status", "time"],
      include: [
        {
          model: Users,
          as: "UserId",
          attributes: ["name"],
        },
        {
          model: Drivers,
          as: "DriverId",
          attributes: ["id", "capacity", "time", "price"],
          include: [
            {
              model: DriverProfiles,
              as: "Driver",
              attributes: ["driver_name", "photo_url"],
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

export const createTransaction = async (req, res) => {
  const { driverId, totalPrice, time } = req.body;

  try {
    const user = await Users.findOne({
      where: {
        id: req.thisId,
      },
    });

    const driver = await Drivers.findOne({
      where: {
        [Op.and]: [{ id: driverId }, { available: true }],
      },
    });

    if (!driver && !user)
      return res.status(404).json({
        error: true,
        message: "Data not found",
      });

    if (req.role !== 3)
      return res.status(403).json({
        error: true,
        message: "Request Denied!",
      });

    const book = await Transactions.create({
      user_id: req.thisId,
      driver_id: driver.id,
      total_price: totalPrice,
      status: "pending",
      time: time,
    });

    if (book) {
      await Drivers.update(
        {
          available: false,
        },
        {
          where: {
            id: driverId,
          },
        }
      );
    }

    res.status(201).json({
      error: false,
      message: "Transaction Created Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
  // cek user id nya
  // cek driver id yang dia pilih itu exist atau engga
  // status default nya (pending, booked)
  // waktunya khusus hari ini lah ya
  // setelah booking drivernya tidak tersedia untuk orang lain lagi (tambahin boolean di driver)
};

export const updateTransaction = async (req, res) => {
  const { driverId, totalPrice, time } = req.body;

  try {
    const oldTrans = await Transactions.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!oldTrans)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });

    await Drivers.update(
      {
        available: true,
      },
      {
        where: {
          id: oldTrans.driver_id,
        },
      }
    );

    const user = await Users.findOne({
      where: {
        id: req.thisId,
      },
    });

    const driver = await Drivers.findOne({
      where: {
        [Op.and]: [{ id: driverId }, { available: true }],
      },
    });

    if (!driver && !user)
      return res.status(404).json({
        error: true,
        message: "Data not found",
      });

    if (req.role !== 1)
      return res.status(403).json({
        error: true,
        message: "Request Denied!",
      });

    const book = await Transactions.update(
      {
        user_id: req.thisId,
        driver_id: driver.id,
        total_price: totalPrice,
        status: "pending",
        time: time,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (book) {
      await Drivers.update(
        {
          available: false,
        },
        {
          where: {
            id: driverId,
          },
        }
      );
    }

    res.status(200).json({
      error: false,
      message: "Transaction Updated Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const findTrans = await Transactions.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!findTrans)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });

    if (req.role !== 1)
      return res.status(403).json({
        error: true,
        message: "Access Denied!",
      });

    const delTrans = await Transactions.destroy({
      where: {
        id: findTrans.id,
      },
    });

    if (delTrans) {
      await Drivers.update(
        { available: true },
        {
          where: {
            id: findTrans.driver_id,
          },
        }
      );
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

// Khusus Driver

export const driverTransaction = async (req, res) => {
  try {
    const findProf = await DriverProfiles.findOne({
      where: {
        user_id: req.thisId,
      },
    });
    if (!findProf)
      return res.status(404).json({
        error: true,
        message: "Driver Not Found!",
      });

    const findDriv = await Drivers.findOne({
      where: {
        user_id: findProf.id,
      },
    });
    if (!findDriv)
      return res.status(404).json({
        error: true,
        message: "Driver Not Found!",
      });

    const response = await Transactions.findAll({
      where: {
        driver_id: findDriv.id,
      },
      attributes: ["id", "total_price", "status", "time"],
      include: [
        {
          model: Users,
          as: "UserId",
          attributes: ["name"],
        },
        {
          model: Drivers,
          as: "DriverId",
          attributes: ["id", "capacity", "time", "price"],
          include: [
            {
              model: DriverProfiles,
              as: "Driver",
              attributes: ["driver_name", "photo_url"],
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

export const confirmTransaction = async (req, res) => {
  try {
    const { status } = req.body;

    const findTrans = await Transactions.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!findTrans)
      return res.status(404).json({
        error: true,
        message: "Data Not Found!",
      });

    const findProf = await DriverProfiles.findOne({
      where: {
        user_id: req.thisId,
      },
    });
    if (!findProf)
      return res.status(404).json({
        error: true,
        message: "Driver Not Found!",
      });

    const findDriv = await Drivers.findOne({
      where: {
        user_id: findProf.id,
      },
    });
    if (!findDriv)
      return res.status(404).json({
        error: true,
        message: "Driver Not Found!",
      });

    if (status === "booked") {
      await Transactions.update(
        {
          status: status,
        },
        {
          where: {
            id: findTrans.id,
          },
        }
      );
    } else if (status === "canceled") {
      await Drivers.update(
        { available: true },
        {
          where: {
            id: findTrans.driver_id,
          },
        }
      );
      await Transactions.update(
        {
          status: status,
        },
        {
          where: {
            id: findTrans.id,
          },
        }
      );
    } else {
      return res.status(403).json({
        error: true,
        message: "Status Invalid!",
      });
    }
    res.status(200).json({
      error: false,
      message: "Transaction Updated Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// khusus user

export const userTransaction = async (req, res) => {
  try {
    const findUser = await Users.findOne({
      where: {
        id: req.thisId,
      },
    });
    if (!findUser)
      return res.status(404).json({
        error: true,
        message: "User Not Found!",
      });

    const response = await Transactions.findAll({
      where: {
        user_id: findUser.id,
      },
      attributes: ["id", "total_price", "status", "time"],
      include: [
        {
          model: Users,
          as: "UserId",
          attributes: ["name"],
        },
        {
          model: Drivers,
          as: "DriverId",
          attributes: ["id", "capacity", "time", "price"],
          include: [
            {
              model: DriverProfiles,
              as: "Driver",
              attributes: ["driver_name", "photo_url"],
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
