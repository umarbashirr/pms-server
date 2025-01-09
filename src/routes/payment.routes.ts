import { RequestHandler, Router } from "express";
import {
  ADD_PAYMENT,
  CANCEL_PAYMENT,
  UPDATE_PAYMENT,
} from "../controllers/payment.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";

const router = Router({ mergeParams: true });

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);

router.route("/").post(ADD_PAYMENT as unknown as RequestHandler<CustomRequest>);
router
  .route("/:paymentId")
  .put(UPDATE_PAYMENT as unknown as RequestHandler<CustomRequest>);
router
  .route("/:paymentId/void")
  .put(CANCEL_PAYMENT as unknown as RequestHandler<CustomRequest>);

export default router;
