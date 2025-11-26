import express from "express";
import { resetUsers } from "../controllers/reset.controller.js";

const router = express.Router();
router.get("/reset-users", resetUsers);

export default router;
