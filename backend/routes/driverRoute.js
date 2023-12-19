import express from "express";
import { getDriver, getDriverById, createDriver, updateDriver, deleteDriver } from "../controllers/driver_controller.js";
import { verifyUser } from "../middleware/auth_mid_user.js";

const router = express.Router();

router.get("/drivers", verifyUser, getDriver);
router.get("/drivers/:id", verifyUser, getDriverById);
router.post("/drivers", verifyUser, createDriver);
router.patch("/drivers/:id", verifyUser, updateDriver);
router.delete("/drivers/:id", verifyUser, deleteDriver);

export default router;
