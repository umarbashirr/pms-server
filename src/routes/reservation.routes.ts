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

const router = Router({ mergeParams: true });

router.use(verifyAccessToken);
router.use(VerifyUserRole as unknown as RequestHandler<CustomRequest>);

router
  .route("/")
  .post(CREATE_RESERVATION as unknown as RequestHandler<CustomRequest>);

router
  .route("/:reservationId")
  .get(GET_RESERVATION_BY_ID as unknown as RequestHandler<CustomRequest>);

router
  .route("/:reservationId/cancel")
  .put(CANCEL_RESERVATION as unknown as RequestHandler<CustomRequest>);

router
  .route("/:reservationId/licences/:licenseId/check-in")
  .put(CHECK_IN_LICENSE as unknown as RequestHandler<CustomRequest>);

router
  .route("/:reservationId/licences/:licenseId/check-out")
  .put(CHECK_OUT_LICENSE as unknown as RequestHandler<CustomRequest>);

router
  .route("/:reservationId/licences/:licenseId/room-assign")
  .put(ASSIGN_ROOM_TO_LICENSE as unknown as RequestHandler<CustomRequest>);

router
  .route("/:reservationId/licences/:licenseId/room-unassign")
  .put(UNASSIGN_ROOM_FROM_LICENSE as unknown as RequestHandler<CustomRequest>);

export default router;
