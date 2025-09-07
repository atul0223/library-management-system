import express from "express";
import { signIn, login, verifyOtp, getUser } from "../controllers/user.controller";
import  verifyUser  from "../middleware/auth.middleware"

const router = express.Router();

router.post("/signup", signIn);

router.post("/login", login);

router.post("/verifyOtp", verifyOtp);

router.get("/me", verifyUser, getUser);

export default router;