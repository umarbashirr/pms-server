import { Router } from "express";
import { USER_LOGIN, USER_REGISTRATION } from "../controllers/auth.controller";

const router = Router();

router.route("/register").post(USER_REGISTRATION);
router.route("/login").post(USER_LOGIN);

export default router;
