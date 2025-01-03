import { Router } from "express";
import { USER_REGISTRATION, USER_LOGIN } from "../controllers/auth.controller";
import verifyAccessToken from "../middlewares/verify-token.middleware";

const router = Router();

router.route("/register").post(USER_REGISTRATION);
router.route("/login").post(verifyAccessToken, USER_LOGIN);

export default router;
