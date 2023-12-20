import express from "express";
import { getPlace, getPlaceById, createPlace, updatePlace, deletePlace } from "../controllers/place_controller.js";
import { verifyUser, adminOnly } from "../middleware/auth_mid_user.js";

const router = express.Router();

router.get("/places", verifyUser, adminOnly, getPlace);
router.get("/places/:id", verifyUser, adminOnly, getPlaceById);
router.post("/places", verifyUser, adminOnly, createPlace);
router.patch("/places/:id", verifyUser, adminOnly, updatePlace);
router.delete("/places/:id", verifyUser, adminOnly, deletePlace);

export default router;
