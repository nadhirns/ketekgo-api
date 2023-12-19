import express from "express";
import { getPlace, getPlaceById, createPlace, updatePlace, deletePlace } from "../controllers/place_controller.js";

const router = express.Router();

router.get("/places", getPlace);
router.get("/places/:id", getPlaceById);
router.post("/places", createPlace);
router.patch("/places/:id", updatePlace);
router.delete("/places/:id", deletePlace);

export default router;
