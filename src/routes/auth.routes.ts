import { RequestHandler, Router } from "express";
import {
  HasAdminRights,
  USER_LOGIN,
  USER_LOGOUT,
  USER_REGISTRATION,
  USER_REGISTRATION_INTERNAL,
  VALIDATE_USER,
} from "../controllers/auth.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";
import { VerifyUserAdminAccess } from "../middlewares/verify-admin-access.middleware";

const router = Router();

router.route("/register").post(USER_REGISTRATION);
router.route("/register/server/team/internal").post(USER_REGISTRATION_INTERNAL);
router.route("/login").post(USER_LOGIN);
router.route("/logout").post(USER_LOGOUT);

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);
router
  .route("/validate")
  .get(VALIDATE_USER as unknown as RequestHandler<CustomRequest>);

router.use(VerifyUserAdminAccess as unknown as RequestHandler<CustomRequest>);
router.get(
  "/check-auth",
  HasAdminRights as unknown as RequestHandler<CustomRequest>
);

export default router;
