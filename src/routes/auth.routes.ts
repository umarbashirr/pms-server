import { Router } from "express";
import {
  USER_LOGIN,
  USER_REGISTRATION,
  USER_REGISTRATION_INTERNAL,
} from "../controllers/auth.controller";

const router = Router();

router.route("/register").post(USER_REGISTRATION);
router.route("/register/server/team/internal").post(USER_REGISTRATION_INTERNAL);
router.route("/login").post(USER_LOGIN);

export default router;
