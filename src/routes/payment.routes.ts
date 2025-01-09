import { RequestHandler, Router } from "express";
import {
  ASSIGN_ROOM_TO_LICENSE,
  CANCEL_RESERVATION,
  CHECK_IN_LICENSE,
  CHECK_OUT_LICENSE,
  CREATE_RESERVATION,
  GET_RESERVATION_BY_ID,
  UNASSIGN_ROOM_FROM_LICENSE,
} from "../controllers/reservation.controller";
import { CustomRequest } from "../interfaces/custom-request.interface";
import verifyAccessToken from "../middlewares/verify-token.middleware";
import { VerifyUserRole } from "../middlewares/verify-user-role.middleware";
import {
  ADD_PAYMENT,
  CANCEL_PAYMENT,
  UPDATE_PAYMENT,
} from "../controllers/payment.controller";

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
